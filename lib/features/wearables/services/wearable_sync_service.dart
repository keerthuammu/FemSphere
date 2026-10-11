import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../core/api_constants.dart';
import '../../../services/api_service.dart';
import '../core/wearable_capabilities.dart';
import '../core/wearable_health_data.dart';

class WearableSyncService {
  Map<String, String> get _headers {
    final map = <String, String>{
      'Content-Type': 'application/json',
    };
    if (ApiService.authToken != null && ApiService.authToken!.isNotEmpty) {
      map['Authorization'] = 'Bearer ${ApiService.authToken}';
    }
    return map;
  }

  /// Synchronize health telemetry from any wearable device brand
  Future<bool> syncWearableData({
    required String deviceIdentifier,
    required String deviceName,
    required String deviceModel,
    required String brand,
    required int? batteryLevel,
    required WearableHealthData data,
    required WearableCapabilities capabilities,
  }) async {
    try {
      final payload = data.toJson(
        deviceIdentifier: deviceIdentifier,
        deviceName: deviceName,
        deviceModel: deviceModel,
        brand: brand,
        batteryLevel: batteryLevel,
      );
      payload['capabilities'] = capabilities.toJson();

      final res = await http.post(
        Uri.parse(ApiConstants.wearablesSync),
        headers: _headers,
        body: jsonEncode(payload),
      );

      return res.statusCode == 200 || res.statusCode == 201;
    } catch (_) {
      return false;
    }
  }

  /// Manually log and sync health activity for a specific date
  Future<bool> syncManualTelemetry({
    required String date,
    int? steps,
    int? calories,
    int? heartRate,
    int? sleepDurationMinutes,
    int? spo2,
    double? waterIntakeLiters,
  }) async {
    try {
      final payload = <String, dynamic>{
        'device_identifier': 'MANUAL_ENTRY',
        'device_name': 'Manual Health Entry',
        'device_model': 'Manual Activity',
        'brand': 'MANUAL',
        'device_type': 'MANUAL',
        'connection_status': 'SYNCED',
        'recorded_at': date,
        'sync_key': 'manual_${date}',
        'source': 'MANUAL_INPUT',
      };
      if (steps != null) payload['steps'] = steps;
      if (calories != null) payload['calories'] = calories;
      if (heartRate != null) payload['heart_rate'] = heartRate;
      if (sleepDurationMinutes != null) payload['sleep_duration_minutes'] = sleepDurationMinutes;
      if (spo2 != null) payload['spo2'] = spo2;
      if (waterIntakeLiters != null) payload['water_intake_liters'] = waterIntakeLiters;

      final res = await http.post(
        Uri.parse(ApiConstants.wearablesSync),
        headers: _headers,
        body: jsonEncode(payload),
      );

      return res.statusCode == 200 || res.statusCode == 201;
    } catch (_) {
      return false;
    }
  }

  /// Register or update a wearable device
  Future<Map<String, dynamic>?> registerDevice({
    required String deviceIdentifier,
    required String deviceName,
    required String deviceModel,
    required String brand,
    required WearableCapabilities capabilities,
    int? batteryLevel,
  }) async {
    try {
      final res = await http.post(
        Uri.parse(ApiConstants.wearablesDevices),
        headers: _headers,
        body: jsonEncode({
          'device_identifier': deviceIdentifier,
          'device_name': deviceName,
          'device_model': deviceModel,
          'brand': brand,
          'capabilities': capabilities.toJson(),
          'battery_level': batteryLevel,
          'connection_status': 'CONNECTED',
        }),
      );
      if (res.statusCode == 200 || res.statusCode == 201) {
        return jsonDecode(res.body);
      }
    } catch (_) {}
    return null;
  }

  /// Get status of registered wearables
  Future<Map<String, dynamic>> getWearableStatus({int? deviceId}) async {
    try {
      final uri = deviceId != null
          ? Uri.parse('${ApiConstants.wearablesStatus}?device_id=$deviceId')
          : Uri.parse(ApiConstants.wearablesStatus);

      final res = await http.get(uri, headers: _headers);
      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
    } catch (_) {}
    return {'has_device': false, 'status': 'NOT_CONNECTED'};
  }

  /// Get list of user's registered wearables
  Future<List<Map<String, dynamic>>> getRegisteredWearables() async {
    try {
      final res = await http.get(Uri.parse(ApiConstants.wearablesDevices), headers: _headers);
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data['devices'] is List) {
          return List<Map<String, dynamic>>.from(data['devices']);
        }
      }
    } catch (_) {}
    return [];
  }

  /// Get latest telemetry reading & summary
  Future<Map<String, dynamic>> getLatestTelemetry({int? deviceId}) async {
    try {
      final uri = deviceId != null
          ? Uri.parse('${ApiConstants.wearablesDataLatest}?device_id=$deviceId')
          : Uri.parse(ApiConstants.wearablesDataLatest);

      final res = await http.get(uri, headers: _headers);
      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
    } catch (_) {}
    return {};
  }

  /// Get history telemetry for charts
  Future<List<Map<String, dynamic>>> getTelemetryHistory({int days = 7, int? deviceId}) async {
    try {
      var url = '${ApiConstants.wearablesDataHistory}?days=$days';
      if (deviceId != null) url += '&device_id=$deviceId';

      final res = await http.get(Uri.parse(url), headers: _headers);
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data['history'] is List) {
          return List<Map<String, dynamic>>.from(data['history']);
        }
      }
    } catch (_) {}
    return [];
  }

  /// Remove/disconnect a wearable
  Future<bool> deleteDevice(dynamic id) async {
    try {
      final res = await http.delete(
        Uri.parse(ApiConstants.wearableDeviceDelete(id)),
        headers: _headers,
      );
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}
