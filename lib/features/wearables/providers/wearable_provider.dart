/// Abstract contract for any wearable health data provider.
/// Followed by Health Connect (Zepp / Amazfit), Apple HealthKit, and Standard BLE GATT.
abstract class WearableProvider {
  /// Unique identifier (e.g. 'HEALTH_CONNECT', 'APPLE_HEALTH', 'STANDARD_BLE')
  String get providerId;

  /// User-facing display title
  String get displayName;

  /// Human-friendly description of how this provider connects
  String get description;

  /// Brands best served by this provider
  List<String> get supportedBrands;

  /// Whether current running platform (Android / iOS / Desktop / Web) supports this provider
  bool isPlatformSupported();

  /// Check whether health telemetry read permissions are already granted
  Future<bool> checkPermissions();

  /// Solicit OS or Bluetooth permissions from user
  Future<bool> requestPermissions();

  /// Fetch normalized records recorded since given timestamp
  Future<List<Map<String, dynamic>>> fetchRecords({DateTime? since});
}
