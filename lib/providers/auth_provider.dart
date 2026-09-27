import 'dart:async';
import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';
import '../core/api_constants.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _currentUser;
  String? _token;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get currentUser => _currentUser;
  String? get token => _token;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _currentUser != null;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await ApiConstants.autoDetectServer();
      final res = await ApiService.login(email, password).timeout(
        const Duration(seconds: 10),
      );

      if (res['success'] == true) {
        _token = res['token'];
        ApiService.authToken = _token;
        _currentUser = UserModel.fromJson(res['user']);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = res['message'] ?? 'Invalid email or password.';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = 'Could not connect to FemSphere API server at ${ApiConstants.baseUrl} ($e). Tap Server Settings to verify.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register(Map<String, dynamic> formData) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await ApiConstants.autoDetectServer();
      final res = await ApiService.register(formData).timeout(
        const Duration(seconds: 10),
      );

      if (res['success'] == true) {
        _token = res['token'];
        ApiService.authToken = _token;
        _currentUser = UserModel.fromJson(res['user']);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = res['message'] ?? 'Registration failed.';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = 'Could not connect to FemSphere API server at ${ApiConstants.baseUrl} ($e). Tap Server Settings to verify.';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  void logout() {
    _currentUser = null;
    _token = null;
    ApiService.authToken = null;
    notifyListeners();
  }
}
