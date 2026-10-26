import 'dart:convert';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:health/health.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../features/wearables/services/wearable_sync_service.dart';

/// Health Connect Availability Status
enum HealthConnectAvailability {
  available,
  updateRequired,
  notSupported,
  webUnsupported,
}

/// Synchronization Status for UI representation
enum HealthSyncStatus {
  idle,
  checking,
  permissionRequired,
  notInstalled,
  zeppPending,
  noData,
  synced,
  offlinePending,
  error,
}

/// Structured snapshot of real health readings for the dashboard
class HealthDashboardSnapshot {
  final int? steps;
  final int? heartRate;
  final int? avgHeartRate;
  final int? restingHeartRate;
  final int? sleepMinutes;
  final int? calories;
  final double? distanceMeters;
  final int? spo2;
  final String? workoutSummary;
  final DateTime? latestReadingTime;
  final DateTime? lastSyncTime;
  final HealthSyncStatus status;
  final String statusMessage;
  final bool isBackendSynced;
  final String? sourceName;

  const HealthDashboardSnapshot({
    this.steps,
    this.heartRate,
    this.avgHeartRate,
    this.restingHeartRate,
    this.sleepMinutes,
    this.calories,
    this.distanceMeters,
    this.spo2,
    this.workoutSummary,
    this.latestReadingTime,
    this.lastSyncTime,
    this.status = HealthSyncStatus.idle,
    this.statusMessage = 'Ready to sync',
    this.isBackendSynced = false,
    this.sourceName,
  });

  /// Indicates if the latest reading is historical (more than 30 minutes old)
  bool get isHistorical {
    if (latestReadingTime == null) return false;
    return DateTime.now().difference(latestReadingTime!).inMinutes > 30;
  }

  Map<String, dynamic> toJson() => {
        'steps': steps,
        'heartRate': heartRate,
        'avgHeartRate': avgHeartRate,
        'restingHeartRate': restingHeartRate,
        'sleepMinutes': sleepMinutes,
        'calories': calories,
        'distanceMeters': distanceMeters,
        'spo2': spo2,
        'workoutSummary': workoutSummary,
        'latestReadingTime': latestReadingTime?.toIso8601String(),
        'lastSyncTime': lastSyncTime?.toIso8601String(),
        'status': status.name,
        'statusMessage': statusMessage,
        'isBackendSynced': isBackendSynced,
        'sourceName': sourceName,
      };

  factory HealthDashboardSnapshot.fromJson(Map<String, dynamic> json) {
    return HealthDashboardSnapshot(
      steps: json['steps'] as int?,
      heartRate: json['heartRate'] as int?,
      avgHeartRate: json['avgHeartRate'] as int?,
      restingHeartRate: json['restingHeartRate'] as int?,
      sleepMinutes: json['sleepMinutes'] as int?,
      calories: json['calories'] as int?,
      distanceMeters: (json['distanceMeters'] as num?)?.toDouble(),
      spo2: json['spo2'] as int?,
      workoutSummary: json['workoutSummary'] as String?,
      latestReadingTime: json['latestReadingTime'] != null
          ? DateTime.tryParse(json['latestReadingTime'].toString())
          : null,
      lastSyncTime: json['lastSyncTime'] != null
          ? DateTime.tryParse(json['lastSyncTime'].toString())
          : null,
      status: HealthSyncStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => HealthSyncStatus.idle,
      ),
      statusMessage: json['statusMessage']?.toString() ?? '',
      isBackendSynced: json['isBackendSynced'] == true,
      sourceName: json['sourceName']?.toString(),
    );
  }

  HealthDashboardSnapshot copyWith({
    int? steps,
    int? heartRate,
    int? avgHeartRate,
    int? restingHeartRate,
    int? sleepMinutes,
    int? calories,
    double? distanceMeters,
    int? spo2,
    String? workoutSummary,
    DateTime? latestReadingTime,
    DateTime? lastSyncTime,
    HealthSyncStatus? status,
    String? statusMessage,
    bool? isBackendSynced,
    String? sourceName,
  }) {
    return HealthDashboardSnapshot(
      steps: steps ?? this.steps,
      heartRate: heartRate ?? this.heartRate,
      avgHeartRate: avgHeartRate ?? this.avgHeartRate,
      restingHeartRate: restingHeartRate ?? this.restingHeartRate,
      sleepMinutes: sleepMinutes ?? this.sleepMinutes,
      calories: calories ?? this.calories,
      distanceMeters: distanceMeters ?? this.distanceMeters,
      spo2: spo2 ?? this.spo2,
      workoutSummary: workoutSummary ?? this.workoutSummary,
      latestReadingTime: latestReadingTime ?? this.latestReadingTime,
      lastSyncTime: lastSyncTime ?? this.lastSyncTime,
      status: status ?? this.status,
      statusMessage: statusMessage ?? this.statusMessage,
      isBackendSynced: isBackendSynced ?? this.isBackendSynced,
      sourceName: sourceName ?? this.sourceName,
    );
  }
}

