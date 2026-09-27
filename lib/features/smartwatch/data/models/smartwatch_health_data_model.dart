class SmartwatchHealthDataModel {
  final int? id;
  final int? userId;
  final int? deviceId;
  final DateTime recordedAt;
  final int? heartRate;
  final int? restingHeartRate;
  final int? steps;
  final int? calories;
  final double? distanceMeters;
  final int? sleepDurationMinutes;
  final int? spo2;
  final String activityType;
  final String source;
  final int? batteryLevel;
  final Map<String, dynamic> rawPayload;

  const SmartwatchHealthDataModel({
    this.id,
    this.userId,
    this.deviceId,
    required this.recordedAt,
    this.heartRate,
    this.restingHeartRate,
    this.steps,
    this.calories,
    this.distanceMeters,
    this.sleepDurationMinutes,
    this.spo2,
    this.activityType = 'General',
    this.source = 'AMAZFIT_BIP_U_PRO',
    this.batteryLevel,
    this.rawPayload = const {},
  });

  double get distanceKm => (distanceMeters ?? 0) / 1000.0;
  double get sleepHours => (sleepDurationMinutes ?? 0) / 60.0;

  factory SmartwatchHealthDataModel.fromJson(Map<String, dynamic> json) {
    return SmartwatchHealthDataModel(
      id: json['id'] as int?,
      userId: json['user_id'] as int?,
      deviceId: json['device_id'] as int?,
      recordedAt: json['recorded_at'] != null
          ? DateTime.tryParse(json['recorded_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      heartRate: json['heart_rate'] as int?,
      restingHeartRate: json['resting_heart_rate'] as int?,
      steps: json['steps'] as int?,
      calories: json['calories'] != null ? (json['calories'] as num).toInt() : null,
      distanceMeters: json['distance_meters'] != null
          ? double.tryParse(json['distance_meters'].toString())
          : (json['distance'] != null ? (double.tryParse(json['distance'].toString()) ?? 0) * 1000.0 : null),
      sleepDurationMinutes: json['sleep_duration_minutes'] as int? ?? json['sleep_duration'] as int?,
      spo2: json['spo2'] as int?,
      activityType: json['activity_type'] as String? ?? 'General',
      source: json['source'] as String? ?? 'AMAZFIT_BIP_U_PRO',
      batteryLevel: json['battery_level'] as int?,
      rawPayload: json['raw_payload'] is Map<String, dynamic> ? json['raw_payload'] as Map<String, dynamic> : {},
    );
  }

  Map<String, dynamic> toSyncJson(String deviceIdentifier) {
    return {
      'device_identifier': deviceIdentifier,
      'device_name': 'Amazfit Bip U Pro',
      'device_model': 'A2008',
      if (batteryLevel != null) 'battery_level': batteryLevel,
      if (heartRate != null) 'heart_rate': heartRate,
      if (restingHeartRate != null) 'resting_heart_rate': restingHeartRate,
      if (steps != null) 'steps': steps,
      if (calories != null) 'calories': calories,
      if (distanceMeters != null) 'distance_meters': distanceMeters,
      if (sleepDurationMinutes != null) 'sleep_duration_minutes': sleepDurationMinutes,
      if (spo2 != null) 'spo2': spo2,
      'activity_type': activityType,
      'source': source,
      'recorded_at': recordedAt.toIso8601String(),
      'raw_payload': rawPayload,
    };
  }
}
