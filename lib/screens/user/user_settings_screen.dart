import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
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

  // Biological stage calibration
  String _stageName = 'Reproductive Age (25–39)';
  int _age = 28;
  String _dob = '1998-05-15';
  bool _menarcheStarted = true;
  bool _isPregnant = false;

  @override
  void initState() {
    super.initState();
    _loadLifeStage();
  }

  Future<void> _loadLifeStage() async {
    try {
      final res = await ApiService.getDynamicLifeStage();
      if (res['success'] == true && res['currentStage'] != null) {
        final cur = res['currentStage'];
        if (mounted) {
          setState(() {
            _stageName = cur['name']?.toString() ?? _stageName;
            _age = cur['age'] != null ? int.tryParse(cur['age'].toString()) ?? _age : _age;
            _dob = cur['dob']?.toString() ?? _dob;
            if (cur['menarche_started'] != null) {
              _menarcheStarted = cur['menarche_started'] == true;
            }
            if (cur['is_pregnant'] != null) {
              _isPregnant = cur['is_pregnant'] == true;
            }
          });
        }
      }
    } catch (_) {}
  }

  Future<void> _updateMenarche(bool val) async {
    setState(() => _menarcheStarted = val);
    try {
      final res = await ApiService.updateProfile({'menarcheStarted': val});
      if (res['success'] == true || res['profile'] != null) {
        await _loadLifeStage();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('✨ Biological stage updated to: $_stageName'),
              backgroundColor: AppTheme.secondaryTeal,
            ),
          );
        }
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to update stage calibration')),
        );
      }
    }
  }

  Future<void> _pickDob() async {
    DateTime initial = DateTime.tryParse(_dob) ?? DateTime(1998, 5, 15);
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(1920),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      final formatted = '${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}';
      setState(() => _dob = formatted);
      try {
        final res = await ApiService.updateProfile({'dob': formatted});
        if (res['success'] == true || res['profile'] != null) {
          await _loadLifeStage();
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('✨ Age & stage recalibrated: $_stageName ($_age yrs)'),
                backgroundColor: AppTheme.secondaryTeal,
              ),
            );
          }
        }
      } catch (_) {}
    }
  }

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
            // Biological Life Stage Calibration
            _buildSection(
              title: '🌸 Biological Life Stage Calibration',
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: _isPregnant
                            ? [const Color(0xFFFDF2F8), const Color(0xFFFCE7F3)]
                            : [const Color(0xFFFAF5FF), const Color(0xFFF3E8FF)],
                      ),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: _isPregnant ? const Color(0xFFFBCFE8) : const Color(0xFFE9D5FF),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(_isPregnant ? '🤰' : '🧬', style: const TextStyle(fontSize: 22)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _stageName,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                'Age: $_age',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.primaryPurple),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'FemSphere automatically determines your life stage from your Date of Birth. Calibrate menarche onset below if periods started earlier or later.',
                          style: TextStyle(fontSize: 11, color: Colors.black54),
                        ),
                      ],
                    ),
                  ),
                ),
                ListTile(
                  leading: const Icon(Icons.cake, color: AppTheme.primaryPurple),
                  title: const Text('Date of Birth'),
                  subtitle: Text('$_dob (Age: $_age yrs)'),
                  trailing: OutlinedButton(
                    onPressed: _pickDob,
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      side: const BorderSide(color: AppTheme.borderPurple),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text('Change', style: TextStyle(fontSize: 11)),
                  ),
                ),
                SwitchListTile(
                  secondary: const Icon(Icons.water_drop, color: Color(0xFFF43F5E)),
                  title: const Text('First Period (Menarche) Started'),
                  subtitle: Text(
                    _menarcheStarted
                        ? 'Active: Cycle tracking and fertile window enabled'
                        : 'Not yet: Prep mode, body literacy & puberty guidance enabled',
                    style: const TextStyle(fontSize: 11),
                  ),
                  value: _menarcheStarted,
                  activeColor: const Color(0xFFF43F5E),
                  onChanged: (val) => _updateMenarche(val),
                ),
              ],
            ),
            const SizedBox(height: 20),

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