/// Central Reusable Health Data Service
/// Integrates Amazfit / Zepp / Wearable health data via Android Health Connect
///
/// Flow:
/// Amazfit Bip U Pro -> Zepp -> Android Health Connect -> FemSphere Flutter App -> FemSphere Backend -> PostgreSQL
class HealthConnectService {
  static final HealthConnectService _instance = HealthConnectService._internal();
  factory HealthConnectService() => _instance;
  HealthConnectService._internal();

  final WearableSyncService _wearableSyncService = WearableSyncService();
  final Health _health = Health();

  /// Reactive notifier for widgets to observe dashboard state changes
  final ValueNotifier<HealthDashboardSnapshot> snapshotNotifier =
      ValueNotifier<HealthDashboardSnapshot>(const HealthDashboardSnapshot());

  static const String _cacheKey = 'femsphere_health_connect_snapshot';

  /// Supported health metrics explicitly needed for FemSphere
  static const List<HealthDataType> _supportedTypes = [
    HealthDataType.STEPS,
    HealthDataType.HEART_RATE,
    HealthDataType.RESTING_HEART_RATE,
    HealthDataType.SLEEP_SESSION,
    HealthDataType.SLEEP_ASLEEP,
    HealthDataType.TOTAL_CALORIES_BURNED,
    HealthDataType.ACTIVE_ENERGY_BURNED,
    HealthDataType.DISTANCE_DELTA,
    HealthDataType.WORKOUT,
    HealthDataType.BLOOD_OXYGEN,
  ];

  static const Map<String, String> permissionPurposes = {
    'Heart Rate & Resting HR': 'Monitors cardiovascular vitals and autonomic nervous system tone across cycle phases.',
    'Daily Steps & Distance': 'Calculates daily physical exertion and metabolic cadence for hormonal balance.',
    'Sleep Sessions & Stages': 'Evaluates circadian rhythm recovery, luteal sleep quality, and nocturnal resting vitals.',
    'Active & Total Calories': 'Analyzes caloric expenditure to prevent relative energy deficiency (RED-S).',
    'Workout & Activity': 'Correlates training intensity with cycle stages and fatigue recovery.',
    'Blood Oxygen (SpO2)': 'Monitors systemic oxygen saturation and sleep breathing stability.',
  };

