import '../../../services/health_connect_service.dart';
import 'wearable_provider.dart';

/// Provider bridging Android Health Connect.
/// Primary official route for Amazfit Bip U Pro (via Zepp app export), Samsung Health, Pixel Watch, and Google Fit.
class HealthConnectProvider implements WearableProvider {
  final HealthConnectService _service = HealthConnectService();

  @override
  String get providerId => 'HEALTH_CONNECT';

  @override
  String get displayName => 'Android Health Connect';

  @override
  String get description =>
      'Reads biometrics exported by the Zepp app (Amazfit Bip U Pro), Samsung Health, Pixel Watch, and Google Fit.';

  @override
  List<String> get supportedBrands => [
        'Amazfit (via Zepp App)',
        'Samsung Galaxy Watch',
        'Google Pixel Watch',
        'Garmin',
        'Fitbit',
        'Whoop',
        'Xiaomi',
      ];

  @override
  bool isPlatformSupported() {
    if (kIsWeb) return false;
    try {
      return Platform.isAndroid;
    } catch (_) {
      return false;
    }
  }

  @override
  Future<bool> checkPermissions() async {
    return await _service.checkPermissions();
  }

  @override
  Future<bool> requestPermissions() async {
    return await _service.requestPermissions();
  }

  @override
  Future<List<Map<String, dynamic>>> fetchRecords({DateTime? since}) async {
    return await _service.fetchRawRecords(
      startTime: since,
      endTime: DateTime.now(),
    );
  }
}
