class WearableHealthData {
  final int? heartRate;
  final int? restingHeartRate;
  final int? steps;
  final int? calories;
  final double? distanceMeters;
  final int? sleepDurationMinutes;
  final int? spo2;
  final int? hrvRmssd;
  final int? stressScore;
  final double? bodyTemperature;
  final int? bloodPressureSystolic;
  final int? bloodPressureDiastolic;
  final double? respiratoryRate;
  final String activityType;
  final String source;
  final DateTime recordedAt;

  const WearableHealthData({
    this.heartRate,
    this.restingHeartRate,
    this.steps,
    this.calories,
    this.distanceMeters,
    this.sleepDurationMinutes,
    this.spo2,
    this.hrvRmssd,
    this.stressScore,
    this.bodyTemperature,
    this.bloodPressureSystolic,
    this.bloodPressureDiastolic,
    this.respiratoryRate,
    this.activityType = 'General',
    required this.source,
    required this.recordedAt,
  });

  Map<String, dynamic> toJson({String? deviceIdentifier, String? deviceName, String? deviceModel, String? brand, int? batteryLevel}) {
    return {
      if (deviceIdentifier != null) 'device_identifier': deviceIdentifier,
      if (deviceName != null) 'device_name': deviceName,
      if (deviceModel != null) 'device_model': deviceModel,
      if (brand != null) 'brand': brand,
      if (batteryLevel != null) 'battery_level': batteryLevel,
      'heart_rate': heartRate,
      'resting_heart_rate': restingHeartRate,
      'steps': steps,
      'calories': calories,
      'distance_meters': distanceMeters,
      'sleep_duration_minutes': sleepDurationMinutes,
      'spo2': spo2,
      'hrv_rmssd': hrvRmssd,
      'stress_score': stressScore,
      'body_temperature': bodyTemperature,
      'blood_pressure_systolic': bloodPressureSystolic,
      'blood_pressure_diastolic': bloodPressureDiastolic,
      'respiratory_rate': respiratoryRate,
      'activity_type': activityType,
      'source': source,
      'recorded_at': recordedAt.toIso8601String(),
    };
  }

  factory WearableHealthData.fromJson(Map<String, dynamic> json) {
    return WearableHealthData(
      heartRate: json['heart_rate'] as int?,
      restingHeartRate: json['resting_heart_rate'] as int?,
      steps: json['steps'] as int?,
      calories: json['calories'] as int?,
      distanceMeters: json['distance_meters'] != null ? (json['distance_meters'] as num).toDouble() : null,
      sleepDurationMinutes: json['sleep_duration_minutes'] as int?,
      spo2: json['spo2'] as int?,
      hrvRmssd: json['hrv_rmssd'] as int?,
      stressScore: json['stress_score'] as int?,
      bodyTemperature: json['body_temperature'] != null ? (json['body_temperature'] as num).toDouble() : null,
      bloodPressureSystolic: json['blood_pressure_systolic'] as int?,
      bloodPressureDiastolic: json['blood_pressure_diastolic'] as int?,
      respiratoryRate: json['respiratory_rate'] != null ? (json['respiratory_rate'] as num).toDouble() : null,
      activityType: (json['activity_type'] as String?) ?? 'General',
      source: (json['source'] as String?) ?? 'WEARABLE',
      recordedAt: json['recorded_at'] != null ? DateTime.parse(json['recorded_at'] as String) : DateTime.now(),
    );
  }
}
