class MedicationModel {
  final int id;
  final int? dependentId;
  final String name;
  final String dosage;
  final String frequency; // 'Once Daily', 'Twice Daily', 'Every 8 Hours', 'As Needed'
  final String timeOfDay; // '8:00 AM & 8:00 PM'
  final String instructions;
  final String prescribedBy;
  final String startDate;
  final String? endDate;
  final bool isTakenToday;
  final String? lastTakenTimestamp;

  MedicationModel({
    required this.id,
    this.dependentId,
    required this.name,
    required this.dosage,
    required this.frequency,
    required this.timeOfDay,
    this.instructions = 'Take with food and full glass of water.',
    this.prescribedBy = 'Dr. Sarah Jenkins',
    this.startDate = '2026-09-01',
    this.endDate,
    this.isTakenToday = false,
    this.lastTakenTimestamp,
  });

  factory MedicationModel.fromJson(Map<String, dynamic> json) {
    return MedicationModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      dependentId: json['dependentId'] ?? json['dependent_id'],
      name: json['name'] ?? 'Amoxicillin',
      dosage: json['dosage'] ?? '250mg Suspension',
      frequency: json['frequency'] ?? 'Twice Daily',
      timeOfDay: json['timeOfDay'] ?? json['schedule_time'] ?? '8:00 AM & 8:00 PM',
      instructions: json['instructions'] ?? 'Take after breakfast and dinner.',
      prescribedBy: json['prescribedBy'] ?? json['doctor_name'] ?? 'Dr. Sarah Jenkins',
      startDate: json['startDate'] ?? json['start_date'] ?? '2026-09-01',
      endDate: json['endDate'] ?? json['end_date'],
      isTakenToday: json['isTakenToday'] ?? json['is_taken'] ?? false,
      lastTakenTimestamp: json['lastTakenTimestamp'] ?? json['taken_at'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'dependentId': dependentId,
      'name': name,
      'dosage': dosage,
      'frequency': frequency,
      'timeOfDay': timeOfDay,
      'instructions': instructions,
      'prescribedBy': prescribedBy,
      'startDate': startDate,
      'endDate': endDate,
      'isTakenToday': isTakenToday,
      'lastTakenTimestamp': lastTakenTimestamp,
    };
  }

  MedicationModel copyWith({
    int? id,
    int? dependentId,
    String? name,
    String? dosage,
    String? frequency,
    String? timeOfDay,
    String? instructions,
    String? prescribedBy,
    String? startDate,
    String? endDate,
    bool? isTakenToday,
    String? lastTakenTimestamp,
  }) {
    return MedicationModel(
      id: id ?? this.id,
      dependentId: dependentId ?? this.dependentId,
      name: name ?? this.name,
      dosage: dosage ?? this.dosage,
      frequency: frequency ?? this.frequency,
      timeOfDay: timeOfDay ?? this.timeOfDay,
      instructions: instructions ?? this.instructions,
      prescribedBy: prescribedBy ?? this.prescribedBy,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      isTakenToday: isTakenToday ?? this.isTakenToday,
      lastTakenTimestamp: lastTakenTimestamp ?? this.lastTakenTimestamp,
    );
  }
}
