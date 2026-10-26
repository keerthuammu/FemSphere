import 'package:flutter/foundation.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'wearable_provider.dart';

/// Provider for direct wireless connection to unbonded BLE health monitors
/// broadcasting standard GATT Heart Rate (0x180D) and Pulse Oximeter (0x1822).
class BleGattProvider implements WearableProvider {
  static const String heartRateServiceUuid = '180d';
  static const String heartRateCharUuid = '2a37';
  static const String pulseOxServiceUuid = '1822';
  static const String pulseOxCharUuid = '2a5f';

  @override
  String get providerId => 'STANDARD_BLE';

  @override
  String get displayName => 'Standard Bluetooth LE (GATT)';

  @override
  String get description =>
      'Connects directly over wireless Bluetooth to unbonded health sensors (Polar straps, fingertip oximeters, BLE monitors).';

  @override
  List<String> get supportedBrands => [
        'Polar H10 / H9 / OH1',
        'Garmin HRM Chest Straps',
        'Bluetooth Fingertip Pulse Oximeters',
        'Generic Open BLE Health Monitors',
      ];

  @override
  bool isPlatformSupported() {
    if (kIsWeb) return false;
    return true;
  }

  @override
  Future<bool> checkPermissions() async {
    try {
      final state = await FlutterBluePlus.adapterState.first;
      return state == BluetoothAdapterState.on;
    } catch (_) {
      return false;
    }
  }

  @override
  Future<bool> requestPermissions() async {
    try {
      if (!await FlutterBluePlus.isSupported) return false;
      return true;
    } catch (_) {
      return false;
    }
  }

  @override
  Future<List<Map<String, dynamic>>> fetchRecords({DateTime? since}) async {
    return [];
  }
}
