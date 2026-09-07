import 'package:flutter/foundation.dart';

class ApiConstants {
  // Automatically resolves host LAN IP (192.168.20.2) for physical devices & 10.0.2.2 for Emulator
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5001/api';
    } else if (defaultTargetPlatform == TargetPlatform.android) {
      // Direct LAN IP allows both physical Android devices (over Wi-Fi) and Emulators to connect
      return 'http://192.168.20.2:5001/api';
    }
    return 'http://localhost:5001/api';
  }

  // Auth
  static String get login => '$baseUrl/auth/login';
  static String get register => '$baseUrl/auth/register';
  static String get me => '$baseUrl/auth/me';

  // Users & Vitals
  static String get users => '$baseUrl/users';
  static String get userProfile => '$baseUrl/users/profile';
  static String get vitals => '$baseUrl/health-tracker/vitals';
  static String get symptoms => '$baseUrl/health-tracker/symptoms';

  // Caregiver
  static String get caregiverProfile => '$baseUrl/caregivers/profile';
  static String get dependents => '$baseUrl/caregivers/dependents';

  // Doctor & Vault
  static String get doctors => '$baseUrl/doctors';
  static String get sharedRecords => '$baseUrl/doctors/shared-records';
  static String get consultationNotes => '$baseUrl/doctors/consultation-notes';
  static String get medicalRecords => '$baseUrl/medical-records';

  // Appointments & Admin
  static String get appointments => '$baseUrl/appointments';
  static String get adminStats => '$baseUrl/admin/stats';
  static String get articles => '$baseUrl/articles';

  // Life Stages, Privacy Consent, Timeline & AI Health Twin
  static String get lifeStages => '$baseUrl/life-stages';
  static String get userLifeStage => '$baseUrl/life-stages/current';
  static String get healthTimeline => '$baseUrl/health/timeline';
  static String get aiInsights => '$baseUrl/health/insights';
  static String get consents => '$baseUrl/privacy/consents';
  static String get partnerSharedHealth => '$baseUrl/privacy/partner/shared-health';
}
