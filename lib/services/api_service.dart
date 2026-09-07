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

  // Auth: Login
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse(ApiConstants.login),
      headers: _headers,
      body: jsonEncode({'email': email, 'password': password}),
    );
    return jsonDecode(response.body);
  }

  // Auth: Register
  static Future<Map<String, dynamic>> register(Map<String, dynamic> formData) async {
    final response = await http.post(
      Uri.parse(ApiConstants.register),
      headers: _headers,
      body: jsonEncode(formData),
    );
    return jsonDecode(response.body);
  }

  // Health Vitals
  static Future<List<dynamic>> getVitals() async {
    final response = await http.get(Uri.parse(ApiConstants.vitals), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
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

  // Symptoms
  static Future<List<dynamic>> getSymptoms() async {
    final response = await http.get(Uri.parse(ApiConstants.symptoms), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return [];
  }

  // Doctor Shared Records
  static Future<List<dynamic>> getSharedRecords() async {
    final response = await http.get(Uri.parse(ApiConstants.sharedRecords), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return [];
  }

  // Admin Stats
  static Future<Map<String, dynamic>> getAdminStats() async {
    final response = await http.get(Uri.parse(ApiConstants.adminStats), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return {};
  }
}
