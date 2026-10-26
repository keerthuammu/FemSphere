import 'package:flutter/foundation.dart';
import '../core/device_brand.dart';
import '../core/wearable_capabilities.dart';
import '../services/huami_auth_service.dart';
import 'base_ble_adapter.dart';

/// Amazfit & Zepp OS Wearable Adapter (Amazfit Bip U Pro, GTR, GTS, Band series)
/// Supports direct BLE authentication with 16-byte key without the Zepp app.
class AmazfitAdapter extends BaseBleAdapter {
  static const String huamiBasicServiceUuid = '0000fee0-0000-1000-8000-00805f9b34fb';
  static const String huamiRealtimeStepUuid = '00000007-0000-3512-2118-0009af100700';

  final WearableCapabilities _capabilities = const WearableCapabilities(
    heartRate: true,
    restingHeartRate: true,
    steps: true,
    calories: true,
    distance: true,
    sleep: false,
    spo2: true,
    hrv: true,
    battery: true,
    realTimeStream: true,
  );

  bool _isAuthenticated = false;
  bool get isAuthenticated => _isAuthenticated;

  AmazfitAdapter({
    required super.bluetoothDevice,
    required super.syncService,
    super.model = 'Amazfit Bip U Pro (A2008)',
  }) : super(
          brand: DeviceBrand.amazfit,
        );

  @override
  WearableCapabilities get capabilities => _capabilities;

  /// Authenticate directly with a 16-byte hex key
  Future<bool> authenticateWithKey(String hexKey) async {
    try {
      await HuamiAuthService.saveAuthKey(bluetoothDevice.remoteId.str, hexKey);
      final services = await bluetoothDevice.discoverServices();
      final ok = await HuamiAuthService.performHandshake(
        device: bluetoothDevice,
        services: services,
        providedHexKey: hexKey,
      );
      _isAuthenticated = ok;
      if (ok) {
        await _setupProtectedCharacteristics(services);
      }
      return ok;
    } catch (e) {
      debugPrint('Error authenticating Amazfit: $e');
      return false;
    }
  }

  Future<void> _setupProtectedCharacteristics(List<dynamic> services) async {
    for (final s in services) {
      final sUuid = s.uuid.toString().toLowerCase();
      if (sUuid.contains('fee0')) {
        for (final c in s.characteristics) {
          if (c.uuid.toString().toLowerCase().contains('0007')) {
            try {
              c.onValueReceived.listen((bytes) {
                if (bytes.length >= 4) {
                  final steps = bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);
                  if (steps > 0) {
                    updateMetrics(
                      steps: steps,
                      calories: (steps * 0.042).round(),
                      distanceMeters: steps * 0.76,
                    );
                    syncToBackend();
                  }
                }
              });
              await c.setNotifyValue(true);
              if (c.properties.read) {
                final bytes = await c.read();
                if (bytes.length >= 4) {
                  final steps = bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);
                  if (steps > 0) {
                    updateMetrics(
                      steps: steps,
                      calories: (steps * 0.042).round(),
                      distanceMeters: steps * 0.76,
                    );
                  }
                }
              }
            } catch (e) {
              debugPrint('Protected steps characteristic note: $e');
            }
          }
        }
      }
    }
  }

  @override
  Future<void> onConnected() async {
    try {
      final services = bluetoothDevice.servicesList.isNotEmpty
          ? bluetoothDevice.servicesList
          : await bluetoothDevice.discoverServices();

      // 1. Attempt Huami AES-128 handshake if an auth key is saved
      final authOk = await HuamiAuthService.performHandshake(
        device: bluetoothDevice,
        services: services,
      );
      _isAuthenticated = authOk;

      // 2. Setup Standard & Health services
      await setupStandardServices(services);

      // 3. Setup steps characteristic (either authenticated or open)
      await _setupProtectedCharacteristics(services);
    } catch (e) {
      debugPrint('Amazfit onConnected note: $e');
    }
  }
}
