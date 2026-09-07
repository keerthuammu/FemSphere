import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../core/api_constants.dart';

class LifeStageProvider with ChangeNotifier {
  String _currentStageCode = 'REPRODUCTIVE_AGE';
  String _stageName = 'Reproductive Age';
  bool _isLoading = false;

  String get currentStageCode => _currentStageCode;
  String get stageName => _stageName;
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
          _currentStageCode = data['currentStage']['life_stage_code'] ?? 'REPRODUCTIVE_AGE';
          _stageName = data['currentStage']['name'] ?? 'Reproductive Age';
        }
      }
    } catch (e) {
      debugPrint('Error fetching Flutter life stage: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
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
