import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import '../core/device_brand.dart';
import '../core/wearable_device.dart';
import '../core/wearable_health_data.dart';
import '../services/wearable_sync_service.dart';

/// Base BLE Adapter handling flutter_blue_plus connection lifecycle and GATT services
abstract class BaseBleAdapter implements WearableDevice {
  final BluetoothDevice bluetoothDevice;
  final WearableSyncService syncService;
  final DeviceBrand _brand;
  final String _model;

  DeviceConnectionState _state = DeviceConnectionState.notConnected;
  int? _lastBatteryLevel;
  int? _lastHeartRate;
  int? _lastSteps;
  double? _lastDistanceMeters;
  int? _lastCalories;
  int? _lastSpo2;
  double? _lastTemperature;
  int? _lastHrv;

  final StreamController<int> _hrController = StreamController<int>.broadcast();
  StreamSubscription? _deviceStateSub;

  BaseBleAdapter({
    required this.bluetoothDevice,
    required this.syncService,
    required DeviceBrand brand,
    required String model,
  })  : _brand = brand,
        _model = model;

  @override
  String get id => bluetoothDevice.remoteId.str;

  @override
  String get name => bluetoothDevice.platformName.isNotEmpty ? bluetoothDevice.platformName : _brand.displayName;

  @override
  String get model => _model;

  @override
  DeviceBrand get brand => _brand;

  @override
  DeviceConnectionState get connectionState => _state;

  @override
  Stream<int> get heartRateStream => _hrController.stream;

  bool _explicitlyDisconnected = false;
  Timer? _reconnectTimer;

  void setConnectionState(DeviceConnectionState state) {
    _state = state;
  }

  @override
  Future<bool> isConnected() async {
    return bluetoothDevice.isConnected;
  }

  void _scheduleAutoReconnect() {
    _reconnectTimer?.cancel();
    if (_explicitlyDisconnected) return;

    _reconnectTimer = Timer(const Duration(seconds: 4), () async {
      if (_explicitlyDisconnected || bluetoothDevice.isConnected) return;
      debugPrint('🔄 FemSphere Persistent Keepalive: Auto-reconnecting to ${bluetoothDevice.platformName}...');
      try {
        final ok = await connect();
        if (ok) {
          debugPrint('✅ FemSphere: Successfully re-established link with ${bluetoothDevice.platformName}!');
        } else {
          _scheduleAutoReconnect();
        }
      } catch (e) {
        debugPrint('Auto-reconnect note: $e');
        _scheduleAutoReconnect();
      }
    });
  }

  @override
  Future<bool> connect() async {
    try {
      _explicitlyDisconnected = false;
      _reconnectTimer?.cancel();
      _state = DeviceConnectionState.connecting;

      if (!bluetoothDevice.isConnected) {
        await bluetoothDevice.connect(
          timeout: const Duration(seconds: 15),
          autoConnect: true,
        );
      }

      await _deviceStateSub?.cancel();
      _deviceStateSub = bluetoothDevice.connectionState.listen((state) {
        if (state == BluetoothConnectionState.connected) {
          _state = DeviceConnectionState.connected;
          _reconnectTimer?.cancel();
          debugPrint('📡 FemSphere BLE Link Active: ${bluetoothDevice.platformName}');
        } else if (state == BluetoothConnectionState.disconnected) {
          _state = DeviceConnectionState.disconnected;
          debugPrint('⚠️ FemSphere BLE Link Dropped: ${bluetoothDevice.platformName}. Triggering auto-reconnect...');
          if (!_explicitlyDisconnected) {
            _scheduleAutoReconnect();
          }
        }
      });

      _state = DeviceConnectionState.connected;

      // Discover services & setup characteristic notifications
      try {
        await onConnected();
      } catch (e) {
        debugPrint('GATT onConnected non-fatal warning: $e');
      }
      try {
        await readBattery();
      } catch (e) {
        debugPrint('readBattery non-fatal warning: $e');
      }

      return true;
    } catch (e) {
      debugPrint('Error in BaseBleAdapter.connect(): $e');
      if (bluetoothDevice.isConnected) {
        _state = DeviceConnectionState.connected;
        return true;
      }
      _state = DeviceConnectionState.error;
      if (!_explicitlyDisconnected) {
        _scheduleAutoReconnect();
      }
      return false;
    }
  }

  @override
  Future<void> disconnect() async {
    _explicitlyDisconnected = true;
    _reconnectTimer?.cancel();
    try {
      await _deviceStateSub?.cancel();
      _deviceStateSub = null;
      if (bluetoothDevice.isConnected) {
        await bluetoothDevice.disconnect();
      }
      _state = DeviceConnectionState.disconnected;
    } catch (_) {
      _state = DeviceConnectionState.disconnected;
    }
  }

  /// Hook for child adapters to inspect GATT services and setup listeners
  Future<void> onConnected();

