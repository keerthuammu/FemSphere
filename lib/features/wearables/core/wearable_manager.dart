import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../adapters/amazfit_adapter.dart';
import '../adapters/apple_watch_adapter.dart';
import '../adapters/fitbit_adapter.dart';
import '../adapters/garmin_adapter.dart';
import '../adapters/huawei_adapter.dart';
import '../adapters/pixel_watch_adapter.dart';
import '../adapters/samsung_galaxy_adapter.dart';
import '../adapters/standard_ble_adapter.dart';
import '../adapters/xiaomi_adapter.dart';
import '../services/wearable_sync_service.dart';
import 'device_brand.dart';
import 'wearable_device.dart';

/// Universal Wearable Manager
/// Central orchestrator and factory that dynamically detects, instantiates,
/// and manages wearable device adapters across all brands.
class WearableManager {
  static final WearableManager _instance = WearableManager._internal();
  factory WearableManager() => _instance;
  WearableManager._internal();

  final WearableSyncService syncService = WearableSyncService();

  WearableDevice? _activeDevice;
  WearableDevice? get activeDevice => _activeDevice;

  final StreamController<WearableDevice?> _activeDeviceController =
      StreamController<WearableDevice?>.broadcast();
  Stream<WearableDevice?> get activeDeviceStream => _activeDeviceController.stream;

  final StreamController<int> _liveHeartRateController =
      StreamController<int>.broadcast();
  Stream<int> get liveHeartRateStream => _liveHeartRateController.stream;

  StreamSubscription? _hrSub;

  /// Detect brand from device name and advertised service UUIDs
  DeviceBrand detectBrand(String deviceName, List<Guid> serviceUuids) {
    final lower = deviceName.toLowerCase();

    // Check specific Huami / Zepp UUIDs
    for (final u in serviceUuids) {
      final str = u.toString().toLowerCase();
      if (str.contains('fee0') || str.contains('fee1')) {
        return DeviceBrand.amazfit;
      }
    }

    return DeviceBrand.detectFromName(lower);
  }

