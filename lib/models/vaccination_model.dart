class VaccinationModel {
  final int id;
  final int? dependentId;
  final String vaccineName;
  final String targetDisease;
  final String recommendedAge; // e.g. '4–6 Years', '12 Months', 'Annual'
  final String dueDate;
  final String status; // 'Completed' | 'Due Soon' | 'Overdue' | 'Upcoming'
  final String? administeredDate;
  final String? administeredBy;
  final String? batchNumber;
  final String? notes;

  VaccinationModel({
    required this.id,
    this.dependentId,
    required this.vaccineName,
    required this.targetDisease,
    required this.recommendedAge,
    required this.dueDate,
    required this.status,
    this.administeredDate,
    this.administeredBy,
    this.batchNumber,
    this.notes,
  });

  factory VaccinationModel.fromJson(Map<String, dynamic> json) {
    return VaccinationModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      dependentId: json['dependentId'] ?? json['dependent_id'],
      vaccineName: json['vaccineName'] ?? json['vaccine_name'] ?? 'MMR Booster',
      targetDisease: json['targetDisease'] ?? json['target_disease'] ?? 'Measles, Mumps, Rubella',
      recommendedAge: json['recommendedAge'] ?? json['recommended_age'] ?? '4–6 Years',
      dueDate: json['dueDate'] ?? json['due_date'] ?? '2026-10-01',
      status: json['status'] ?? 'Due Soon',
      administeredDate: json['administeredDate'] ?? json['administered_date'],
      administeredBy: json['administeredBy'] ?? json['administered_by'] ?? 'Valley Pediatrics',
      batchNumber: json['batchNumber'] ?? json['batch_no'],
      notes: json['notes'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'dependentId': dependentId,
      'vaccineName': vaccineName,
      'targetDisease': targetDisease,
      'recommendedAge': recommendedAge,
      'dueDate': dueDate,
      'status': status,
      'administeredDate': administeredDate,
      'administeredBy': administeredBy,
      'batchNumber': batchNumber,
      'notes': notes,
    };
  }

  VaccinationModel copyWith({
    int? id,
    int? dependentId,
    String? vaccineName,
    String? targetDisease,
    String? recommendedAge,
    String? dueDate,
    String? status,
    String? administeredDate,
    String? administeredBy,
    String? batchNumber,
    String? notes,
  }) {
    return VaccinationModel(
      id: id ?? this.id,
      dependentId: dependentId ?? this.dependentId,
      vaccineName: vaccineName ?? this.vaccineName,
      targetDisease: targetDisease ?? this.targetDisease,
      recommendedAge: recommendedAge ?? this.recommendedAge,
      dueDate: dueDate ?? this.dueDate,
      status: status ?? this.status,
      administeredDate: administeredDate ?? this.administeredDate,
      administeredBy: administeredBy ?? this.administeredBy,
      batchNumber: batchNumber ?? this.batchNumber,
      notes: notes ?? this.notes,
    );
  }
}
