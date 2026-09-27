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

  void setConnectionState(DeviceConnectionState state) {
    _state = state;
  }

  @override
  Future<bool> isConnected() async {
    return bluetoothDevice.isConnected;
  }

  @override
  Future<bool> connect() async {
    try {
      _state = DeviceConnectionState.connecting;

      if (!bluetoothDevice.isConnected) {
        await bluetoothDevice.connect(
          timeout: const Duration(seconds: 15),
          autoConnect: false,
        );
      }

      _deviceStateSub = bluetoothDevice.connectionState.listen((state) {
        if (state == BluetoothConnectionState.connected) {
          _state = DeviceConnectionState.connected;
        } else if (state == BluetoothConnectionState.disconnected) {
          _state = DeviceConnectionState.disconnected;
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
      return false;
    }
  }

  @override
  Future<void> disconnect() async {
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
              final val = await c.read();
              if (val.isNotEmpty) {
                _lastBatteryLevel = val[0];
                return _lastBatteryLevel;
              }
            }
          }
        }
      }
    } catch (_) {}
    return _lastBatteryLevel;
  }

  /// Helper to subscribe to standard BLE Heart Rate Service (0x180D / 0x2A37)
  Future<void> setupStandardHeartRateSubscription(List<BluetoothService> services) async {
    for (final s in services) {
      if (s.uuid.toString().toLowerCase().contains('180d')) {
        for (final c in s.characteristics) {
          if (c.uuid.toString().toLowerCase().contains('2a37')) {
            await c.setNotifyValue(true);
            c.lastValueStream.listen((bytes) {
              if (bytes.isNotEmpty) {
                final flags = bytes[0];
                final is16Bit = (flags & 0x01) != 0;
                int bpm = 0;
                if (is16Bit && bytes.length >= 3) {
                  bpm = bytes[1] | (bytes[2] << 8);
                } else if (bytes.length >= 2) {
                  bpm = bytes[1];
                }
                if (bpm > 0) {
                  _lastHeartRate = bpm;
                  _hrController.add(bpm);
                }
              }
            });
          }
        }
      }
    }
  }

  void updateMetrics({int? hr, int? steps, double? distanceMeters, int? calories}) {
    if (hr != null) _lastHeartRate = hr;
    if (steps != null) _lastSteps = steps;
    if (distanceMeters != null) _lastDistanceMeters = distanceMeters;
    if (calories != null) _lastCalories = calories;
  }

  @override
  Future<WearableHealthData> readCurrentData() async {
    return WearableHealthData(
      heartRate: _lastHeartRate,
      steps: _lastSteps,
      distanceMeters: _lastDistanceMeters,
      calories: _lastCalories,
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
        batteryLevel: battery,
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