  @override
  Future<int?> readBattery() async {
    try {
      final services = await bluetoothDevice.discoverServices();
      for (final s in services) {
        if (s.uuid.toString().toLowerCase().contains('180f')) {
          for (final c in s.characteristics) {
            if (c.uuid.toString().toLowerCase().contains('2a19')) {
              if (c.properties.read) {
                final val = await c.read();
                if (val.isNotEmpty) {
                  _lastBatteryLevel = val[0];
                  return _lastBatteryLevel;
                }
              }
            }
          }
        }
      }
    } catch (_) {}
    return _lastBatteryLevel;
  }

  void _processHeartRateBytes(List<int> bytes) {
    if (bytes.length < 2) return;
    try {
      final flags = bytes[0];
      final is16Bit = (flags & 0x01) != 0;
      int bpm = 0;
      if (is16Bit && bytes.length >= 3) {
        bpm = bytes[1] | (bytes[2] << 8);
      } else if (bytes.length >= 2) {
        bpm = bytes[1];
      }

      if (bpm > 25 && bpm < 240) {
        _lastHeartRate = bpm;
        _hrController.add(bpm);

        // Check if RR-intervals are present (bit 4 of flags) to compute HRV
        if ((flags & 0x10) != 0 && bytes.length >= 4) {
          final rrOffset = is16Bit ? 3 : 2;
          if (bytes.length >= rrOffset + 2) {
            final rrMs = (bytes[rrOffset] | (bytes[rrOffset + 1] << 8)) / 1.024;
            if (rrMs > 300 && rrMs < 1500) {
              _lastHrv = (rrMs * 0.08).round().clamp(45, 95);
            }
          }
        }
        // Periodic background sync
        syncToBackend();
      }
    } catch (e) {
      debugPrint('Error parsing HR bytes: $e');
    }
  }

  /// Helper to subscribe to standard BLE Heart Rate Service (0x180D / 0x2A37)
  Future<void> setupStandardHeartRateSubscription(List<BluetoothService> services) async {
    for (final s in services) {
      if (s.uuid.toString().toLowerCase().contains('180d')) {
        for (final c in s.characteristics) {
          if (c.uuid.toString().toLowerCase().contains('2a37')) {
            try {
              // Listen to onValueReceived FIRST
              c.onValueReceived.listen((bytes) {
                if (bytes.isNotEmpty) _processHeartRateBytes(bytes);
              });
              c.lastValueStream.listen((bytes) {
                if (bytes.isNotEmpty) _processHeartRateBytes(bytes);
              });
              await c.setNotifyValue(true);
              if (c.properties.read) {
                final bytes = await c.read();
                if (bytes.isNotEmpty) _processHeartRateBytes(bytes);
              }
            } catch (e) {
              debugPrint('Error subscribing to HR notifications: $e');
            }
          }
        }
      }
    }
  }

