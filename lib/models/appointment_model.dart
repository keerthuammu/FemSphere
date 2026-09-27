class AppointmentModel {
  final int id;
  final int? userId;
  final String userName;
  final int? doctorId;
  final String doctorName;
  final String doctorSpecialty;
  final String date;
  final String timeSlot;
  final String type; // 'Video Consultation' | 'In-Clinic Visit'
  final String reason;
  final String status; // 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
  final String? notes;

  AppointmentModel({
    required this.id,
    this.userId,
    this.userName = 'Patient',
    this.doctorId,
    required this.doctorName,
    required this.doctorSpecialty,
    required this.date,
    required this.timeSlot,
    this.type = 'Video Consultation',
    required this.reason,
    this.status = 'Pending',
    this.notes,
  });

  factory AppointmentModel.fromJson(Map<String, dynamic> json) {
    return AppointmentModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      userId: json['userId'] ?? json['user_id'],
      userName: json['userName'] ?? json['user_name'] ?? 'Patient',
      doctorId: json['doctorId'] ?? json['doctor_id'],
      doctorName: json['doctorName'] ?? json['doctor_name'] ?? 'Doctor',
      doctorSpecialty: json['doctorSpecialty'] ?? json['doctor_specialty'] ?? 'Specialist',
      date: json['date'] ?? json['appointment_date'] ?? '',
      timeSlot: json['timeSlot'] ?? json['time_slot'] ?? '',
      type: json['type'] ?? 'Video Consultation',
      reason: json['reason'] ?? 'Consultation',
      status: json['status'] ?? 'Pending',
      notes: json['notes'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'userName': userName,
      'doctorId': doctorId,
      'doctorName': doctorName,
      'doctorSpecialty': doctorSpecialty,
      'date': date,
      'timeSlot': timeSlot,
      'type': type,
      'reason': reason,
      'status': status,
      'notes': notes,
    };
  }

  AppointmentModel copyWith({
    int? id,
    int? userId,
    String? userName,
    int? doctorId,
    String? doctorName,
    String? doctorSpecialty,
    String? date,
    String? timeSlot,
    String? type,
    String? reason,
    String? status,
    String? notes,
  }) {
    return AppointmentModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      userName: userName ?? this.userName,
      doctorId: doctorId ?? this.doctorId,
      doctorName: doctorName ?? this.doctorName,
      doctorSpecialty: doctorSpecialty ?? this.doctorSpecialty,
      date: date ?? this.date,
      timeSlot: timeSlot ?? this.timeSlot,
      type: type ?? this.type,
      reason: reason ?? this.reason,
      status: status ?? this.status,
      notes: notes ?? this.notes,
    );
  }
}
