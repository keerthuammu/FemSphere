class DependentModel {
  final int id;
  final String fullName;
  final String relationship; // 'Child' | 'Daughter' | 'Mother' | 'Spouse' | 'Elderly Parent'
  final String dob;
  final String bloodGroup;
  final String gender;
  final List<String> allergies;
  final String? chronicConditions;
  final String? avatarIcon;
  final String lastVitalsCheck;
  final int pendingVaccinesCount;
  final int activeMedicationsCount;

  DependentModel({
    required this.id,
    required this.fullName,
    required this.relationship,
    required this.dob,
    required this.bloodGroup,
    this.gender = 'Female',
    this.allergies = const [],
    this.chronicConditions,
    this.avatarIcon,
    this.lastVitalsCheck = 'No vitals logged yet',
    this.pendingVaccinesCount = 0,
    this.activeMedicationsCount = 0,
  });

  factory DependentModel.fromJson(Map<String, dynamic> json) {
    String formattedDob = '2020-01-01';
    if (json['dob'] != null) {
      formattedDob = json['dob'].toString().split('T')[0];
    } else if (json['date_of_birth'] != null) {
      formattedDob = json['date_of_birth'].toString().split('T')[0];
    }

    return DependentModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      fullName: json['fullName'] ?? json['full_name'] ?? json['name'] ?? 'Dependent',
      relationship: json['relationship'] ?? json['relation'] ?? 'Dependent',
      dob: formattedDob,
      bloodGroup: json['bloodGroup'] ?? json['blood_group'] ?? 'A+',
      gender: json['gender'] ?? 'Female',
      allergies: (json['allergies'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      chronicConditions: json['chronicConditions'] ?? json['chronic_conditions'] ?? json['medical_notes'],
      avatarIcon: json['avatarIcon'],
      lastVitalsCheck: json['lastVitalsCheck'] ?? 'Vitals up to date',
      pendingVaccinesCount: json['pendingVaccinesCount'] ?? 0,
      activeMedicationsCount: json['activeMedicationsCount'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'relationship': relationship,
      'dob': dob,
      'bloodGroup': bloodGroup,
      'gender': gender,
      'allergies': allergies,
      'chronicConditions': chronicConditions,
      'avatarIcon': avatarIcon,
      'lastVitalsCheck': lastVitalsCheck,
      'pendingVaccinesCount': pendingVaccinesCount,
      'activeMedicationsCount': activeMedicationsCount,
    };
  }

  DependentModel copyWith({
    int? id,
    String? fullName,
    String? relationship,
    String? dob,
    String? bloodGroup,
    String? gender,
    List<String>? allergies,
    String? chronicConditions,
    String? avatarIcon,
    String? lastVitalsCheck,
    int? pendingVaccinesCount,
    int? activeMedicationsCount,
  }) {
    return DependentModel(
      id: id ?? this.id,
      fullName: fullName ?? this.fullName,
      relationship: relationship ?? this.relationship,
      dob: dob ?? this.dob,
      bloodGroup: bloodGroup ?? this.bloodGroup,
      gender: gender ?? this.gender,
      allergies: allergies ?? this.allergies,
      chronicConditions: chronicConditions ?? this.chronicConditions,
      avatarIcon: avatarIcon ?? this.avatarIcon,
      lastVitalsCheck: lastVitalsCheck ?? this.lastVitalsCheck,
      pendingVaccinesCount: pendingVaccinesCount ?? this.pendingVaccinesCount,
      activeMedicationsCount: activeMedicationsCount ?? this.activeMedicationsCount,
    );
  }
}
