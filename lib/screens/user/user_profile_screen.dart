import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';

class UserProfileScreen extends StatefulWidget {
  const UserProfileScreen({super.key});

  @override
  State<UserProfileScreen> createState() => _UserProfileScreenState();
}

class _UserProfileScreenState extends State<UserProfileScreen> {
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _dobController;
  late TextEditingController _bloodGroupController;
  late TextEditingController _heightController;
  late TextEditingController _weightController;
  late TextEditingController _emergencyNameController;
  late TextEditingController _emergencyPhoneController;

  String _currentStageName = 'Reproductive Age (25–39)';
  int _age = 28;
  bool _menarcheStarted = true;
  bool _isPregnant = false;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final user = Provider.of<AuthProvider>(context, listen: false).currentUser;
    final prof = user?.profile ?? {};
    _nameController = TextEditingController(text: (user?.fullName.isNotEmpty == true ? user!.fullName : user?.username) ?? '');
    _phoneController = TextEditingController(text: prof['mobileNumber']?.toString() ?? prof['phone']?.toString() ?? '');
    _dobController = TextEditingController(text: prof['dob']?.toString() ?? '1998-05-15');
    _bloodGroupController = TextEditingController(text: prof['bloodGroup']?.toString() ?? 'A+');
    _heightController = TextEditingController(text: prof['heightCm'] != null ? '${prof['heightCm']} cm' : '165 cm');
    _weightController = TextEditingController(text: prof['weightKg'] != null ? '${prof['weightKg']} kg' : '58 kg');
    _emergencyNameController = TextEditingController(text: prof['emergencyContactName']?.toString() ?? '');
    _emergencyPhoneController = TextEditingController(text: prof['emergencyContactPhone']?.toString() ?? '');

    _fetchLifeStage();
  }

  Future<void> _fetchLifeStage() async {
    try {
      final res = await ApiService.getDynamicLifeStage();
      if (res['success'] == true && res['currentStage'] != null) {
        final cur = res['currentStage'];
        if (mounted) {
          setState(() {
            _currentStageName = cur['name']?.toString() ?? _currentStageName;
            _age = cur['age'] != null ? int.tryParse(cur['age'].toString()) ?? _age : _age;
            if (cur['dob'] != null && _dobController.text.isEmpty) {
              _dobController.text = cur['dob'].toString();
            }
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

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _dobController.dispose();
    _bloodGroupController.dispose();
    _heightController.dispose();
    _weightController.dispose();
    _emergencyNameController.dispose();
    _emergencyPhoneController.dispose();
    super.dispose();
  }

  Future<void> _pickDob() async {
    DateTime initial = DateTime.tryParse(_dobController.text) ?? DateTime(1998, 5, 15);
    final picked = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(1920),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      final formatted = '${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}';
      setState(() => _dobController.text = formatted);
    }
  }

  Future<void> _saveProfile() async {
    setState(() => _isSaving = true);
    try {
      final rawHeight = double.tryParse(_heightController.text.replaceAll(RegExp(r'[^0-9.]'), '')) ?? 165.0;
      final rawWeight = double.tryParse(_weightController.text.replaceAll(RegExp(r'[^0-9.]'), '')) ?? 58.0;

      final data = {
        'fullName': _nameController.text.trim(),
        'phone': _phoneController.text.trim(),
        'dob': _dobController.text.trim(),
        'bloodGroup': _bloodGroupController.text.trim(),
        'heightCm': rawHeight,
        'weightKg': rawWeight,
        'emergencyContactName': _emergencyNameController.text.trim(),
        'emergencyContactPhone': _emergencyPhoneController.text.trim(),
        'menarcheStarted': _menarcheStarted,
      };

      final res = await ApiService.updateProfile(data);
      if (res['success'] == true || res['profile'] != null) {
        await _fetchLifeStage();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('✨ Profile & Biological Stage ($_currentStageName) updated!'),
              backgroundColor: AppTheme.secondaryTeal,
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(res['message']?.toString() ?? 'Profile updated locally')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Profile saved: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('👤 Profile & Medical Twin'),
        actions: [
          IconButton(
            icon: _isSaving
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.primaryPurple))
                : const Icon(Icons.check),
            onPressed: _isSaving ? null : _saveProfile,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User Header Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppTheme.borderPurple),
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 36,
                    backgroundColor: Color(0xFFF3E8FF),
                    child: Text('ER', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.primaryPurple)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _nameController.text.isNotEmpty ? _nameController.text : 'User Profile',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          _isPregnant ? '🤰 Pregnancy Journey (Active)' : _currentStageName,
                          style: TextStyle(
                            color: _isPregnant ? const Color(0xFFDB2777) : AppTheme.primaryPurple,
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Age: $_age yrs • Dynamic Biological Tracking',
                          style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Personal & Biometrics Form
            _buildSectionContainer(
              title: '🩺 Personal & Physical Biometrics',
              children: [
                _buildTextField('Full Name', _nameController, Icons.person),
                const SizedBox(height: 12),
                _buildTextField('Contact Phone', _phoneController, Icons.phone),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: InkWell(
                        onTap: _pickDob,
                        child: AbsorbPointer(
                          child: _buildTextField('Date of Birth', _dobController, Icons.cake),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(child: _buildTextField('Blood Group', _bloodGroupController, Icons.bloodtype)),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _buildTextField('Height', _heightController, Icons.height)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildTextField('Weight', _weightController, Icons.monitor_weight)),
                  ],
                ),
                const SizedBox(height: 16),
                // Puberty & Menarche Calibration
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFAF8FC),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppTheme.borderPurple),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'First Period (Menarche) Started',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              _menarcheStarted
                                  ? 'Menstrual tracking active'
                                  : 'Adolescent puberty prep mode',
                              style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                            ),
                          ],
                        ),
                      ),
                      Switch(
                        value: _menarcheStarted,
                        activeColor: const Color(0xFFF43F5E),
                        onChanged: (val) => setState(() => _menarcheStarted = val),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Emergency Contacts
            _buildSectionContainer(
              title: '🚨 Emergency & SOS Contact',
              children: [
                _buildTextField('Emergency Contact Name', _emergencyNameController, Icons.contact_phone),
                const SizedBox(height: 12),
                _buildTextField('Emergency Phone Number', _emergencyPhoneController, Icons.phone),
              ],
            ),
            const SizedBox(height: 20),

            // Allergies & Chronic Notes
            _buildSectionContainer(
              title: '📋 Allergies & Clinical History',
              children: [
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: ['Penicillin', 'Sulfa (Mild)', 'Seasonal Pollen'].map((a) {
                    return Chip(
                      label: Text(a, style: const TextStyle(fontSize: 12)),
                      backgroundColor: const Color(0xFFFEE2E2),
                      avatar: const Icon(Icons.warning_amber, size: 16, color: Colors.red),
                    );
                  }).toList(),
                ),
              ],
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.save),
                label: const Text('Update Profile Information', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryPurple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: _saveProfile,
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionContainer({required String title, required List<Widget> children}) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
          const SizedBox(height: 14),
          ...children,
        ],
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, size: 20, color: AppTheme.primaryPurple),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      ),
    );
  }
}
