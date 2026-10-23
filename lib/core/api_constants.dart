import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class ApiConstants {
  /// Allows manual override of host IP if using a custom physical device LAN IP
  static String? customHost;

  /// Dynamic Base URL Candidates
  /// - api.femsphere.me: Production cloud backend (HTTPS)
  static const List<String> defaultCandidates = [
    'api.femsphere.me',
  ];

  static String _activeHost = 'api.femsphere.me';

  static String get activeHost => customHost ?? _activeHost;

  static set activeHost(String host) {
    _activeHost = host.trim().replaceAll('http://', '').replaceAll('https://', '').replaceAll('/api', '').replaceAll('/', '');
  }

  static String get baseUrl {
    if (customHost != null && customHost!.isNotEmpty) {
      final clean = customHost!.trim().replaceAll('http://', '').replaceAll('https://', '').replaceAll('/api', '').replaceAll('/', '');
      final scheme = customHost!.startsWith('https://') || clean.contains('femsphere.me') ? 'https' : 'http';
      return '$scheme://$clean/api';
    }
    return 'https://api.femsphere.me/api';
  }

  /// Automatically tests candidate hosts to locate the reachable FemSphere server
  static Future<String> autoDetectServer({Duration timeout = const Duration(milliseconds: 2500)}) async {
    if (customHost != null && customHost!.isNotEmpty) {
      return customHost!;
    }
    _activeHost = 'api.femsphere.me';

    try {
      final uri = Uri.parse('https://api.femsphere.me/api/articles');
      final res = await http.get(uri).timeout(timeout);
      if (res.statusCode == 200 || res.statusCode == 401 || res.statusCode == 404) {
        debugPrint('🌸 FemSphere API successfully connected to: https://api.femsphere.me/api');
        return 'api.femsphere.me';
      }
    } catch (e) {
      debugPrint('FemSphere cloud ping note: $e');
    }

    return 'api.femsphere.me';
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
  static String get aiTwinChat => '$baseUrl/health/insights/chat';
  static String get aiTwinGenerate => '$baseUrl/health/insights/generate';
  static String get consents => '$baseUrl/privacy/consents';
  static String get partnerSharedHealth => '$baseUrl/privacy/partner/shared-health';
  static String get periodTrackerOverview => '$baseUrl/period-tracker/overview';
  static String get periodTrackerSettings => '$baseUrl/period-tracker/settings';
  static String get periodTrackerCycles => '$baseUrl/period-tracker/cycles';
  static String periodTrackerCycle(dynamic id) => '$baseUrl/period-tracker/cycles/$id';
  static String get periodTrackerDaily => '$baseUrl/period-tracker/daily';
  static String periodTrackerDailyDate(String date) => '$baseUrl/period-tracker/daily/$date';
  static String get periodTrackerInsights => '$baseUrl/period-tracker/insights';
  static String get periodTrackerDelay => '$baseUrl/period-tracker/adjust-delay';
  static String get pregnancyActivate => '$baseUrl/period-tracker/pregnancy/activate';
  static String get pregnancyDeactivate => '$baseUrl/period-tracker/pregnancy/deactivate';

  // Universal Wearables & Smartwatches
  static String get wearablesDevices => '$baseUrl/wearables/devices';
  static String get wearablesStatus => '$baseUrl/wearables/status';
  static String get wearablesSync => '$baseUrl/wearables/sync';
  static String get wearablesData => '$baseUrl/wearables/data';
  static String get wearablesDataLatest => '$baseUrl/wearables/data/latest';
  static String get wearablesDataHistory => '$baseUrl/wearables/data/history';
  static String wearableDeviceDelete(dynamic id) => '$baseUrl/wearables/devices/$id';

  // Companion & Caregiver Connections
  static String get connectionSearch => '$baseUrl/connections/search';
  static String get connectionRequest => '$baseUrl/connections/request';
  static String get connectionOutgoing => '$baseUrl/connections/outgoing';
  static String get connectionIncoming => '$baseUrl/connections/incoming';
  static String get connectionPendingCount => '$baseUrl/connections/pending-count';
  static String connectionAccept(dynamic id) => '$baseUrl/connections/$id/accept';
  static String connectionReject(dynamic id) => '$baseUrl/connections/$id/reject';
  static String connectionCancel(dynamic id) => '$baseUrl/connections/$id/cancel';
  static String connectionRevoke(dynamic id) => '$baseUrl/connections/$id/revoke';
  static String connectionPermissions(dynamic id) => '$baseUrl/connections/$id/permissions';
  static String connectionSharedData(dynamic id) => '$baseUrl/connections/$id/shared-data';
  static String connectionConsent(dynamic id) => '$baseUrl/connections/$id/consent';
  static String get connectionAccessHistory => '$baseUrl/connections/access-history';
  static String connectionRequestCategory(dynamic id) => '$baseUrl/connections/$id/request-category';
}
