import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/api_constants.dart';

class ApiService {
  static String? authToken;

  static Map<String, String> get _headers {
    final map = <String, String>{
      'Content-Type': 'application/json',
    };
    if (authToken != null && authToken!.isNotEmpty) {
      map['Authorization'] = 'Bearer $authToken';
    }
    return map;
  }

  // ===========================================================================
  // AUTHENTICATION & PROFILE
  // ===========================================================================
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse(ApiConstants.login),
      headers: _headers,
      body: jsonEncode({'email': email, 'password': password}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> register(Map<String, dynamic> formData) async {
    final response = await http.post(
      Uri.parse(ApiConstants.register),
      headers: _headers,
      body: jsonEncode(formData),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getProfile() async {
    final response = await http.get(Uri.parse(ApiConstants.userProfile), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return {};
  }

  static Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> data) async {
    final response = await http.put(
      Uri.parse(ApiConstants.userProfile),
      headers: _headers,
      body: jsonEncode(data),
    );
    return jsonDecode(response.body);
  }

  // ===========================================================================
  // APPOINTMENTS
  // ===========================================================================
  static Future<List<dynamic>> getAppointments() async {
    final response = await http.get(Uri.parse(ApiConstants.appointments), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is Map && decoded['appointments'] != null) {
        return decoded['appointments'] as List<dynamic>;
      } else if (decoded is List) {
        return decoded;
      }
    }
    return [];
  }

  static Future<Map<String, dynamic>> bookAppointment(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse(ApiConstants.appointments),
      headers: _headers,
      body: jsonEncode(data),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> updateAppointmentStatus(int id, String status) async {
    final response = await http.put(
      Uri.parse(ApiConstants.appointmentStatus(id)),
      headers: _headers,
      body: jsonEncode({'status': status}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> cancelAppointment(int id) async {
    final response = await http.post(
      Uri.parse(ApiConstants.appointmentCancel(id)),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  // ===========================================================================
  // MEDICAL RECORDS
  // ===========================================================================
  static Future<List<dynamic>> getMedicalRecords() async {
    final response = await http.get(Uri.parse(ApiConstants.medicalRecords), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
      if (decoded is Map && decoded['records'] != null) return decoded['records'];
    }
    return [];
  }

  static Future<Map<String, dynamic>> uploadMedicalRecord(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse(ApiConstants.medicalRecords),
      headers: _headers,
      body: jsonEncode(data),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> deleteMedicalRecord(int id) async {
    final response = await http.delete(
      Uri.parse('${ApiConstants.medicalRecords}/$id'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  // ===========================================================================
  // DOCTOR MODULE
  // ===========================================================================
  static Future<List<dynamic>> getDoctors() async {
    final response = await http.get(Uri.parse(ApiConstants.doctors), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
    }
    return [];
  }

  static Future<Map<String, dynamic>> getDoctorDashboardStats() async {
    final response = await http.get(Uri.parse(ApiConstants.doctorStats), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return {};
  }

  static Future<List<dynamic>> getDoctorPatients() async {
    final response = await http.get(Uri.parse(ApiConstants.doctorPatients), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is Map && decoded['patients'] != null) {
        return decoded['patients'] as List<dynamic>;
      }
      if (decoded is List) return decoded;
    }
    return [];
  }

  static Future<List<dynamic>> getDoctorSharedRecords() async {
    final response = await http.get(Uri.parse(ApiConstants.sharedRecords), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
      if (decoded is Map && decoded['records'] != null) return decoded['records'];
    }
    return [];
  }

  static Future<List<dynamic>> getDoctorConsultations() async {
    final response = await http.get(Uri.parse(ApiConstants.consultationNotes), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
      if (decoded is Map && decoded['notes'] != null) return decoded['notes'];
    }
    return [];
  }

  static Future<Map<String, dynamic>> createConsultationNote(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse(ApiConstants.consultationNotes),
      headers: _headers,
      body: jsonEncode(data),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> deleteConsultationNote(int id) async {
    final response = await http.delete(
      Uri.parse('${ApiConstants.consultationNotes}/$id'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getDoctorSchedule() async {
    final response = await http.get(Uri.parse(ApiConstants.doctorSchedule), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return {};
  }

  static Future<Map<String, dynamic>> updateDoctorSchedule(Map<String, dynamic> data) async {
    final response = await http.put(
      Uri.parse(ApiConstants.doctorSchedule),
      headers: _headers,
      body: jsonEncode(data),
    );
    return jsonDecode(response.body);
  }

  // ===========================================================================
  // CAREGIVER MODULE
  // ===========================================================================
  static Future<Map<String, dynamic>> getCaregiverProfile() async {
    final response = await http.get(Uri.parse(ApiConstants.caregiverProfile), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return {};
  }

  static Future<List<dynamic>> getDependents() async {
    final res = await getCaregiverProfile();
    if (res['success'] == true && res['dependents'] != null) {
      return res['dependents'] as List<dynamic>;
    }
    return [];
  }

  static Future<Map<String, dynamic>> addDependent(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse(ApiConstants.dependents),
      headers: _headers,
      body: jsonEncode(data),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> deleteDependent(int dependentId) async {
    final response = await http.delete(
      Uri.parse('${ApiConstants.dependents}/$dependentId'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  static Future<List<dynamic>> getVaccinations(int dependentId) async {
    final response = await http.get(Uri.parse(ApiConstants.dependentVaccinations(dependentId)), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
    }
    return [];
  }

  static Future<List<dynamic>> getMedications(int dependentId) async {
    final response = await http.get(Uri.parse(ApiConstants.dependentMedications(dependentId)), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
    }
    return [];
  }

  // ===========================================================================
  // ADMIN MODULE
  // ===========================================================================
  static Future<Map<String, dynamic>> getAdminStats() async {
    final response = await http.get(Uri.parse(ApiConstants.adminStats), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return {};
  }

  static Future<List<dynamic>> getAdminUsers() async {
    final response = await http.get(Uri.parse(ApiConstants.adminUsers), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
      if (decoded is Map && decoded['users'] != null) return decoded['users'];
    }
    return [];
  }

  static Future<Map<String, dynamic>> createAdminUser(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse(ApiConstants.adminUsers),
      headers: _headers,
      body: jsonEncode(data),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> deleteAdminUser(int id) async {
    final response = await http.delete(
      Uri.parse('${ApiConstants.adminUsers}/$id'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> updateUserStatus(int id, String status) async {
    final response = await http.put(
      Uri.parse(ApiConstants.adminUserStatus(id)),
      headers: _headers,
      body: jsonEncode({'status': status}),
    );
    return jsonDecode(response.body);
  }

  static Future<List<dynamic>> getAdminDoctors() async {
    return await getDoctors();
  }

  static Future<Map<String, dynamic>> approveDoctor(int id) async {
    final response = await http.put(
      Uri.parse(ApiConstants.approveDoctor(id)),
      headers: _headers,
      body: jsonEncode({'status': 'Approved'}),
    );
    return jsonDecode(response.body);
  }

  static Future<List<dynamic>> getAdminCaregivers() async {
    final response = await http.get(Uri.parse(ApiConstants.adminCaregivers), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
      if (decoded is Map && decoded['caregivers'] != null) return decoded['caregivers'];
    }
    return [];
  }

  static Future<List<dynamic>> getAdminArticles() async {
    final response = await http.get(Uri.parse(ApiConstants.adminArticles), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
      if (decoded is Map && decoded['articles'] != null) return decoded['articles'];
    }
    return [];
  }

  static Future<Map<String, dynamic>> createAdminArticle(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse(ApiConstants.adminArticles),
      headers: _headers,
      body: jsonEncode(data),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> deleteAdminArticle(int id) async {
    final response = await http.delete(
      Uri.parse('${ApiConstants.adminArticles}/$id'),
      headers: _headers,
    );
    return jsonDecode(response.body);
  }

  // ===========================================================================
  // HEALTH TRACKER, VITALS, SYMPTOMS & NOTIFICATIONS
  // ===========================================================================
  static Future<List<dynamic>> getVitals() async {
    final response = await http.get(Uri.parse(ApiConstants.vitals), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
    }
    return [];
  }

  static Future<Map<String, dynamic>> postVital(Map<String, dynamic> vitalData) async {
    final response = await http.post(
      Uri.parse(ApiConstants.vitals),
      headers: _headers,
      body: jsonEncode(vitalData),
    );
    return jsonDecode(response.body);
  }

  static Future<List<dynamic>> getSymptoms() async {
    final response = await http.get(Uri.parse(ApiConstants.symptoms), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
    }
    return [];
  }

  static Future<List<dynamic>> getNotifications() async {
    final response = await http.get(Uri.parse(ApiConstants.notifications), headers: _headers);
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is List) return decoded;
      if (decoded is Map && decoded['notifications'] != null) return decoded['notifications'];
    }
    return [];
  }

  static Future<Map<String, dynamic>> getPeriodOverview() async {
    final response = await http.get(Uri.parse(ApiConstants.periodTrackerOverview), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return {};
  }
}
