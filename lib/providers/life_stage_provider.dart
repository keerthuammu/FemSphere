import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../core/api_constants.dart';

class LifeStageProvider with ChangeNotifier {
  String _currentStageCode = 'REPRODUCTIVE_AGE';
  String _stageName = 'Reproductive Age';
  int? _age;
  String? _dob;
  bool _menarcheStarted = true;
  bool _isPregnant = false;
  bool _isLoading = false;

  String get currentStageCode => _currentStageCode;
  String get stageName => _stageName;
  int? get age => _age;
  String? get dob => _dob;
  bool get menarcheStarted => _menarcheStarted;
  bool get isPregnant => _isPregnant;
  bool get isLoading => _isLoading;

  Future<void> fetchCurrentLifeStage(String token) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await http.get(
        Uri.parse(ApiConstants.userLifeStage),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['currentStage'] != null) {
          final cs = data['currentStage'];
          _currentStageCode = cs['life_stage_code'] ?? 'REPRODUCTIVE_AGE';
          _stageName = cs['name'] ?? 'Reproductive Age';
          _age = cs['age'] != null ? int.tryParse(cs['age'].toString()) : null;
          _dob = cs['dob']?.toString();
          if (cs['menarche_started'] != null) {
            _menarcheStarted = cs['menarche_started'] == true;
          }
          if (cs['is_pregnant'] != null) {
            _isPregnant = cs['is_pregnant'] == true;
          }
        }
      }
    } catch (e) {
      debugPrint('Error fetching Flutter life stage: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> calibrateBiologicalFactors(
    String token, {
    String? dob,
    bool? menarcheStarted,
  }) async {
    _isLoading = true;
    notifyListeners();
    try {
      final Map<String, dynamic> body = {};
      if (dob != null) body['dob'] = dob;
      if (menarcheStarted != null) body['menarcheStarted'] = menarcheStarted;

      final response = await http.put(
        Uri.parse(ApiConstants.userLifeStage),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(body),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['currentStage'] != null) {
          final cs = data['currentStage'];
          _currentStageCode = cs['life_stage_code'] ?? _currentStageCode;
          _stageName = cs['name'] ?? _stageName;
          _age = cs['age'] != null ? int.tryParse(cs['age'].toString()) : _age;
          _dob = cs['dob']?.toString() ?? _dob;
          if (cs['menarche_started'] != null) {
            _menarcheStarted = cs['menarche_started'] == true;
          }
          if (cs['is_pregnant'] != null) {
            _isPregnant = cs['is_pregnant'] == true;
          }
          return true;
        }
      }
    } catch (e) {
      debugPrint('Error calibrating biological life stage: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return false;
  }

  Future<bool> setLifeStage(String token, String code) async {
    try {
      final response = await http.put(
        Uri.parse(ApiConstants.userLifeStage),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'lifeStageCode': code,
          'isManual': true,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          _currentStageCode = code;
          _stageName = data['currentStage']['name'] ?? code;
          notifyListeners();
          return true;
        }
      }
    } catch (e) {
      debugPrint('Error setting Flutter life stage: $e');
    }
    return false;
  }
}
