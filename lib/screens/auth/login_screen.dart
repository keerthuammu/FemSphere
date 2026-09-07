import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../dashboards/user_dashboard_screen.dart';
import '../dashboards/caregiver_dashboard_screen.dart';
import '../dashboards/doctor_dashboard_screen.dart';
import '../dashboards/admin_dashboard_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: 'elena.rostova@femsphere.health');
  final _passwordController = TextEditingController(text: 'password123');
  String _selectedRole = 'Myself';

  void _navigateRoleDashboard(String role) {
    Widget targetScreen = const UserDashboardScreen();
    if (role.contains('Admin')) {
      targetScreen = const AdminDashboardScreen();
    } else if (role.contains('Caregiver')) {
      targetScreen = const CaregiverDashboardScreen();
    } else if (role.contains('Doctor')) {
      targetScreen = const DoctorDashboardScreen();
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => targetScreen),
    );
  }

  Future<void> _handleLogin() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.login(_emailController.text.trim(), _passwordController.text);

    if (success && auth.currentUser != null) {
      _navigateRoleDashboard(auth.currentUser!.role);
    }
  }

  void _handleQuickDemoLogin(String role, String email) {
    setState(() {
      _selectedRole = role;
      _emailController.text = email;
      _passwordController.text = 'password123';
    });
    _handleLogin();
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Log In to FemSphere'),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Container(
            constraints: const BoxConstraints(maxWidth: 480),
            padding: const EdgeInsets.all(32.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppTheme.borderPurple),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 16,
                  offset: const Offset(0, 8),
                )
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Welcome Back',
                  style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Enter credentials or select a role for quick demo access.',
                  style: TextStyle(fontSize: 13, color: AppTheme.textMuted),
                ),
                const SizedBox(height: 20),

                // Quick Demo Login Role Buttons
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F3FF),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.borderPurple),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'QUICK DEMO LOGIN BY ROLE:',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.primaryPurple),
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          ActionChip(
                            avatar: const Icon(Icons.person, size: 16, color: AppTheme.primaryPurple),
                            label: const Text('Myself'),
                            onPressed: () => _handleQuickDemoLogin('Myself', 'elena.rostova@femsphere.health'),
                          ),
                          ActionChip(
                            avatar: const Icon(Icons.people, size: 16, color: Color(0xFFEC4899)),
                            label: const Text('Caregiver'),
                            onPressed: () => _handleQuickDemoLogin('Caregiver', 'caregiver@femsphere.health'),
                          ),
                          ActionChip(
                            avatar: const Icon(Icons.medical_services, size: 16, color: AppTheme.secondaryTeal),
                            label: const Text('Doctor'),
                            onPressed: () => _handleQuickDemoLogin('Doctor', 'dr.jenkins@femsphere.health'),
                          ),
                          ActionChip(
                            avatar: const Icon(Icons.shield, size: 16, color: Color(0xFF6366F1)),
                            label: const Text('Administrator'),
                            onPressed: () => _handleQuickDemoLogin('Administrator', 'admin@femsphere.health'),
                          ),
                        ],
                      )
                    ],
                  ),
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
                    child: Text(
                      auth.errorMessage!,
                      style: TextStyle(color: Colors.red.shade700, fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],

                TextField(
                  controller: _emailController,
                  decoration: InputDecoration(
                    labelText: 'Email Address or Username',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                    prefixIcon: const Icon(Icons.email),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                    prefixIcon: const Icon(Icons.lock),
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: auth.isLoading ? null : _handleLogin,
                    child: auth.isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : Text('Log In as $_selectedRole'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
