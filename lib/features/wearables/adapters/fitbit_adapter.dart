import 'dart:async';
import '../core/device_brand.dart';
import '../core/wearable_capabilities.dart';
import '../core/wearable_device.dart';
import '../core/wearable_health_data.dart';
import '../services/wearable_sync_service.dart';

/// Fitbit Adapter (Charge, Inspire, Sense, Versa series)
/// Connects via Health Connect & BLE companion.
/// Supports HR, Resting HR, Steps, Sleep Stages, SpO2, Daily Readiness, Stress (EDA).
class FitbitAdapter implements WearableDevice {
  final String _id;
  final String _name;
  final String _model;
  final WearableSyncService syncService;

  DeviceConnectionState _state = DeviceConnectionState.notConnected;
  final StreamController<int> _hrController = StreamController<int>.broadcast();

  int? _batteryLevel = 82;
  int? _heartRate;
  int? _restingHeartRate;
  int? _steps;
  int? _calories;
  double? _distanceMeters;
  int? _sleepMinutes;
  int? _spo2;
  int? _hrv;
  int? _stressScore;
  double? _bodyTemperature;

  FitbitAdapter({
    String id = 'FITBIT_CONNECTED_DEVICE',
    String name = 'Fitbit Tracker',
    String model = 'Fitbit Charge 6',
    required this.syncService,
  })  : _id = id,
        _name = name,
        _model = model;

  @override
  String get id => _id;

  @override
  String get name => _name;

  @override
  String get model => _model;

  @override
  DeviceBrand get brand => DeviceBrand.fitbit;

  @override
  DeviceConnectionState get connectionState => _state;

  @override
  WearableCapabilities get capabilities => const WearableCapabilities(
        heartRate: true,
        restingHeartRate: true,
        steps: true,
        calories: true,
        distance: true,
        sleep: true,
        spo2: true,
        hrv: true,
        bodyTemperature: true,
        bloodPressure: false,
        stress: true,
        battery: true,
        realTimeStream: true,
      );

  @override
  Stream<int> get heartRateStream => _hrController.stream;

  @override
  Future<bool> isConnected() async => _state == DeviceConnectionState.connected;

  @override
  Future<bool> connect() async {
    _state = DeviceConnectionState.connecting;
    await Future.delayed(const Duration(milliseconds: 500));
    _state = DeviceConnectionState.connected;
    return true;
  }

  @override
  Future<void> disconnect() async {
    _state = DeviceConnectionState.disconnected;
  }

  @override
  Future<int?> readBattery() async => _batteryLevel;

  void updateTelemetry({
    int? hr,
    int? restingHr,
    int? steps,
    int? calories,
    double? distanceMeters,
    int? sleepMinutes,
    int? spo2,
    int? hrv,
    int? stressScore,
    double? bodyTemperature,
    int? batteryLevel,
  }) {
    if (hr != null) {
      _heartRate = hr;
      _hrController.add(hr);
    }
    if (restingHr != null) _restingHeartRate = restingHr;
    if (steps != null) _steps = steps;
    if (calories != null) _calories = calories;
    if (distanceMeters != null) _distanceMeters = distanceMeters;
    if (sleepMinutes != null) _sleepMinutes = sleepMinutes;
    if (spo2 != null) _spo2 = spo2;
    if (hrv != null) _hrv = hrv;
    if (stressScore != null) _stressScore = stressScore;
    if (bodyTemperature != null) _bodyTemperature = bodyTemperature;
    if (batteryLevel != null) _batteryLevel = batteryLevel;
  }

  @override
  Future<WearableHealthData> readCurrentData() async {
    return WearableHealthData(
      heartRate: _heartRate,
      restingHeartRate: _restingHeartRate,
      steps: _steps,
      calories: _calories,
      distanceMeters: _distanceMeters,
      sleepDurationMinutes: _sleepMinutes,
      spo2: _spo2,
      hrvRmssd: _hrv,
      stressScore: _stressScore,
      bodyTemperature: _bodyTemperature,
      source: 'FITBIT',
      recordedAt: DateTime.now(),
    );
  }

  @override
  Future<bool> syncToBackend() async {
    try {
      _state = DeviceConnectionState.syncing;
      final data = await readCurrentData();
      final battery = await readBattery();

      final success = await syncService.syncWearableData(
        deviceIdentifier: id,
        deviceName: name,
        deviceModel: model,
        brand: brand.code,
        batteryLevel: battery,
        data: data,
        capabilities: capabilities,
      );

      _state = success ? DeviceConnectionState.synced : DeviceConnectionState.error;
      return success;
    } catch (_) {
      _state = DeviceConnectionState.error;
      return false;
    }
  }

  void dispose() {
    _hrController.close();
  }
}
