import '../core/device_brand.dart';
import '../core/wearable_capabilities.dart';
import 'base_ble_adapter.dart';

/// Xiaomi & Redmi Watch Adapter (Xiaomi Smart Band, Redmi Watch series)
class XiaomiAdapter extends BaseBleAdapter {
  final WearableCapabilities _capabilities = const WearableCapabilities(
    heartRate: true,
    restingHeartRate: true,
    steps: true,
    calories: true,
    distance: true,
    sleep: false,
    spo2: false,
    battery: true,
    realTimeStream: true,
  );

  XiaomiAdapter({
    required super.bluetoothDevice,
    required super.syncService,
    super.model = 'Xiaomi Smart Band',
  }) : super(
          brand: DeviceBrand.xiaomi,
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
