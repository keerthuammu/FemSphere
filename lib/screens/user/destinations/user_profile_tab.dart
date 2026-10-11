import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../../core/app_theme.dart';
import '../../../models/user_model.dart';
import '../../../providers/auth_provider.dart';
import '../../../services/api_service.dart';
import '../../auth/login_screen.dart';
import '../partner_sync_screen.dart';

class UserProfileTab extends StatefulWidget {
  final VoidCallback? onBack;

  const UserProfileTab({super.key, this.onBack});

  @override
  State<UserProfileTab> createState() => _UserProfileTabState();
}

class _UserProfileTabState extends State<UserProfileTab> {
  bool _isLoading = true;
  bool _isSaving = false;

  // Profile data
  Map<String, dynamic> _profileData = {};
  String _lifeStageName = 'Reproductive Age (25–39)';
  int _age = 28;
  bool _menarcheStarted = true;

  // Companion / Partner settings
  bool _isPartnerConnected = true;
  final String _partnerName = 'Alex Mercer';
  final String _partnerPairCode = 'FEM-9428-SYNC';
  bool _shareCyclePhase = true;
  bool _shareFertileWindow = true;
  bool _shareMoodInsights = true;
  bool _shareEmergencyAlerts = true;

  // App Settings
  bool _pushNotifications = true;
  bool _periodAlerts = true;
  bool _biometricAuth = true;
  bool _hipaaConsent = true;

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  Future<void> _loadProfileData() async {
    setState(() => _isLoading = true);
    try {
      final results = await Future.wait([
        ApiService.getProfile().catchError((_) => <String, dynamic>{}),
        ApiService.getDynamicLifeStage().catchError((_) => <String, dynamic>{}),
      ]);

      if (!mounted) return;

      final prof = results[0] as Map<String, dynamic>;
      final stage = results[1] as Map<String, dynamic>;

      setState(() {
        _profileData = prof;
        if (stage['success'] == true && stage['currentStage'] != null) {
          final cur = stage['currentStage'] as Map<String, dynamic>;
          if (cur['name'] != null) _lifeStageName = cur['name'].toString();
          if (cur['age'] != null) _age = int.tryParse(cur['age'].toString()) ?? _age;
          if (cur['menarche_started'] != null) {
            _menarcheStarted = cur['menarche_started'] == true;
          }
        }
        _isLoading = false;
      });
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showEditProfileSheet(UserModel? user) {
    final nameCtrl = TextEditingController(text: user?.fullName ?? '');
    final phoneCtrl = TextEditingController(text: _profileData['mobileNumber']?.toString() ?? _profileData['phone']?.toString() ?? '');
    final bloodCtrl = TextEditingController(text: _profileData['bloodGroup']?.toString() ?? 'A+');
    final heightCtrl = TextEditingController(text: _profileData['heightCm']?.toString() ?? '165');
    final weightCtrl = TextEditingController(text: _profileData['weightKg']?.toString() ?? '58');
    final emergCtrl = TextEditingController(text: _profileData['emergencyContactName']?.toString() ?? 'Mom');
    final emergPhoneCtrl = TextEditingController(text: _profileData['emergencyContactPhone']?.toString() ?? '+1 (555) 234-5678');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Container(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 44,
                    height: 4,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE2E8F0),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Edit Personal Information',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF201538),
                  ),
                ),
                const SizedBox(height: 16),

                TextField(
                  controller: nameCtrl,
                  decoration: InputDecoration(
                    labelText: 'Full Name',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 12),

                TextField(
                  controller: phoneCtrl,
                  decoration: InputDecoration(
                    labelText: 'Phone Number',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 12),

                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: bloodCtrl,
                        decoration: InputDecoration(
                          labelText: 'Blood Group',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: heightCtrl,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Height (cm)',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: weightCtrl,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Weight (kg)',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                TextField(
                  controller: emergCtrl,
                  decoration: InputDecoration(
                    labelText: 'Emergency Contact Name',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 12),

                TextField(
                  controller: emergPhoneCtrl,
                  decoration: InputDecoration(
                    labelText: 'Emergency Contact Phone',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 20),

                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () async {
                      await ApiService.updateProfile({
                        'fullName': nameCtrl.text.trim(),
                        'mobileNumber': phoneCtrl.text.trim(),
                        'bloodGroup': bloodCtrl.text.trim(),
                        'heightCm': int.tryParse(heightCtrl.text),
                        'weightKg': int.tryParse(weightCtrl.text),
                        'emergencyContactName': emergCtrl.text.trim(),
                        'emergencyContactPhone': emergPhoneCtrl.text.trim(),
                      });

                      if (mounted) {
                        Navigator.pop(ctx);
                        await _loadProfileData();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Profile details updated!'),
                            backgroundColor: Color(0xFF10B981),
                          ),
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryPurple,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: Text(
                      'Save Changes',
                      style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.currentUser;

    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.primaryPurple));
    }

    final userName = user?.fullName.isNotEmpty == true ? user!.fullName : (user?.username ?? 'Alex');
    final userEmail = user?.email ?? 'alex@femsphere.health';

    return Scaffold(
      backgroundColor: const Color(0xFFFAF7FD),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header title
              Text(
                'My Profile & Settings',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: const Color(0xFF201538),
                  letterSpacing: -0.4,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Personal information, Companion mode, and account preferences.',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: const Color(0xFF7A6F75)),
              ),
              const SizedBox(height: 18),

              // USER HERO CARD
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFEDE4F7), Color(0xFFFAF7FD)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFE2D6F3)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 58,
                      height: 58,
                      decoration: BoxDecoration(
                        color: AppTheme.primaryPurple,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.primaryPurple.withValues(alpha: 0.3),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          userName.substring(0, 1).toUpperCase(),
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            userName,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFF201538),
                            ),
                          ),
                          Text(
                            userEmail,
                            style: GoogleFonts.plusJakartaSans(fontSize: 12, color: const Color(0xFF7A6F75)),
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: const Color(0xFFE2D6F3)),
                            ),
                            child: Text(
                              _lifeStageName,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.primaryPurple,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.edit_note, color: AppTheme.primaryPurple),
                      onPressed: () => _showEditProfileSheet(user),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),

