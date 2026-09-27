import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import '../data/models/smartwatch_device_model.dart';
import '../data/models/smartwatch_health_data_model.dart';
import '../data/repositories/smartwatch_repository.dart';
import 'bluetooth_service.dart';
import 'sync_service.dart';

class SmartwatchService extends ChangeNotifier {
  final WatchBluetoothService _bluetoothService;
  final SyncService _syncService;
  final SmartwatchRepository _repository;

  SmartwatchDeviceModel? _currentDevice;
  SmartwatchHealthDataModel? _latestHealthData;
  SmartwatchConnectionStatus _status = SmartwatchConnectionStatus.notConnected;
  int? _liveHeartRate;
  int? _batteryLevel;
  bool _isSyncing = false;
  String? _errorMessage;

  SmartwatchDeviceModel? get currentDevice => _currentDevice;
  SmartwatchHealthDataModel? get latestHealthData => _latestHealthData;
  SmartwatchConnectionStatus get status => _status;
  int? get liveHeartRate => _liveHeartRate;
  int? get batteryLevel => _batteryLevel;
  bool get isSyncing => _isSyncing;
  String? get errorMessage => _errorMessage;
  bool get isConnected => _bluetoothService.isConnected;

  SmartwatchService({
    WatchBluetoothService? bluetoothService,
    SyncService? syncService,
    SmartwatchRepository? repository,
  })  : _bluetoothService = bluetoothService ?? WatchBluetoothService(),
        _syncService = syncService ?? SyncService(),
        _repository = repository ?? SmartwatchRepository();

  /// Initialize and load status from FemSphere backend
  Future<void> initFromBackend() async {
    try {
      final statusData = await _repository.fetchStatus();
      if (statusData['has_device'] == true && statusData['device'] != null) {
        _currentDevice = SmartwatchDeviceModel.fromJson(statusData['device']);
        _status = _currentDevice!.connectionStatus;
        _batteryLevel = _currentDevice!.batteryLevel;
      }
      if (statusData['latest_data'] != null) {
        _latestHealthData = SmartwatchHealthDataModel.fromJson(statusData['latest_data']);
      }
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading smartwatch status from backend: $e');
    }
  }

  /// Connect to selected Bluetooth device
  Future<bool> connect(BluetoothDevice device) async {
    _status = SmartwatchConnectionStatus.connecting;
    _errorMessage = null;
    notifyListeners();

    final success = await _bluetoothService.connect(device);
    if (success) {
      _currentDevice = SmartwatchDeviceModel(
        deviceName: device.platformName.isNotEmpty ? device.platformName : 'Amazfit Bip U Pro',
        deviceIdentifier: device.remoteId.str,
        connectionStatus: SmartwatchConnectionStatus.connected,
        lastConnectedAt: DateTime.now(),
      );
      _status = SmartwatchConnectionStatus.connected;

      // Register device on backend
      try {
        await _repository.registerDevice(_currentDevice!);
      } catch (e) {
        debugPrint('Could not register device to backend: $e');
      }

      // Read initial telemetry
      await readAndSyncVitals();

      // Subscribe to real-time HR if supported
      await _bluetoothService.subscribeToHeartRate((hr) {
        _liveHeartRate = hr;
        notifyListeners();
      });

      notifyListeners();
      return true;
    } else {
      _status = SmartwatchConnectionStatus.error;
      _errorMessage = 'Failed to connect to Amazfit Bip U Pro.';
      notifyListeners();
      return false;
    }
  }

  /// Disconnect current smartwatch
  Future<void> disconnect() async {
    await _bluetoothService.disconnect();
    _status = SmartwatchConnectionStatus.disconnected;
    _liveHeartRate = null;
    if (_currentDevice != null) {
      _currentDevice = _currentDevice!.copyWith(
        connectionStatus: SmartwatchConnectionStatus.disconnected,
      );
    }
    notifyListeners();
  }

  /// Read vitals from watch and sync to PostgreSQL via REST API
  Future<bool> readAndSyncVitals() async {
    if (_currentDevice == null) {
      _errorMessage = 'No smartwatch connected.';
      notifyListeners();
      return false;
    }

    _isSyncing = true;
    _status = SmartwatchConnectionStatus.syncing;
    notifyListeners();

    try {
      BluetoothHealthTelemetry telemetry;
      if (_bluetoothService.isConnected) {
        telemetry = await _bluetoothService.readHealthData();
        _batteryLevel = telemetry.batteryLevel ?? _batteryLevel;
      } else {
        // Device registered on backend, trigger backend refresh
        final latest = await _repository.fetchLatestData();
        if (latest['latest_reading'] != null) {
          _latestHealthData = SmartwatchHealthDataModel.fromJson(latest['latest_reading']);
        }
        _isSyncing = false;
        _status = SmartwatchConnectionStatus.synced;
        notifyListeners();
        return true;
      }

      final syncResult = await _syncService.syncToBackend(
        deviceIdentifier: _currentDevice!.deviceIdentifier,
        telemetry: telemetry,
        deviceName: _currentDevice!.deviceName,
      );

      _isSyncing = false;
      if (syncResult.success) {
        _status = SmartwatchConnectionStatus.synced;
        _latestHealthData = syncResult.syncedData ?? _latestHealthData;
        _currentDevice = _currentDevice!.copyWith(
          lastSyncedAt: DateTime.now(),
          connectionStatus: SmartwatchConnectionStatus.synced,
          batteryLevel: _batteryLevel,
        );
        notifyListeners();
        return true;
      } else {
        _status = SmartwatchConnectionStatus.error;
        _errorMessage = syncResult.message;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _isSyncing = false;
      _status = SmartwatchConnectionStatus.error;
      _errorMessage = 'Error during sync: $e';
      notifyListeners();
      return false;
    }
  }

  Stream<List<DiscoveredSmartwatch>> scanDevices() {
    return _bluetoothService.scanDevices();
  }
}
