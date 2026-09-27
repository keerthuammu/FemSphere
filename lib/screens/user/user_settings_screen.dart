import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_screen.dart';

class UserSettingsScreen extends StatefulWidget {
  const UserSettingsScreen({super.key});

  @override
  State<UserSettingsScreen> createState() => _UserSettingsScreenState();
}

class _UserSettingsScreenState extends State<UserSettingsScreen> {
  bool _biometricAuth = true;
  bool _pushNotifications = true;
  bool _periodAlerts = true;
  bool _medicationReminders = true;
  bool _hipaaConsent = true;
  bool _aiTwinTrainingOptIn = true;
  bool _darkMode = false;

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('⚙️ Settings & Privacy'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Security & Authentication
            _buildSection(
              title: '🔒 Security & Access',
              children: [
                SwitchListTile(
                  title: const Text('Biometric Login (FaceID / Fingerprint)'),
                  subtitle: const Text('Fast secure unlock on mobile devices', style: TextStyle(fontSize: 12)),
                  value: _biometricAuth,
                  activeColor: AppTheme.primaryPurple,
                  onChanged: (val) => setState(() => _biometricAuth = val),
                ),
                ListTile(
                  title: const Text('Change Password'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Password reset link sent to your verified email.')),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Notifications
            _buildSection(
              title: '🔔 Notification Preferences',
              children: [
                SwitchListTile(
                  title: const Text('Push Notifications'),
                  value: _pushNotifications,
                  activeColor: AppTheme.primaryPurple,
                  onChanged: (val) => setState(() => _pushNotifications = val),
                ),
                SwitchListTile(
                  title: const Text('Menstrual & Fertile Window Alerts'),
                  value: _periodAlerts,
                  activeColor: const Color(0xFFF43F5E),
                  onChanged: (val) => setState(() => _periodAlerts = val),
                ),
                SwitchListTile(
                  title: const Text('Medication & Supplement Alarms'),
                  value: _medicationReminders,
                  activeColor: AppTheme.secondaryTeal,
                  onChanged: (val) => setState(() => _medicationReminders = val),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Privacy & HIPAA Consent
            _buildSection(
              title: '🛡️ Privacy & Compliance Consents',
              children: [
                SwitchListTile(
                  title: const Text('HIPAA E2E Encryption Consent'),
                  subtitle: const Text('Medical data encrypted at rest and in transit', style: TextStyle(fontSize: 12)),
                  value: _hipaaConsent,
                  activeColor: AppTheme.secondaryTeal,
                  onChanged: (val) => setState(() => _hipaaConsent = val),
                ),
                SwitchListTile(
                  title: const Text('AI Health Twin Model Learning'),
                  subtitle: const Text('Anonymous telemetry to sharpen cycle predictions', style: TextStyle(fontSize: 12)),
                  value: _aiTwinTrainingOptIn,
                  activeColor: AppTheme.primaryPurple,
                  onChanged: (val) => setState(() => _aiTwinTrainingOptIn = val),
                ),
                ListTile(
                  title: const Text('Download All Personal Data (JSON Archive)'),
                  trailing: const Icon(Icons.download),
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Preparing encrypted JSON backup package...')),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 20),

            // App Appearance
            _buildSection(
              title: '🎨 Appearance & Localization',
              children: [
                SwitchListTile(
                  title: const Text('Dark Mode (OLED Preview)'),
                  value: _darkMode,
                  activeColor: AppTheme.primaryPurple,
                  onChanged: (val) => setState(() => _darkMode = val),
                ),
                const ListTile(
                  title: Text('Language'),
                  trailing: Text('English (US) 🇺🇸', style: TextStyle(color: AppTheme.textMuted, fontSize: 13)),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Logout & Delete
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.logout),
                label: const Text('Log Out of FemSphere', style: TextStyle(fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red.shade50,
                  foregroundColor: Colors.red.shade700,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: () {
                  auth.logout();
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                    (route) => false,
                  );
                },
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSection({required String title, required List<Widget> children}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
          ),
          ...children,
        ],
      ),
    );
  }
}
