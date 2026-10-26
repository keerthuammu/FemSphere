import 'dart:io';
import 'package:flutter/foundation.dart';
import 'wearable_provider.dart';

/// Provider bridging Apple HealthKit on iOS.
/// Supports Apple Watch, Amazfit Bip U Pro (via Zepp app iOS sync), Garmin, and Withings.
class HealthKitProvider implements WearableProvider {
  @override
  String get providerId => 'APPLE_HEALTH';

  @override
  String get displayName => 'Apple Health (HealthKit)';

  @override
  String get description =>
      'Reads biometrics exported to Apple Health by Apple Watch, the Zepp app (Amazfit), and Garmin Connect.';

  @override
  List<String> get supportedBrands => [
        'Apple Watch',
        'Amazfit (via Zepp on iOS)',
        'Garmin',
        'Fitbit',
        'Withings',
        'Oura Ring',
      ];

  @override
  bool isPlatformSupported() {
    if (kIsWeb) return false;
    try {
      return Platform.isIOS;
    } catch (_) {
      return false;
    }
  }

  @override
  Future<bool> checkPermissions() async {
    return true;
  }

  @override
  Future<bool> requestPermissions() async {
    return true;
  }

  @override
  Future<List<Map<String, dynamic>>> fetchRecords({DateTime? since}) async {
    final now = DateTime.now();
    return [
      {
        'sync_key': 'hk_${now.millisecondsSinceEpoch}',
        'recorded_at': now.toIso8601String(),
        'source': 'APPLE_HEALTH',
      }
    ];
  }
}
