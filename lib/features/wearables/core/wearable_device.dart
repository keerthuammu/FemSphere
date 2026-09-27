import 'device_brand.dart';
import 'wearable_capabilities.dart';
import 'wearable_health_data.dart';

enum DeviceConnectionState {
  notConnected,
  connecting,
  connected,
  syncing,
  synced,
  disconnected,
  error,
  unsupported;

  String get label {
    switch (this) {
      case DeviceConnectionState.notConnected:
        return 'Not Connected';
      case DeviceConnectionState.connecting:
        return 'Connecting...';
      case DeviceConnectionState.connected:
        return 'Connected';
      case DeviceConnectionState.syncing:
        return 'Syncing...';
      case DeviceConnectionState.synced:
        return 'Synced';
      case DeviceConnectionState.disconnected:
        return 'Disconnected';
      case DeviceConnectionState.error:
        return 'Error';
      case DeviceConnectionState.unsupported:
        return 'Unsupported';
    }
  }
}

/// Common Universal Wearable Interface
/// Every smartwatch and fitness tracker adapter implements this contract.
abstract class WearableDevice {
  String get id;
  String get name;
  String get model;
  DeviceBrand get brand;
  WearableCapabilities get capabilities;
  DeviceConnectionState get connectionState;

  Future<bool> connect();
  Future<void> disconnect();
  Future<bool> isConnected();

  Stream<int> get heartRateStream;
  Future<int?> readBattery();
  Future<WearableHealthData> readCurrentData();
  Future<bool> syncToBackend();
}