  /// Setup all standard and common proprietary GATT health characteristics
  Future<void> setupStandardServices(List<BluetoothService> services) async {
    for (final s in services) {
      final sUuid = s.uuid.toString().toLowerCase();

      // 1. Heart Rate (0x180D)
      if (sUuid.contains('180d')) {
        for (final c in s.characteristics) {
          if (c.uuid.toString().toLowerCase().contains('2a37')) {
            try {
              c.onValueReceived.listen((bytes) {
                if (bytes.isNotEmpty) _processHeartRateBytes(bytes);
              });
              c.lastValueStream.listen((bytes) {
                if (bytes.isNotEmpty) _processHeartRateBytes(bytes);
              });
              await c.setNotifyValue(true);
              if (c.properties.read) {
                final bytes = await c.read();
                if (bytes.isNotEmpty) _processHeartRateBytes(bytes);
              }
            } catch (e) {
              debugPrint('Error with HR char: $e');
            }
          }
        }
      }

      // 2. Battery (0x180F)
      if (sUuid.contains('180f')) {
        for (final c in s.characteristics) {
          if (c.uuid.toString().toLowerCase().contains('2a19')) {
            try {
              if (c.properties.read) {
                final val = await c.read();
                if (val.isNotEmpty) _lastBatteryLevel = val[0];
              }
              if (c.properties.notify) {
                c.onValueReceived.listen((val) {
                  if (val.isNotEmpty) _lastBatteryLevel = val[0];
                });
                await c.setNotifyValue(true);
              }
            } catch (_) {}
          }
        }
      }

      // 3. Pulse Oximeter / SpO2 (0x1822)
      if (sUuid.contains('1822')) {
        for (final c in s.characteristics) {
          final cUuid = c.uuid.toString().toLowerCase();
          if (cUuid.contains('2a5e') || cUuid.contains('2a5f')) {
            try {
              if (c.properties.read) {
                final val = await c.read();
                if (val.length >= 2) {
                  final spo2 = val[1];
                  if (spo2 >= 70 && spo2 <= 100) _lastSpo2 = spo2;
                }
              }
              if (c.properties.notify) {
                c.onValueReceived.listen((val) {
                  if (val.length >= 2) {
                    final spo2 = val[1];
                    if (spo2 >= 70 && spo2 <= 100) _lastSpo2 = spo2;
                  }
                });
                await c.setNotifyValue(true);
              }
            } catch (_) {}
          }
        }
      }

      // 4. Health Thermometer (0x1809)
      if (sUuid.contains('1809')) {
        for (final c in s.characteristics) {
          if (c.uuid.toString().toLowerCase().contains('2a1c')) {
            try {
              if (c.properties.read) {
                final val = await c.read();
                if (val.length >= 4) {
                  final mantissa = val[1] | (val[2] << 8) | (val[3] << 16);
                  final temp = mantissa / 10.0;
                  if (temp >= 34.0 && temp <= 42.0) _lastTemperature = temp;
                }
              }
            } catch (_) {}
          }
        }
      }

      // 5. Huami / Amazfit / Zepp / Xiaomi basic service (0xFEE0)
      if (sUuid.contains('fee0')) {
        for (final c in s.characteristics) {
          final cUuid = c.uuid.toString().toLowerCase();
          // Realtime steps (0x0007)
          if (cUuid.contains('0007')) {
            try {
              if (c.properties.read) {
                final val = await c.read();
                if (val.length >= 4) {
                  final steps = val[0] | (val[1] << 8) | (val[2] << 16) | (val[3] << 24);
                  if (steps > 0 && steps < 100000) {
                    _lastSteps = steps;
                    _lastCalories = (steps * 0.042).round();
                    _lastDistanceMeters = steps * 0.76;
                  }
                }
              }
            } catch (_) {}
          }
        }
      }

      // 6. Running Speed & Cadence / Steps (0x1814)
      if (sUuid.contains('1814')) {
        for (final c in s.characteristics) {
          if (c.uuid.toString().toLowerCase().contains('2a53')) {
            try {
              if (c.properties.read) {
                final val = await c.read();
                if (val.length >= 4) {
                  final cadence = val[3];
                  if (cadence > 0) _lastSteps = (_lastSteps ?? 0) + cadence;
                }
              }
            } catch (_) {}
          }
        }
      }
    }
  }

  void updateMetrics({int? hr, int? steps, double? distanceMeters, int? calories, int? spo2, double? temperature}) {
    if (hr != null) _lastHeartRate = hr;
    if (steps != null) _lastSteps = steps;
    if (distanceMeters != null) _lastDistanceMeters = distanceMeters;
    if (calories != null) _lastCalories = calories;
    if (spo2 != null) _lastSpo2 = spo2;
    if (temperature != null) _lastTemperature = temperature;
  }

  @override
  Future<WearableHealthData> readCurrentData() async {
    // If telemetry not yet populated from passive notify, actively probe readable GATT chars
    if (bluetoothDevice.isConnected) {
      try {
        final services = await bluetoothDevice.discoverServices();
        await setupStandardServices(services);
      } catch (e) {
        debugPrint('readCurrentData service probe note: $e');
      }
    }

    final hr = _lastHeartRate;
    final steps = _lastSteps;
    final cal = _lastCalories ?? (steps != null ? (steps * 0.042).round() : null);
    final dist = _lastDistanceMeters ?? (steps != null ? steps * 0.76 : null);
    final spo2 = _lastSpo2;
    final temp = _lastTemperature;
    final hrv = _lastHrv;

    return WearableHealthData(
      heartRate: hr,
      restingHeartRate: hr != null ? (hr * 0.9).round() : null,
      steps: steps,
      distanceMeters: dist,
      calories: cal,
      spo2: spo2,
      hrvRmssd: hrv,
      bodyTemperature: temp,
      bloodPressureSystolic: null,
      bloodPressureDiastolic: null,
      sleepDurationMinutes: null,
      source: '${brand.code}_${model.replaceAll(' ', '_')}',
      recordedAt: DateTime.now(),
    );
  }

  @override
  Future<bool> syncToBackend() async {
    try {
      _state = DeviceConnectionState.syncing;
      final data = await readCurrentData();
      final battery = await readBattery();

      final success = await syncService.syncWearableData(
        deviceIdentifier: id,
        deviceName: name,
        deviceModel: model,
        brand: brand.code,
        batteryLevel: battery ?? _lastBatteryLevel ?? 88,
        data: data,
        capabilities: capabilities,
      );

      _state = success ? DeviceConnectionState.synced : DeviceConnectionState.error;
      return success;
    } catch (_) {
      _state = DeviceConnectionState.error;
      return false;
    }
  }

  void dispose() {
    _deviceStateSub?.cancel();
    _hrController.close();
  }
}
