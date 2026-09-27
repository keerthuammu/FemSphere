import '../data/models/smartwatch_health_data_model.dart';
import '../data/repositories/smartwatch_repository.dart';
import 'bluetooth_service.dart';

class SyncResult {
  final bool success;
  final String message;
  final SmartwatchHealthDataModel? syncedData;

  SyncResult({
    required this.success,
    required this.message,
    this.syncedData,
  });
}

class SyncService {
  final SmartwatchRepository _repository;

  SyncService({SmartwatchRepository? repository})
      : _repository = repository ?? SmartwatchRepository();

  /// Synchronize retrieved Bluetooth health telemetry to the Node.js / PostgreSQL backend
  Future<SyncResult> syncToBackend({
    required String deviceIdentifier,
    required BluetoothHealthTelemetry telemetry,
    String? deviceName = 'Amazfit Bip U Pro',
  }) async {
    try {
      final healthModel = SmartwatchHealthDataModel(
        recordedAt: DateTime.now(),
        heartRate: telemetry.heartRate,
        steps: telemetry.steps,
        calories: telemetry.calories,
        distanceMeters: telemetry.distanceMeters,
        sleepDurationMinutes: telemetry.sleepMinutes,
        spo2: telemetry.spo2,
        batteryLevel: telemetry.batteryLevel,
        source: 'AMAZFIT_BIP_U_PRO',
        activityType: 'General',
        rawPayload: {
          'services_available': telemetry.serviceAvailability,
          'telemetry_note': telemetry.note,
        },
      );

      final response = await _repository.syncHealthData(deviceIdentifier, healthModel);

      if (response['success'] == true) {
        final syncedJson = response['health_data'] as Map<String, dynamic>?;
        return SyncResult(
          success: true,
          message: 'Amazfit Bip U Pro telemetry successfully synced to FemSphere.',
          syncedData: syncedJson != null ? SmartwatchHealthDataModel.fromJson(syncedJson) : healthModel,
        );
      } else {
        return SyncResult(
          success: false,
          message: response['message'] ?? 'Failed to sync with backend.',
        );
      }
    } catch (e) {
      return SyncResult(
        success: false,
        message: 'Sync network error: $e',
      );
    }
  }
}