              // ===============================================================
              // SECTION 1: PERSONAL INFORMATION
              // ===============================================================
              _buildSectionTitle('Personal & Health Information'),
              const SizedBox(height: 10),
              Container(
                decoration: _cardBoxDecoration(),
                child: Column(
                  children: [
                    _buildInfoTile('Age', '$_age years'),
                    _buildDivider(),
                    _buildInfoTile('Blood Group', _profileData['bloodGroup']?.toString() ?? 'A+'),
                    _buildDivider(),
                    _buildInfoTile('Height & Weight', '${_profileData['heightCm'] ?? 165} cm · ${_profileData['weightKg'] ?? 58} kg'),
                    _buildDivider(),
                    _buildInfoTile('Emergency Contact', '${_profileData['emergencyContactName'] ?? "Mom"} (${_profileData['emergencyContactPhone'] ?? "+1 555-234-5678"})'),
                  ],
                ),
              ),
              const SizedBox(height: 22),

              // ===============================================================
              // SECTION 2: COMPANION & PARTNER MODE
              // ===============================================================
              _buildSectionTitle('Companion & Caregiver Sharing'),
              const SizedBox(height: 10),
              Container(
                decoration: _cardBoxDecoration(),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 42,
                            height: 42,
                            decoration: BoxDecoration(
                              color: const Color(0xFFFCE7F3),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.favorite_rounded, color: Color(0xFFEC4899), size: 22),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Consent-Based Sharing',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: const Color(0xFF201538),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Search companions, state relationships, and control category access.',
                                  style: GoogleFonts.plusJakartaSans(fontSize: 11, color: const Color(0xFF7A6F75)),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          icon: const Icon(Icons.people_alt_rounded, size: 18),
                          label: const Text('Manage Connections & Permissions'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFEC4899),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const PartnerSyncScreen()),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 22),

              // ===============================================================
              // SECTION 3: APPLICATION SETTINGS & PREFERENCES
              // ===============================================================
              _buildSectionTitle('Application Settings'),
              const SizedBox(height: 10),
              Container(
                decoration: _cardBoxDecoration(),
                child: Column(
                  children: [
                    _buildSwitchTile(
                      title: 'Push Notifications',
                      subtitle: 'Daily medication reminders & period alerts',
                      value: _pushNotifications,
                      onChanged: (val) => setState(() => _pushNotifications = val),
                    ),
                    _buildDivider(),
                    _buildSwitchTile(
                      title: 'Biometric App Authentication',
                      subtitle: 'Require Fingerprint / Face ID on app launch',
                      value: _biometricAuth,
                      onChanged: (val) => setState(() => _biometricAuth = val),
                    ),
                    _buildDivider(),
                    _buildSwitchTile(
                      title: 'Menarche Onset Calibrated',
                      subtitle: 'Biological stage: cycle active',
                      value: _menarcheStarted,
                      onChanged: (val) async {
                        setState(() => _menarcheStarted = val);
                        await ApiService.updateProfile({'menarcheStarted': val});
                      },
                    ),
                    _buildDivider(),
                    _buildSwitchTile(
                      title: 'HIPAA & GDPR Data Consent',
                      subtitle: 'Protected reproductive health privacy mode',
                      value: _hipaaConsent,
                      onChanged: (val) => setState(() => _hipaaConsent = val),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // LOGOUT BUTTON
              SizedBox(
                width: double.infinity,
                height: 48,
                child: OutlinedButton.icon(
                  onPressed: () {
                    auth.logout();
                    if (context.mounted) {
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (_) => const LoginScreen()),
                        (route) => false,
                      );
                    }
                  },
                  icon: const Icon(Icons.logout, size: 18, color: Color(0xFFEF4444)),
                  label: Text(
                    'Log Out of FemSphere',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFFEF4444),
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFFFCA5A5)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: GoogleFonts.plusJakartaSans(
        fontSize: 15,
        fontWeight: FontWeight.w700,
        color: const Color(0xFF201538),
      ),
    );
  }

  BoxDecoration _cardBoxDecoration() {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: const Color(0xFFF1EBF9), width: 1.2),
      boxShadow: [
        BoxShadow(
          color: const Color(0xFF201538).withValues(alpha: 0.03),
          blurRadius: 10,
          offset: const Offset(0, 3),
        ),
      ],
    );
  }

  Widget _buildInfoTile(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 13, color: const Color(0xFF7A6F75))),
          Text(value, style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w700, color: const Color(0xFF201538))),
        ],
      ),
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF201538),
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.plusJakartaSans(fontSize: 11, color: const Color(0xFF7A6F75)),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            activeThumbColor: AppTheme.primaryPurple,
            activeTrackColor: AppTheme.primaryPurpleLight,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return const Divider(height: 1, color: Color(0xFFF8F5FC));
  }
}
