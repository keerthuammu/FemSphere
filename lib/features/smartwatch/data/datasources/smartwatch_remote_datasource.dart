import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/constants/api_endpoints.dart';
import '../models/smartwatch_device_model.dart';
import '../models/smartwatch_health_data_model.dart';

class SmartwatchRemoteDataSource {
  final Dio _dio;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  SmartwatchRemoteDataSource({Dio? dio}) : _dio = dio ?? Dio() {
    _dio.options.connectTimeout = const Duration(seconds: 12);
    _dio.options.receiveTimeout = const Duration(seconds: 12);
  }

  Future<String?> _getToken() async {
    try {
      final token = await _secureStorage.read(key: 'femsphere_token');
      if (token != null && token.isNotEmpty) return token;
    } catch (_) {}

    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('femsphere_token') ?? prefs.getString('auth_token');
  }

  Future<Options> _authOptions() async {
    final token = await _getToken();
    return Options(
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
  }

  Future<Map<String, dynamic>> getStatus() async {
    final options = await _authOptions();
    final res = await _dio.get('${ApiEndpoints.apiBase}/smartwatch/status', options: options);
    return res.data as Map<String, dynamic>;
  }

  Future<SmartwatchDeviceModel> registerDevice(SmartwatchDeviceModel device) async {
    final options = await _authOptions();
    final res = await _dio.post(
      '${ApiEndpoints.apiBase}/smartwatch/devices',
      data: device.toJson(),
      options: options,
    );
    final data = res.data as Map<String, dynamic>;
    return SmartwatchDeviceModel.fromJson(data['device'] as Map<String, dynamic>);
  }

  Future<Map<String, dynamic>> syncHealthData(
    String deviceIdentifier,
    SmartwatchHealthDataModel healthData,
  ) async {
    final options = await _authOptions();
    final res = await _dio.post(
      '${ApiEndpoints.apiBase}/smartwatch/sync',
      data: healthData.toSyncJson(deviceIdentifier),
      options: options,
    );
    return res.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getLatestData() async {
    final options = await _authOptions();
    final res = await _dio.get(
      '${ApiEndpoints.apiBase}/smartwatch/data/latest',
      options: options,
    );
    return res.data as Map<String, dynamic>;
  }

  Future<List<Map<String, dynamic>>> getHistory({int days = 7}) async {
    final options = await _authOptions();
    final res = await _dio.get(
      '${ApiEndpoints.apiBase}/smartwatch/data/history?days=$days',
      options: options,
    );
    final data = res.data as Map<String, dynamic>;
    final list = data['history'] as List<dynamic>? ?? [];
    return list.cast<Map<String, dynamic>>();
  }

  Future<void> deleteDevice(int deviceId) async {
    final options = await _authOptions();
    await _dio.delete(
      '${ApiEndpoints.apiBase}/smartwatch/devices/$deviceId',
      options: options,
    );
  }
}
