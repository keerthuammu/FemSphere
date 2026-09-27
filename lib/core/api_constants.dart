import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class ApiConstants {
  /// Allows manual override of host IP if using a custom physical device LAN IP
  static String? customHost;

  /// Dynamic Base URL Candidates
  /// - 127.0.0.1:5001: Works via USB ADB reverse on physical Android devices
  /// - 10.0.2.2:5001: Works on Android Emulator
  /// - 192.168.0.180:5001: Works over Wi-Fi
  /// - localhost:5001: Web and desktop
  static const List<String> defaultCandidates = [
    '127.0.0.1:5001',
    '10.0.2.2:5001',
    '192.168.0.180:5001',
    'localhost:5001',
  ];

  static String _activeHost = '127.0.0.1:5001';

  static String get activeHost => customHost ?? _activeHost;

  static set activeHost(String host) {
    _activeHost = host.trim().replaceAll('http://', '').replaceAll('/api', '').replaceAll('/', '');
  }

  static String get baseUrl {
    if (customHost != null && customHost!.isNotEmpty) {
      final clean = customHost!.trim().replaceAll('http://', '').replaceAll('/api', '').replaceAll('/', '');
      return 'http://$clean/api';
    }
    if (kIsWeb) {
      return 'http://localhost:5001/api';
    }
    return 'http://$_activeHost/api';
  }

  /// Automatically tests candidate hosts to locate the reachable FemSphere server
  static Future<String> autoDetectServer({Duration timeout = const Duration(milliseconds: 1500)}) async {
    if (customHost != null && customHost!.isNotEmpty) {
      return customHost!;
    }
    if (kIsWeb) {
      _activeHost = 'localhost:5001';
      return _activeHost;
    }

    final candidates = [
      _activeHost,
      ...defaultCandidates.where((h) => h != _activeHost),
    ];

    for (final host in candidates) {
      try {
        final uri = Uri.parse('http://$host/api/articles');
        final res = await http.get(uri).timeout(timeout);
        if (res.statusCode == 200 || res.statusCode == 401 || res.statusCode == 404) {
          _activeHost = host;
          debugPrint('🌸 FemSphere API successfully connected to: http://$host/api');
          return host;
        }
      } catch (_) {
        // Try next candidate
      }
    }

    return _activeHost;
  }

  /// Tests connectivity to a specific host and returns round-trip latency in ms or -1 if failed
  static Future<int> testHost(String host, {Duration timeout = const Duration(seconds: 2)}) async {
    final clean = host.trim().replaceAll('http://', '').replaceAll('/api', '').replaceAll('/', '');
    final stopwatch = Stopwatch()..start();
    try {
      final uri = Uri.parse('http://$clean/api/articles');
      final res = await http.get(uri).timeout(timeout);
      stopwatch.stop();
      if (res.statusCode == 200 || res.statusCode == 401 || res.statusCode == 404) {
        return stopwatch.elapsedMilliseconds;
      }
      return -1;
    } catch (_) {
      return -1;
    }
  }

  // Auth
  static String get login => '$baseUrl/auth/login';
  static String get register => '$baseUrl/auth/register';
  static String get me => '$baseUrl/auth/me';

  // Users, Profile & Notifications
  static String get users => '$baseUrl/users';
  static String get userProfile => '$baseUrl/users/profile';
  static String get notifications => '$baseUrl/users/notifications';
  static String get vitals => '$baseUrl/health-tracker/vitals';
  static String get symptoms => '$baseUrl/health-tracker/symptoms';

  // Caregiver
  static String get caregiverProfile => '$baseUrl/caregivers/profile';
  static String get dependents => '$baseUrl/caregivers/dependents';
  static String dependentVaccinations(int dependentId) => '$baseUrl/caregivers/dependents/$dependentId/vaccinations';
  static String dependentMedications(int dependentId) => '$baseUrl/caregivers/dependents/$dependentId/medications';

  // Doctor & Vault
  static String get doctors => '$baseUrl/doctors';
  static String get availableDoctors => '$baseUrl/doctors/available';
  static String get doctorStats => '$baseUrl/doctors/dashboard-stats';
  static String get doctorPatients => '$baseUrl/doctors/patients';
  static String get sharedRecords => '$baseUrl/doctors/shared-records';
  static String get consultationNotes => '$baseUrl/doctors/consultation-notes';
  static String get doctorSchedule => '$baseUrl/doctors/schedule';
  static String get medicalRecords => '$baseUrl/medical-records';

  // Appointments
  static String get appointments => '$baseUrl/appointments';
  static String appointmentStatus(int id) => '$baseUrl/appointments/$id/status';
  static String appointmentCancel(int id) => '$baseUrl/appointments/$id/cancel';

  // Admin
  static String get adminStats => '$baseUrl/admin/stats';
  static String get adminUsers => '$baseUrl/admin/users';
  static String get adminCaregivers => '$baseUrl/admin/caregivers';
  static String get adminArticles => '$baseUrl/admin/articles';
  static String approveDoctor(int id) => '$baseUrl/admin/doctors/$id/approve';
  static String adminUserStatus(int id) => '$baseUrl/admin/users/$id/status';

  // Articles & Content
  static String get articles => '$baseUrl/articles';

  // Life Stages, Privacy Consent, Timeline & AI Health Twin
  static String get lifeStages => '$baseUrl/life-stages';
  static String get userLifeStage => '$baseUrl/life-stages/current';
  static String get healthTimeline => '$baseUrl/health/timeline';
  static String get aiInsights => '$baseUrl/health/insights';
  static String get consents => '$baseUrl/privacy/consents';
  static String get partnerSharedHealth => '$baseUrl/privacy/partner/shared-health';
  static String get periodTrackerOverview => '$baseUrl/period-tracker/overview';

  // Universal Wearables & Smartwatches
  static String get wearablesDevices => '$baseUrl/wearables/devices';
  static String get wearablesStatus => '$baseUrl/wearables/status';
  static String get wearablesSync => '$baseUrl/wearables/sync';
  static String get wearablesData => '$baseUrl/wearables/data';
  static String get wearablesDataLatest => '$baseUrl/wearables/data/latest';
  static String get wearablesDataHistory => '$baseUrl/wearables/data/history';
  static String wearableDeviceDelete(dynamic id) => '$baseUrl/wearables/devices/$id';
}
