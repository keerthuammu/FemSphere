class WearableCapabilities {
  final bool heartRate;
  final bool restingHeartRate;
  final bool steps;
  final bool calories;
  final bool distance;
  final bool sleep;
  final bool spo2;
  final bool hrv;
  final bool bodyTemperature;
  final bool bloodPressure;
  final bool stress;
  final bool respiratoryRate;
  final bool battery;
  final bool realTimeStream;

  const WearableCapabilities({
    this.heartRate = true,
    this.restingHeartRate = false,
    this.steps = true,
    this.calories = true,
    this.distance = true,
    this.sleep = false,
    this.spo2 = false,
    this.hrv = false,
    this.bodyTemperature = false,
    this.bloodPressure = false,
    this.stress = false,
    this.respiratoryRate = false,
    this.battery = true,
    this.realTimeStream = true,
  });

  factory WearableCapabilities.fromJson(Map<String, dynamic> json) {
    return WearableCapabilities(
      heartRate: json['heart_rate'] == true || json['heartRate'] == true,
      restingHeartRate: json['resting_heart_rate'] == true || json['restingHeartRate'] == true,
      steps: json['steps'] == true,
      calories: json['calories'] == true,
      distance: json['distance'] == true,
      sleep: json['sleep'] == true,
      spo2: json['spo2'] == true,
      hrv: json['hrv'] == true,
      bodyTemperature: json['body_temperature'] == true || json['bodyTemperature'] == true,
      bloodPressure: json['blood_pressure'] == true || json['bloodPressure'] == true,
      stress: json['stress'] == true,
      respiratoryRate: json['respiratory_rate'] == true || json['respiratoryRate'] == true,
      battery: json['battery'] == true,
      realTimeStream: json['real_time_stream'] == true || json['realTimeStream'] == true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'heart_rate': heartRate,
      'resting_heart_rate': restingHeartRate,
      'steps': steps,
      'calories': calories,
      'distance': distance,
      'sleep': sleep,
      'spo2': spo2,
      'hrv': hrv,
      'body_temperature': bodyTemperature,
      'blood_pressure': bloodPressure,
      'stress': stress,
      'respiratory_rate': respiratoryRate,
      'battery': battery,
      'real_time_stream': realTimeStream,
    };
  }

  List<String> get supportedFeatures {
    final list = <String>[];
    if (heartRate) list.add('Heart Rate');
    if (restingHeartRate) list.add('Resting HR');
    if (steps) list.add('Steps');
    if (calories) list.add('Calories');
    if (distance) list.add('Distance');
    if (sleep) list.add('Sleep');
    if (spo2) list.add('SpO2');
    if (hrv) list.add('HRV');
    if (bodyTemperature) list.add('Body Temp');
    if (bloodPressure) list.add('Blood Pressure');
    if (stress) list.add('Stress');
    if (respiratoryRate) list.add('Respiration');
    if (battery) list.add('Battery Level');
    return list;
  }
}
