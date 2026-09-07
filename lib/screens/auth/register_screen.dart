import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../dashboards/user_dashboard_screen.dart';
import '../dashboards/caregiver_dashboard_screen.dart';
import '../dashboards/doctor_dashboard_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  int _currentStep = 1;

  String _accountType = 'Myself';
  final _fullNameController = TextEditingController(text: 'Elena Rostova');
  final _dobController = TextEditingController(text: '1996-08-14');
  final _mobileController = TextEditingController(text: '+1 (555) 382-9102');
  final _emailController = TextEditingController(text: 'elena.new@femsphere.health');
  final _usernameController = TextEditingController(text: 'elena_new');
  final _passwordController = TextEditingController(text: 'password123');
  final _bloodGroupController = TextEditingController(text: 'A+');

  Future<void> _submitRegistration() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);

    final payload = {
      'accountType': _accountType,
      'fullName': _fullNameController.text.trim(),
      'dob': _dobController.text,
      'gender': 'Female',
      'mobileNumber': _mobileController.text.trim(),
      'email': _emailController.text.trim(),
      'username': _usernameController.text.trim(),
      'password': _passwordController.text,
      'bloodGroup': _bloodGroupController.text,
      'heightCm': '168',
      'weightKg': '62',
    };

    final success = await auth.register(payload);

    if (success && auth.currentUser != null) {
      Widget targetScreen = const UserDashboardScreen();
      if (_accountType == 'Caregiver') targetScreen = const CaregiverDashboardScreen();
      if (_accountType == 'Doctor') targetScreen = const DoctorDashboardScreen();

      Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => targetScreen));
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('FemSphere Registration')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Center(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 540),
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppTheme.borderPurple),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F3FF),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        'Step $_currentStep of 5',
                        style: const TextStyle(color: AppTheme.primaryPurple, fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  _currentStep == 1 ? 'Select Account Type' : 'Personal Details & Credentials',
                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                ),
                const SizedBox(height: 20),

                if (auth.errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.all(12),
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.red.shade200),
                    ),
                    child: Text(auth.errorMessage!, style: TextStyle(color: Colors.red.shade700, fontSize: 13)),
                  ),
                ],

                if (_currentStep == 1) ...[
                  RadioListTile<String>(
                    title: const Text('Myself', style: TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: const Text('Personal Digital Health Twin, vitals, cycle & symptom history.'),
                    value: 'Myself',
                    groupValue: _accountType,
                    onChanged: (val) => setState(() => _accountType = val!),
                  ),
                  RadioListTile<String>(
                    title: const Text('Caregiver', style: TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: const Text('Family care management, medication & vaccination tracking.'),
                    value: 'Caregiver',
                    groupValue: _accountType,
                    onChanged: (val) => setState(() => _accountType = val!),
                  ),
                  RadioListTile<String>(
                    title: const Text('Doctor', style: TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: const Text('Consult patients, review AI health reports & management.'),
                    value: 'Doctor',
                    groupValue: _accountType,
                    onChanged: (val) => setState(() => _accountType = val!),
                  ),
                ] else ...[
                  TextField(
                    controller: _fullNameController,
                    decoration: const InputDecoration(labelText: 'Full Name', border: OutlineInputBorder()),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _emailController,
                    decoration: const InputDecoration(labelText: 'Email Address', border: OutlineInputBorder()),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _usernameController,
                    decoration: const InputDecoration(labelText: 'Username', border: OutlineInputBorder()),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _passwordController,
                    obscureText: true,
                    decoration: const InputDecoration(labelText: 'Password', border: OutlineInputBorder()),
                  ),
                ],

                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (_currentStep > 1)
                      OutlinedButton(
                        onPressed: () => setState(() => _currentStep--),
                        child: const Text('Back'),
                      )
                    else
                      const SizedBox(),

                    ElevatedButton(
                      onPressed: () {
                        if (_currentStep < 2) {
                          setState(() => _currentStep++);
                        } else {
                          _submitRegistration();
                        }
                      },
                      child: auth.isLoading
                          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white))
                          : Text(_currentStep < 2 ? 'Next' : 'Complete Registration'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
