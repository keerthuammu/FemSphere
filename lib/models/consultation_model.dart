class DigitalPrescriptionItem {
  final String medication;
  final String dosage;
  final String frequency;
  final String durationDays;
  final String instructions;

  DigitalPrescriptionItem({
    required this.medication,
    required this.dosage,
    required this.frequency,
    required this.durationDays,
    required this.instructions,
  });

  factory DigitalPrescriptionItem.fromJson(Map<String, dynamic> json) {
    return DigitalPrescriptionItem(
      medication: json['medication'] ?? json['name'] ?? '',
      dosage: json['dosage'] ?? '',
      frequency: json['frequency'] ?? '',
      durationDays: json['durationDays']?.toString() ?? json['duration']?.toString() ?? '7',
      instructions: json['instructions'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'medication': medication,
      'dosage': dosage,
      'frequency': frequency,
      'durationDays': durationDays,
      'instructions': instructions,
    };
  }
}

class ConsultationModel {
  final int id;
  final int? patientId;
  final String patientName;
  final String patientAge;
  final String date;
  final String chiefComplaint;
  final String clinicalDiagnosis;
  final String clinicalNotes;
  final List<DigitalPrescriptionItem> prescriptions;
  final String followUpRecommendation;
  final String status; // 'Active' | 'Completed' | 'Follow-up Scheduled'

  ConsultationModel({
    required this.id,
    this.patientId,
    required this.patientName,
    this.patientAge = '28 yrs',
    required this.date,
    required this.chiefComplaint,
    required this.clinicalDiagnosis,
    required this.clinicalNotes,
    this.prescriptions = const [],
    this.followUpRecommendation = 'Routine re-evaluation in 3 months.',
    this.status = 'Completed',
  });

  factory ConsultationModel.fromJson(Map<String, dynamic> json) {
    String formattedDate = '2026-09-15';
    if (json['date'] != null) {
      formattedDate = json['date'].toString();
    } else if (json['consultation_date'] != null) {
      formattedDate = json['consultation_date'].toString().split('T')[0];
    } else if (json['created_at'] != null) {
      formattedDate = json['created_at'].toString().split('T')[0];
    }

    List<DigitalPrescriptionItem> items = [];
    if (json['prescriptions'] is List) {
      items = (json['prescriptions'] as List)
          .map((e) => DigitalPrescriptionItem.fromJson(e as Map<String, dynamic>))
          .toList();
    } else if (json['medications'] is List) {
      items = (json['medications'] as List)
          .map((e) => DigitalPrescriptionItem.fromJson(e as Map<String, dynamic>))
          .toList();
    }

    return ConsultationModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      patientId: json['patientId'] ?? json['patient_id'],
      patientName: json['patientName'] ?? json['patient_name'] ?? json['username'] ?? 'Patient',
      patientAge: json['patientAge'] ?? '28 yrs',
      date: formattedDate,
      chiefComplaint: json['chiefComplaint'] ?? json['chief_complaint'] ?? 'General Consultation',
      clinicalDiagnosis: json['clinicalDiagnosis'] ?? json['clinical_diagnosis'] ?? json['diagnosis'] ?? 'Clinical Evaluation Completed',
      clinicalNotes: json['clinicalNotes'] ?? json['clinical_notes'] ?? json['advice'] ?? 'Follow clinical care plan.',
      prescriptions: items,
      followUpRecommendation: json['followUpRecommendation'] ?? json['follow_up_date'] ?? 'Follow up as required.',
      status: json['status'] ?? 'Completed',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'patientId': patientId,
      'patientName': patientName,
      'patientAge': patientAge,
      'date': date,
      'chiefComplaint': chiefComplaint,
      'clinicalDiagnosis': clinicalDiagnosis,
      'clinicalNotes': clinicalNotes,
      'prescriptions': prescriptions.map((e) => e.toJson()).toList(),
      'followUpRecommendation': followUpRecommendation,
      'status': status,
    };
  }
}
