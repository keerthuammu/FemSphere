import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiEndpoints {
  // Base URL resolution
  // Android Emulator uses 10.0.2.2 to access host computer's localhost:5001
  // iOS Simulator / macOS / Web uses localhost:5001
  static String get defaultBaseUrl {
    if (kIsWeb) {
      return 'http://localhost:5001';
    }
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:5001';
    }
    return 'http://localhost:5001';
  }

  static String baseUrl = defaultBaseUrl;

  // Base API prefix
  static String get apiBase => '$baseUrl/api';

  // Health
  static String get health => '$apiBase/health';

  // Auth Routes
  static String get login => '$apiBase/auth/login';
  static String get register => '$apiBase/auth/register';
  static String get me => '$apiBase/auth/me';
  static String get logout => '$apiBase/auth/logout';

  // User Profile
  static String get userProfile => '$apiBase/users/profile';
  static String get userAvatar => '$apiBase/users/avatar';
  static String get userLifeStage => '$apiBase/life-stages';

  // Health Tracker
  static String get healthTracker => '$apiBase/health-tracker';
  static String get healthTrackerToday => '$apiBase/health-tracker/today';
  static String get healthTrackerHistory => '$apiBase/health-tracker/history';

  // Period Tracker
  static String get periodTracker => '$apiBase/period-tracker';
  static String get periodCurrentCycle => '$apiBase/period-tracker/current';
  static String get periodHistory => '$apiBase/period-tracker/history';
  static String get periodInsights => '$apiBase/period-tracker/insights';

  // AI Health Twin & Insights
  static String get aiTwinInsights => '$apiBase/health/insights';
  static String get healthTimeline => '$apiBase/health/timeline';

  // Medical Records Vault (OCR / Multer upload)
  static String get medicalRecords => '$apiBase/medical-records';
  static String get uploadMedicalRecord => '$apiBase/medical-records/upload';
  static String medicalRecordFile(int id) => '$apiBase/medical-records/$id/file';

  // Appointments
  static String get appointments => '$apiBase/appointments';
  static String get bookAppointment => '$apiBase/appointments/book';
  static String appointmentStatus(int id) => '$apiBase/appointments/$id/status';

  // Caregiver Portal
  static String get caregivers => '$apiBase/caregivers';
  static String get caregiverDependents => '$apiBase/caregivers/dependents';
  static String get caregiverMedications => '$apiBase/caregivers/medications';
  static String get caregiverVaccinations => '$apiBase/caregivers/vaccinations';

  // Doctor Portal
  static String get doctors => '$apiBase/doctors';
  static String get doctorAvailability => '$apiBase/doctors/availability';
  static String get doctorPatients => '$apiBase/doctors/patients';
  static String get doctorConsultations => '$apiBase/doctors/consultations';

  // Admin Portal
  static String get adminStats => '$apiBase/admin/stats';
  static String get adminUsers => '$apiBase/admin/users';
  static String get adminDoctors => '$apiBase/admin/doctors';
  static String get adminCaregivers => '$apiBase/admin/caregivers';

  // Health Articles
  static String get articles => '$apiBase/articles';
}
