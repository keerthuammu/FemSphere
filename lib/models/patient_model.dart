class PatientModel {
  final int id;
  final String fullName;
  final String email;
  final String age;
  final String gender;
  final String bloodGroup;
  final int healthTwinScore; // e.g. 92/100
  final String primaryConcern;
  final String lastVisit;
  final String lifeStage;
  final int sharedRecordsCount;
  final String riskCategory; // 'Optimal' | 'Low Risk' | 'Moderate' | 'Attention Needed'

  PatientModel({
    required this.id,
    required this.fullName,
    required this.email,
    required this.age,
    this.gender = 'Female',
    required this.bloodGroup,
    required this.healthTwinScore,
    required this.primaryConcern,
    required this.lastVisit,
    required this.lifeStage,
    this.sharedRecordsCount = 4,
    this.riskCategory = 'Optimal',
  });

  factory PatientModel.fromJson(Map<String, dynamic> json) {
    return PatientModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      fullName: json['fullName'] ?? json['full_name'] ?? json['username'] ?? 'Patient',
      email: json['email'] ?? '',
      age: json['age']?.toString() ?? '',
      gender: json['gender'] ?? 'Female',
      bloodGroup: json['bloodGroup'] ?? json['blood_group'] ?? '',
      healthTwinScore: json['healthTwinScore'] ?? json['health_score'] ?? 85,
      primaryConcern: json['primaryConcern'] ?? json['primary_concern'] ?? 'General Consultation',
      lastVisit: json['lastVisit'] ?? json['last_visit'] ?? 'Recent',
      lifeStage: json['lifeStage'] ?? '',
      sharedRecordsCount: json['sharedRecordsCount'] is int ? json['sharedRecordsCount'] : 0,
      riskCategory: json['riskCategory'] ?? 'Optimal',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'email': email,
      'age': age,
      'gender': gender,
      'bloodGroup': bloodGroup,
      'healthTwinScore': healthTwinScore,
      'primaryConcern': primaryConcern,
      'lastVisit': lastVisit,
      'lifeStage': lifeStage,
      'sharedRecordsCount': sharedRecordsCount,
      'riskCategory': riskCategory,
    };
  }
}
