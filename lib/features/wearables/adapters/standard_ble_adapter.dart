import '../core/device_brand.dart';
import '../core/wearable_capabilities.dart';
import 'base_ble_adapter.dart';

/// Standard Bluetooth LE Adapter
/// Handles standard Bluetooth SIG profiles:
/// - Heart Rate Service (0x180D)
/// - Battery Service (0x180F)
/// - Pulse Oximeter Service (0x1822)
/// - Health Thermometer Service (0x1809)
/// - Running Speed & Cadence Service (0x1814)
/// Used for boAt, Noise, OnePlus, Realme, and generic BLE fitness trackers.
class StandardBleAdapter extends BaseBleAdapter {
  WearableCapabilities _capabilities = const WearableCapabilities(
    heartRate: true,
    restingHeartRate: false,
    steps: true,
    calories: true,
    distance: true,
    sleep: false,
    spo2: false,
    bodyTemperature: false,
    battery: true,
    realTimeStream: true,
  );

  StandardBleAdapter({
    required super.bluetoothDevice,
    required super.syncService,
    super.brand = DeviceBrand.genericBle,
    super.model = 'Standard BLE Tracker',
  });

  @override
  WearableCapabilities get capabilities => _capabilities;

  @override
  Future<void> onConnected() async {
    try {
      final services = await bluetoothDevice.discoverServices();
      bool hasHr = false;
      bool hasSpO2 = false;
      bool hasTemp = false;
      bool hasSteps = false;

      for (final s in services) {
        final uuidStr = s.uuid.toString().toLowerCase();
        if (uuidStr.contains('180d')) hasHr = true;
        if (uuidStr.contains('1822')) hasSpO2 = true;
        if (uuidStr.contains('1809')) hasTemp = true;
        if (uuidStr.contains('1814')) hasSteps = true;
      }

      _capabilities = WearableCapabilities(
        heartRate: hasHr,
        restingHeartRate: false,
        steps: hasSteps,
        calories: hasSteps,
        distance: hasSteps,
        sleep: false,
        spo2: hasSpO2,
        bodyTemperature: hasTemp,
        battery: true,
        realTimeStream: hasHr,
      );

      // Setup Heart Rate notifications
      if (hasHr) {
        await setupStandardHeartRateSubscription(services);
      }
    } catch (_) {}
  }
}