  /// Factory method: Instantiates the appropriate adapter for a BLE peripheral
  WearableDevice createBleAdapter(BluetoothDevice device, {DeviceBrand? forceBrand}) {
    final brand = forceBrand ?? DeviceBrand.detectFromName(device.platformName);

    switch (brand) {
      case DeviceBrand.amazfit:
        return AmazfitAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          model: device.platformName.isNotEmpty ? device.platformName : 'Amazfit Bip U Pro',
        );
      case DeviceBrand.huawei:
        return HuaweiAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          model: device.platformName.isNotEmpty ? device.platformName : 'Huawei Watch',
        );
      case DeviceBrand.xiaomi:
        return XiaomiAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          model: device.platformName.isNotEmpty ? device.platformName : 'Xiaomi Watch',
        );
      case DeviceBrand.boAt:
        return StandardBleAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          brand: DeviceBrand.boAt,
          model: device.platformName.isNotEmpty ? device.platformName : 'boAt Wave Beat',
        );
      case DeviceBrand.noise:
        return StandardBleAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          brand: DeviceBrand.noise,
          model: device.platformName.isNotEmpty ? device.platformName : 'Noise ColorFit',
        );
      case DeviceBrand.onePlus:
        return StandardBleAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          brand: DeviceBrand.onePlus,
          model: device.platformName.isNotEmpty ? device.platformName : 'OnePlus Watch',
        );
      case DeviceBrand.realme:
        return StandardBleAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          brand: DeviceBrand.realme,
          model: device.platformName.isNotEmpty ? device.platformName : 'Realme Watch',
        );
      case DeviceBrand.fireBoltt:
        return StandardBleAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          brand: DeviceBrand.fireBoltt,
          model: device.platformName.isNotEmpty ? device.platformName : 'Fire-Boltt Watch',
        );
      case DeviceBrand.titan:
        return StandardBleAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          brand: DeviceBrand.titan,
          model: device.platformName.isNotEmpty ? device.platformName : 'Titan Smart',
        );
      case DeviceBrand.ouraRing:
        return StandardBleAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          brand: DeviceBrand.ouraRing,
          model: device.platformName.isNotEmpty ? device.platformName : 'Oura Ring Gen3',
        );
      case DeviceBrand.whoop:
        return StandardBleAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          brand: DeviceBrand.whoop,
          model: device.platformName.isNotEmpty ? device.platformName : 'Whoop 4.0',
        );
      case DeviceBrand.polar:
        return StandardBleAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          brand: DeviceBrand.polar,
          model: device.platformName.isNotEmpty ? device.platformName : 'Polar H10 / Verity',
        );
      case DeviceBrand.suunto:
        return StandardBleAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          brand: DeviceBrand.suunto,
          model: device.platformName.isNotEmpty ? device.platformName : 'Suunto Watch',
        );
      case DeviceBrand.smartBottle:
        return StandardBleAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          brand: DeviceBrand.smartBottle,
          model: device.platformName.isNotEmpty ? device.platformName : 'Smart Water Bottle',
        );
      default:
        return StandardBleAdapter(
          bluetoothDevice: device,
          syncService: syncService,
          brand: brand,
          model: device.platformName.isNotEmpty ? device.platformName : 'BLE Wearable',
        );
    }
  }

  /// Factory method: Instantiates a companion / Health Connect bridge adapter
  WearableDevice createCompanionAdapter(DeviceBrand brand, {String? deviceName, String? model}) {
    switch (brand) {
      case DeviceBrand.appleWatch:
        return AppleWatchAdapter(
          name: deviceName ?? 'Apple Watch',
          model: model ?? 'Apple Watch Series 9',
          syncService: syncService,
        );
      case DeviceBrand.samsungGalaxy:
        return SamsungGalaxyAdapter(
          name: deviceName ?? 'Samsung Galaxy Watch',
          model: model ?? 'Galaxy Watch 6',
          syncService: syncService,
        );
      case DeviceBrand.googlePixel:
        return PixelWatchAdapter(
          name: deviceName ?? 'Google Pixel Watch',
          model: model ?? 'Pixel Watch 2',
          syncService: syncService,
        );
      case DeviceBrand.garmin:
        return GarminAdapter(
          name: deviceName ?? 'Garmin Watch',
          model: model ?? 'Forerunner 265',
          syncService: syncService,
        );
      case DeviceBrand.fitbit:
        return FitbitAdapter(
          name: deviceName ?? 'Fitbit Tracker',
          model: model ?? 'Fitbit Charge 6',
          syncService: syncService,
        );
      default:
        throw UnsupportedError('Companion adapter not available for $brand');
    }
  }

  static const String _keyLastDeviceId = 'femsphere_last_wearable_id';
  static const String _keyLastDeviceName = 'femsphere_last_wearable_name';
  static const String _keyLastDeviceBrand = 'femsphere_last_wearable_brand';

  /// Save last successfully connected wearable info to persistent storage
  Future<void> saveLastConnectedDevice({
    required String id,
    required String name,
    required String brand,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyLastDeviceId, id);
      await prefs.setString(_keyLastDeviceName, name);
      await prefs.setString(_keyLastDeviceBrand, brand);
      debugPrint('Saved last connected wearable: $name ($id)');
    } catch (e) {
      debugPrint('Error saving last connected wearable: $e');
    }
  }

  /// Get last connected device details from persistent storage
  Future<Map<String, String>?> getLastConnectedDevice() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final id = prefs.getString(_keyLastDeviceId);
      final name = prefs.getString(_keyLastDeviceName);
      final brand = prefs.getString(_keyLastDeviceBrand);
      if (id != null && id.isNotEmpty) {
        return {
          'id': id,
          'name': name ?? 'Smartwatch',
          'brand': brand ?? 'GENERIC_BLE',
        };
      }
    } catch (_) {}
    return null;
  }

  /// Clear saved wearable info
  Future<void> clearLastConnectedDevice() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_keyLastDeviceId);
      await prefs.remove(_keyLastDeviceName);
      await prefs.remove(_keyLastDeviceBrand);
    } catch (_) {}
  }

  /// Automatically connects to any smartwatch that is already connected or bonded in phone Bluetooth
  /// Eliminates the need for the user to manually connect every time.
  Future<WearableDevice?> autoConnectIfBluetoothConnected() async {
    if (_activeDevice != null && _activeDevice!.connectionState == DeviceConnectionState.connected) {
      return _activeDevice;
    }

    try {
      final isSupported = await FlutterBluePlus.isSupported;
      if (!isSupported) return null;

      final lastSaved = await getLastConnectedDevice();
      final savedId = lastSaved?['id'];
      final savedName = lastSaved?['name'];

      // 1. Check system devices (already connected to Android/iOS OS Bluetooth stack)
      List<BluetoothDevice> systemDevs = [];
      try {
        systemDevs = await FlutterBluePlus.systemDevices([]);
      } catch (e) {
        debugPrint('Error querying system devices: $e');
      }

      BluetoothDevice? targetDevice;
      DeviceBrand? targetBrand;

      // 1a. Match by saved ID or saved name
      for (final dev in systemDevs) {
        final devId = dev.remoteId.str.toUpperCase();
        final devName = dev.platformName.toLowerCase();

        if (savedId != null && devId == savedId.toUpperCase()) {
          targetDevice = dev;
          break;
        }
        if (savedName != null && savedName.isNotEmpty && devName.contains(savedName.toLowerCase())) {
          targetDevice = dev;
          break;
        }
      }

      // 1b. If no saved match, check if ANY system device is an active smartwatch
      if (targetDevice == null) {
        for (final dev in systemDevs) {
          final brand = detectBrand(dev.platformName, []);
          final nameLower = dev.platformName.toLowerCase();
          final isWatch = brand != DeviceBrand.genericBle ||
              nameLower.contains('watch') ||
              nameLower.contains('band') ||
              nameLower.contains('fit') ||
              nameLower.contains('wave') ||
              nameLower.contains('beat') ||
              nameLower.contains('colorfit') ||
              nameLower.contains('bip') ||
              nameLower.contains('ring') ||
              nameLower.contains('strap');
          if (isWatch && dev.platformName.isNotEmpty) {
            targetDevice = dev;
            targetBrand = brand;
            break;
          }
        }
      }

      // 2. If not found in connected system devices, check bonded devices
      if (targetDevice == null) {
        List<BluetoothDevice> bondedDevs = [];
        try {
          bondedDevs = await FlutterBluePlus.bondedDevices;
        } catch (_) {}

        for (final dev in bondedDevs) {
          final devId = dev.remoteId.str.toUpperCase();
          final devName = dev.platformName.toLowerCase();

          if (savedId != null && devId == savedId.toUpperCase()) {
            targetDevice = dev;
            break;
          }
          if (savedName != null && savedName.isNotEmpty && devName.contains(savedName.toLowerCase())) {
            targetDevice = dev;
            break;
          }
        }

        if (targetDevice == null) {
          for (final dev in bondedDevs) {
            final brand = detectBrand(dev.platformName, []);
            final nameLower = dev.platformName.toLowerCase();
            final isWatch = brand != DeviceBrand.genericBle ||
                nameLower.contains('watch') ||
                nameLower.contains('band') ||
                nameLower.contains('fit');
            if (isWatch && dev.platformName.isNotEmpty) {
              targetDevice = dev;
              targetBrand = brand;
              break;
            }
          }
        }
      }

      // 3. Connect to the target device if found
      if (targetDevice != null) {
        final brand = targetBrand ?? detectBrand(targetDevice.platformName, []);
        final adapter = createBleAdapter(targetDevice, forceBrand: brand);

        try {
          await adapter.connect();
          setActiveDevice(adapter);
          await saveLastConnectedDevice(
            id: targetDevice.remoteId.str,
            name: targetDevice.platformName.isNotEmpty ? targetDevice.platformName : 'Smartwatch',
            brand: brand.code,
          );
          try {
            await adapter.syncToBackend();
          } catch (_) {}
          debugPrint('Successfully auto-connected to watch: ${targetDevice.platformName}');
          return adapter;
        } catch (e) {
          debugPrint('Auto-connect BLE link attempt note: $e');
        }
      }
    } catch (e) {
      debugPrint('autoConnectIfBluetoothConnected exception: $e');
    }
    return null;
  }

  /// Sets the active wearable device and wires up real-time telemetry streams
  void setActiveDevice(WearableDevice device) {
    _hrSub?.cancel();
    _activeDevice = device;
    _activeDeviceController.add(device);

    saveLastConnectedDevice(
      id: device.id,
      name: device.name,
      brand: device.brand.code,
    );

    _hrSub = device.heartRateStream.listen((bpm) {
      _liveHeartRateController.add(bpm);
    });
  }

  /// Disconnects active wearable
  Future<void> disconnectActiveDevice() async {
    if (_activeDevice != null) {
      await _activeDevice!.disconnect();
      _hrSub?.cancel();
      _activeDevice = null;
      _activeDeviceController.add(null);
      await clearLastConnectedDevice();
    }
  }
}
