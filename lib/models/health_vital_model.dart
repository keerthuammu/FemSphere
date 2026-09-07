class HealthVitalModel {
  final int? id;
  final String logDate;
  final double weightKg;
  final double waterIntakeLiters;
  final double sleepHours;
  final int exerciseMinutes;

  HealthVitalModel({
    this.id,
    required this.logDate,
    required this.weightKg,
    required this.waterIntakeLiters,
    required this.sleepHours,
    required this.exerciseMinutes,
  });

  factory HealthVitalModel.fromJson(Map<String, dynamic> json) {
    return HealthVitalModel(
      id: json['id'] != null ? int.parse(json['id'].toString()) : null,
      logDate: json['log_date'] ?? json['logDate'] ?? '',
      weightKg: double.parse((json['weight_kg'] ?? json['weightKg'] ?? 62).toString()),
      waterIntakeLiters: double.parse((json['water_intake_liters'] ?? json['waterIntakeLiters'] ?? 2.0).toString()),
      sleepHours: double.parse((json['sleep_hours'] ?? json['sleepHours'] ?? 7.5).toString()),
      exerciseMinutes: int.parse((json['exercise_minutes'] ?? json['exerciseMinutes'] ?? 30).toString()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'logDate': logDate,
      'weightKg': weightKg,
      'waterIntakeLiters': waterIntakeLiters,
      'sleepHours': sleepHours,
      'exerciseMinutes': exerciseMinutes,
    };
  }
}
