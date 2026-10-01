import '../core/device_brand.dart';
import '../core/wearable_capabilities.dart';
import 'base_ble_adapter.dart';

/// Amazfit & Zepp OS Wearable Adapter (Amazfit Bip U Pro, GTR, GTS, Band series)
class AmazfitAdapter extends BaseBleAdapter {
  static const String huamiBasicServiceUuid = '0000fee0-0000-1000-8000-00805f9b34fb';
  static const String huamiRealtimeStepUuid = '00000007-0000-3512-2118-0009af100700';

  final WearableCapabilities _capabilities = const WearableCapabilities(
    heartRate: true,
    restingHeartRate: true,
    steps: true,
    calories: true,
    distance: true,
    sleep: false, // Requires Zepp 16-byte handshake for historical flash
    spo2: false,
    hrv: false,
    battery: true,
    realTimeStream: true,
  );

  AmazfitAdapter({
    required super.bluetoothDevice,
    required super.syncService,
    super.model = 'Amazfit Bip U Pro (A2008)',
  }) : super(
          brand: DeviceBrand.amazfit,
        );

  @override
  WearableCapabilities get capabilities => _capabilities;

  @override
  Future<void> onConnected() async {
    try {
      final services = await bluetoothDevice.discoverServices();

      // 1. Setup Standard & Health services
      await setupStandardServices(services);

      // 2. Discover Huami Real-time Steps characteristic
      for (final s in services) {
        if (s.uuid.toString().toLowerCase() == huamiBasicServiceUuid) {
          for (final c in s.characteristics) {
            if (c.uuid.toString().toLowerCase() == huamiRealtimeStepUuid) {
              final bytes = await c.read();
              if (bytes.length >= 4) {
                final steps = bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);
                updateMetrics(steps: steps);
              }
            }
          }
        }
      }
    } catch (_) {}
  }
}