  /// Initialize and load cached snapshot
  Future<void> init() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cached = prefs.getString(_cacheKey);
      if (cached != null) {
        final map = jsonDecode(cached) as Map<String, dynamic>;
        snapshotNotifier.value = HealthDashboardSnapshot.fromJson(map);
      }
    } catch (e) {
      debugPrint('HealthConnectService cache read note: $e');
    }
  }

  /// 1. Check whether Android Health Connect is available on the device
  Future<HealthConnectAvailability> checkAvailability() async {
    if (kIsWeb) {
      return HealthConnectAvailability.webUnsupported;
    }

    try {
      if (!Platform.isAndroid) {
        return HealthConnectAvailability.notSupported;
      }

      _health.configure();
      final status = await _health.getHealthConnectSdkStatus();

      if (status == HealthConnectSdkStatus.sdkAvailable) {
        return HealthConnectAvailability.available;
      } else if (status == HealthConnectSdkStatus.sdkUnavailableProviderUpdateRequired) {
        return HealthConnectAvailability.updateRequired;
      } else {
        return HealthConnectAvailability.notSupported;
      }
    } catch (e) {
      debugPrint('HealthConnect availability check exception: $e');
      return HealthConnectAvailability.notSupported;
    }
  }

  /// Launch installation or update of Health Connect
  Future<void> promptInstallOrUpdate() async {
    if (kIsWeb || !Platform.isAndroid) return;
    try {
      await _health.installHealthConnect();
    } catch (e) {
      debugPrint('HealthConnect install prompt note: $e');
    }
  }

  /// 2. Check if runtime health permissions are granted
  Future<bool> checkPermissions() async {
    if (kIsWeb || !Platform.isAndroid) return false;
    try {
      _health.configure();
      final permissions = _supportedTypes.map((_) => HealthDataAccess.READ).toList();
      final has = await _health.hasPermissions(_supportedTypes, permissions: permissions);
      return has == true;
    } catch (e) {
      debugPrint('HealthConnect checkPermissions note: $e');
      return false;
    }
  }

  /// Request runtime read authorization for FemSphere metrics
  Future<bool> requestPermissions() async {
    if (kIsWeb || !Platform.isAndroid) return false;
    try {
      _health.configure();
      final permissions = _supportedTypes.map((_) => HealthDataAccess.READ).toList();
      final authorized = await _health.requestAuthorization(_supportedTypes, permissions: permissions);
      return authorized;
    } catch (e) {
      debugPrint('HealthConnect requestAuthorization note: $e');
      return false;
    }
  }

  /// Revoke granted permissions if user disconnects
  Future<void> revokeAccess() async {
    if (kIsWeb || !Platform.isAndroid) return;
    try {
      await _health.revokePermissions();
      snapshotNotifier.value = const HealthDashboardSnapshot(
        status: HealthSyncStatus.permissionRequired,
        statusMessage: 'Health Connect access revoked',
      );
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_cacheKey);
    } catch (e) {
      debugPrint('HealthConnect revokePermissions note: $e');
    }
  }

  /// 3. Read health metrics from Health Connect and build normalized telemetry records
  Future<List<Map<String, dynamic>>> fetchRawRecords({
    DateTime? startTime,
    DateTime? endTime,
  }) async {
    if (kIsWeb || !Platform.isAndroid) return [];

    final now = DateTime.now();
    final start = startTime ?? DateTime(now.year, now.month, now.day);
    final end = endTime ?? now;

    try {
      final List<HealthDataPoint> dataPoints = await _health.getHealthDataFromTypes(
        types: _supportedTypes,
        startTime: start,
        endTime: end,
      );

      final List<Map<String, dynamic>> records = [];

      for (final p in dataPoints) {
        final val = _extractNumeric(p.value);
        if (val == null && p.value is! WorkoutHealthValue) continue;

        final isZepp = p.sourceName.toLowerCase().contains('huami') ||
            p.sourceName.toLowerCase().contains('midong') ||
            p.sourceName.toLowerCase().contains('zepp');

        final source = isZepp ? 'ZEPP_HEALTH_CONNECT' : 'HEALTH_CONNECT';
        final recTime = p.dateFrom.toUtc();
        final typeStr = p.typeString;
        final syncKey = 'hc_${p.sourceName}_${typeStr}_${recTime.millisecondsSinceEpoch}';

        final item = <String, dynamic>{
          'sync_key': syncKey,
          'recorded_at': recTime.toIso8601String(),
          'source': source,
          'raw_payload': {
            'data_type': typeStr,
            'source_name': p.sourceName,
            'source_id': p.sourceId,
            'date_from': p.dateFrom.toUtc().toIso8601String(),
            'date_to': p.dateTo.toUtc().toIso8601String(),
          },
        };

        if (p.type == HealthDataType.STEPS && val != null && val >= 0) {
          item['steps'] = val.toInt();
        } else if (p.type == HealthDataType.HEART_RATE && val != null && val > 30) {
          item['heart_rate'] = val.round();
        } else if (p.type == HealthDataType.RESTING_HEART_RATE && val != null && val > 30) {
          item['resting_heart_rate'] = val.round();
        } else if ((p.type == HealthDataType.SLEEP_SESSION || p.type == HealthDataType.SLEEP_ASLEEP) && val != null) {
          final mins = val > 0 ? val.toInt() : p.dateTo.difference(p.dateFrom).inMinutes;
          item['sleep_duration_minutes'] = mins;
        } else if ((p.type == HealthDataType.TOTAL_CALORIES_BURNED || p.type == HealthDataType.ACTIVE_ENERGY_BURNED) && val != null) {
          item['calories'] = val.round();
        } else if (p.type == HealthDataType.DISTANCE_DELTA && val != null) {
          item['distance_meters'] = val.toDouble();
        } else if (p.type == HealthDataType.BLOOD_OXYGEN && val != null) {
          final pct = val <= 1.0 ? (val * 100).round() : val.round();
          if (pct >= 50 && pct <= 100) item['spo2'] = pct;
        } else if (p.type == HealthDataType.WORKOUT && p.value is WorkoutHealthValue) {
          final w = p.value as WorkoutHealthValue;
          item['activity_type'] = w.workoutActivityType.name;
          if (w.totalEnergyBurned != null) item['calories'] = w.totalEnergyBurned;
          if (w.totalDistance != null) item['distance_meters'] = w.totalDistance!.toDouble();
        }

        records.add(item);
      }

      return records;
    } catch (e) {
      debugPrint('Error fetching Health Connect records: $e');
      return [];
    }
  }

  /// 4. Synchronize Health Connect data end-to-end:
  /// Fetch from Health Connect -> Update local dashboard snapshot -> Upload batch to FemSphere backend
  Future<HealthDashboardSnapshot> syncHealthData({
    bool requestPermissionIfDenied = false,
  }) async {
    final now = DateTime.now();

    // Check platform
    if (kIsWeb) {
      final snap = snapshotNotifier.value.copyWith(
        status: HealthSyncStatus.idle,
        statusMessage: 'Web environment: Viewing synchronized cloud records.',
      );
      snapshotNotifier.value = snap;
      return snap;
    }

    if (!Platform.isAndroid) {
      final snap = snapshotNotifier.value.copyWith(
        status: HealthSyncStatus.error,
        statusMessage: 'Health Connect is only supported on Android devices.',
      );
      snapshotNotifier.value = snap;
      return snap;
    }

    snapshotNotifier.value = snapshotNotifier.value.copyWith(
      status: HealthSyncStatus.checking,
      statusMessage: 'Connecting to Android Health Connect...',
    );

    // 1. Availability check
    final availability = await checkAvailability();
    if (availability == HealthConnectAvailability.notSupported) {
      final snap = snapshotNotifier.value.copyWith(
        status: HealthSyncStatus.notInstalled,
        statusMessage: 'Android Health Connect is not supported on this device.',
      );
      snapshotNotifier.value = snap;
      return snap;
    } else if (availability == HealthConnectAvailability.updateRequired) {
      final snap = snapshotNotifier.value.copyWith(
        status: HealthSyncStatus.notInstalled,
        statusMessage: 'Health Connect is not installed or requires an update.',
      );
      snapshotNotifier.value = snap;
      return snap;
    }

    // 2. Permission check
    bool hasPermissions = await checkPermissions();
    if (!hasPermissions && requestPermissionIfDenied) {
      hasPermissions = await requestPermissions();
    }

    if (!hasPermissions) {
      final snap = snapshotNotifier.value.copyWith(
        status: HealthSyncStatus.permissionRequired,
        statusMessage: 'Health Connect permissions required to read watch biometrics.',
      );
      snapshotNotifier.value = snap;
      return snap;
    }

    // 3. Fetch data points for today
    final startOfDay = DateTime(now.year, now.month, now.day);
    int? todaySteps;
    try {
      todaySteps = await _health.getTotalStepsInInterval(startOfDay, now);
    } catch (_) {}

    final rawRecords = await fetchRawRecords(startTime: startOfDay, endTime: now);

    // Parse aggregated metrics
    int? latestHr;
    int? restingHr;
    double hrSum = 0;
    int hrCount = 0;
    int? sleepMins;
    double? totalCalories;
    double totalDistance = 0;
    int? latestSpo2;
    String? latestWorkout;
    DateTime? latestReadingTime;
    String? detectedSource;

    for (final r in rawRecords) {
      final recDate = DateTime.tryParse(r['recorded_at']?.toString() ?? '');
      if (recDate != null && (latestReadingTime == null || recDate.isAfter(latestReadingTime))) {
        latestReadingTime = recDate;
      }

      if (r['source'] != null) {
        detectedSource = r['source'].toString();
      }

      if (r['heart_rate'] != null) {
        final hr = (r['heart_rate'] as num).toInt();
        latestHr ??= hr;
        hrSum += hr;
        hrCount++;
      }
      if (r['resting_heart_rate'] != null) {
        restingHr ??= (r['resting_heart_rate'] as num).toInt();
      }
      if (r['sleep_duration_minutes'] != null) {
        final s = (r['sleep_duration_minutes'] as num).toInt();
        sleepMins = (sleepMins ?? 0) + s;
      }
      if (r['calories'] != null) {
        totalCalories = (totalCalories ?? 0) + (r['calories'] as num).toDouble();
      }
      if (r['distance_meters'] != null) {
        totalDistance += (r['distance_meters'] as num).toDouble();
      }
      if (r['spo2'] != null) {
        latestSpo2 ??= (r['spo2'] as num).toInt();
      }
      if (r['activity_type'] != null && r['activity_type'] != 'General') {
        latestWorkout ??= r['activity_type'].toString();
      }
    }

    final avgHr = hrCount > 0 ? (hrSum / hrCount).round() : null;

    // Check if Zepp has synchronized any records
    HealthSyncStatus status = HealthSyncStatus.synced;
    String statusMsg = 'Biometrics successfully fetched from Health Connect.';

    if (rawRecords.isEmpty && (todaySteps == null || todaySteps == 0)) {
      status = HealthSyncStatus.zeppPending;
      statusMsg = 'No records in Health Connect yet. Please open Zepp to sync your watch.';
    }

    // Build consolidated snapshot
    HealthDashboardSnapshot newSnapshot = HealthDashboardSnapshot(
      steps: todaySteps != null && todaySteps > 0 ? todaySteps : (rawRecords.isNotEmpty ? todaySteps : null),
      heartRate: latestHr,
      avgHeartRate: avgHr,
      restingHeartRate: restingHr,
      sleepMinutes: sleepMins,
      calories: totalCalories?.round(),
      distanceMeters: totalDistance > 0 ? totalDistance : null,
      spo2: latestSpo2,
      workoutSummary: latestWorkout,
      latestReadingTime: latestReadingTime,
      lastSyncTime: now,
      status: status,
      statusMessage: statusMsg,
      isBackendSynced: false,
      sourceName: detectedSource ?? 'Health Connect (Zepp / Amazfit)',
    );

    // 4. Synchronize with FemSphere backend if records or steps exist
    bool backendSynced = false;
    if (rawRecords.isNotEmpty || (todaySteps != null && todaySteps > 0)) {
      try {
        final recordsPayload = List<Map<String, dynamic>>.from(rawRecords);
        // Include summary record if steps exist
        if (todaySteps != null && todaySteps > 0 && !recordsPayload.any((e) => e['steps'] != null)) {
          recordsPayload.add({
            'sync_key': 'hc_steps_${startOfDay.millisecondsSinceEpoch}',
            'recorded_at': now.toUtc().toIso8601String(),
            'steps': todaySteps,
            'source': 'HEALTH_CONNECT_STEPS',
          });
        }

        final res = await _wearableSyncService.syncBatchRecords(
          provider: 'HEALTH_CONNECT',
          brand: 'AMAZFIT',
          deviceModel: 'Amazfit Bip U Pro (A2008)',
          deviceName: 'Amazfit via Health Connect',
          deviceIdentifier: 'AMAZFIT_ZEPP_HEALTH_CONNECT',
          batteryLevel: null,
          capabilities: {
            'heart_rate': true,
            'resting_heart_rate': true,
            'steps': true,
            'calories': true,
            'distance': true,
            'sleep': true,
            'spo2': true,
            'battery': false,
          },
          records: recordsPayload,
        );

        if (res != null && res['success'] == true) {
          backendSynced = true;
          statusMsg = 'Synced to FemSphere cloud (${res['records_uploaded'] ?? recordsPayload.length} records).';
        } else {
          statusMsg = 'Saved locally on device. Backend sync will retry.';
        }
      } catch (err) {
        debugPrint('Backend sync error: $err');
        statusMsg = 'Fetched locally. Backend is currently unreachable.';
      }
    }

    newSnapshot = newSnapshot.copyWith(
      isBackendSynced: backendSynced,
      status: backendSynced ? HealthSyncStatus.synced : (status == HealthSyncStatus.synced ? HealthSyncStatus.offlinePending : status),
      statusMessage: statusMsg,
    );

    snapshotNotifier.value = newSnapshot;

    // Persist to local storage
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_cacheKey, jsonEncode(newSnapshot.toJson()));
    } catch (_) {}

    return newSnapshot;
  }

  num? _extractNumeric(HealthValue val) {
    if (val is NumericHealthValue) {
      return val.numericValue;
    }
    return null;
  }
}
