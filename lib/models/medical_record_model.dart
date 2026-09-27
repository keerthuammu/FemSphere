class MedicalRecordModel {
  final int id;
  final String title;
  final String category; // 'Lab Results' | 'Prescriptions' | 'Scans & Imaging' | 'Clinical Summaries' | 'Immunization'
  final String date;
  final String doctorOrLab;
  final String fileType; // 'PDF' | 'IMAGE' | 'DICOM'
  final String fileSize;
  final String? summary;
  final bool isSharedWithDoctor;
  final int? dependentId;

  MedicalRecordModel({
    required this.id,
    required this.title,
    required this.category,
    required this.date,
    required this.doctorOrLab,
    this.fileType = 'PDF',
    this.fileSize = '1.4 MB',
    this.summary,
    this.isSharedWithDoctor = true,
    this.dependentId,
  });

  factory MedicalRecordModel.fromJson(Map<String, dynamic> json) {
    String formattedDate = '2026-09-01';
    if (json['date'] != null) {
      formattedDate = json['date'].toString();
    } else if (json['uploaded_at'] != null) {
      formattedDate = json['uploaded_at'].toString().split('T')[0];
    }

    String sizeStr = '1.2 MB';
    if (json['fileSize'] != null) {
      sizeStr = json['fileSize'].toString();
    } else if (json['file_size_bytes'] != null) {
      final bytes = num.tryParse(json['file_size_bytes'].toString()) ?? 1500000;
      sizeStr = '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
    }

    return MedicalRecordModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      title: json['title'] ?? json['file_name'] ?? 'Medical Document',
      category: json['category'] ?? 'Lab Results',
      date: formattedDate,
      doctorOrLab: json['doctorOrLab'] ?? json['doctor_name'] ?? json['patient_name'] ?? json['facility'] ?? 'Apex Diagnostic Labs',
      fileType: (json['fileType'] ?? json['file_type'] ?? 'PDF').toString().toUpperCase(),
      fileSize: sizeStr,
      summary: json['summary'] ?? json['description'] ?? json['notes'],
      isSharedWithDoctor: json['isSharedWithDoctor'] ?? json['is_shared'] ?? true,
      dependentId: json['dependentId'] ?? json['dependent_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'category': category,
      'date': date,
      'doctorOrLab': doctorOrLab,
      'fileType': fileType,
      'fileSize': fileSize,
      'summary': summary,
      'isSharedWithDoctor': isSharedWithDoctor,
      'dependentId': dependentId,
    };
  }

  MedicalRecordModel copyWith({
    int? id,
    String? title,
    String? category,
    String? date,
    String? doctorOrLab,
    String? fileType,
    String? fileSize,
    String? summary,
    bool? isSharedWithDoctor,
    int? dependentId,
  }) {
    return MedicalRecordModel(
      id: id ?? this.id,
      title: title ?? this.title,
      category: category ?? this.category,
      date: date ?? this.date,
      doctorOrLab: doctorOrLab ?? this.doctorOrLab,
      fileType: fileType ?? this.fileType,
      fileSize: fileSize ?? this.fileSize,
      summary: summary ?? this.summary,
      isSharedWithDoctor: isSharedWithDoctor ?? this.isSharedWithDoctor,
      dependentId: dependentId ?? this.dependentId,
    );
  }
}
