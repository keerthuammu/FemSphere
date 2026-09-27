import '../core/device_brand.dart';
import '../core/wearable_capabilities.dart';
import 'base_ble_adapter.dart';

/// Huawei Watch Adapter (Watch GT, Watch Fit, Band series)
/// Connects via BLE GATT and Huawei Health.
class HuaweiAdapter extends BaseBleAdapter {
  final WearableCapabilities _capabilities = const WearableCapabilities(
    heartRate: true,
    restingHeartRate: true,
    steps: true,
    calories: true,
    distance: true,
    sleep: false,
    spo2: true,
    battery: true,
    realTimeStream: true,
  );

  HuaweiAdapter({
    required super.bluetoothDevice,
    required super.syncService,
    super.model = 'Huawei Watch GT',
  }) : super(
          brand: DeviceBrand.huawei,
        );

  @override
  WearableCapabilities get capabilities => _capabilities;

  @override
  Future<void> onConnected() async {
    try {
      final services = await bluetoothDevice.discoverServices();
      await setupStandardHeartRateSubscription(services);
    } catch (_) {}
  }
}
