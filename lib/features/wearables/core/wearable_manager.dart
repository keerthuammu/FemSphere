import 'dart:async';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
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

  /// Sets the active wearable device and wires up real-time telemetry streams
  void setActiveDevice(WearableDevice device) {
    _hrSub?.cancel();
    _activeDevice = device;
    _activeDeviceController.add(device);

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
    }
  }
}
