import '../datasources/smartwatch_remote_datasource.dart';
import '../models/smartwatch_device_model.dart';
import '../models/smartwatch_health_data_model.dart';

class SmartwatchRepository {
  final SmartwatchRemoteDataSource _remoteDataSource;

  SmartwatchRepository({SmartwatchRemoteDataSource? remoteDataSource})
      : _remoteDataSource = remoteDataSource ?? SmartwatchRemoteDataSource();

  Future<Map<String, dynamic>> fetchStatus() async {
    return await _remoteDataSource.getStatus();
  }

  Future<Map<String, dynamic>> fetchLatestData() async {
    return await _remoteDataSource.getLatestData();
  }

  Future<SmartwatchDeviceModel> registerDevice(SmartwatchDeviceModel device) async {
    return await _remoteDataSource.registerDevice(device);
  }

  Future<Map<String, dynamic>> syncHealthData(
    String deviceIdentifier,
    SmartwatchHealthDataModel healthData,
  ) async {
    return await _remoteDataSource.syncHealthData(deviceIdentifier, healthData);
  }

  Future<List<Map<String, dynamic>>> fetchHistory({int days = 7}) async {
    return await _remoteDataSource.getHistory(days: days);
  }

  Future<void> removeDevice(int deviceId) async {
    await _remoteDataSource.deleteDevice(deviceId);
  }
}
