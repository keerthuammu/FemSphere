import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../providers/auth_provider.dart';

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

  @override
  void initState() {
    super.initState();
    final user = Provider.of<AuthProvider>(context, listen: false).currentUser;
    final prof = user?.profile ?? {};
    _nameController = TextEditingController(text: (user?.fullName.isNotEmpty == true ? user!.fullName : user?.username) ?? '');
    _phoneController = TextEditingController(text: prof['mobileNumber']?.toString() ?? prof['phone']?.toString() ?? '');
    _dobController = TextEditingController(text: prof['dob']?.toString() ?? '');
    _bloodGroupController = TextEditingController(text: prof['bloodGroup']?.toString() ?? '');
    _heightController = TextEditingController(text: prof['heightCm'] != null ? '${prof['heightCm']} cm' : '');
    _weightController = TextEditingController(text: prof['weightKg'] != null ? '${prof['weightKg']} kg' : '');
    _emergencyNameController = TextEditingController(text: prof['emergencyContactName']?.toString() ?? '');
    _emergencyPhoneController = TextEditingController(text: prof['emergencyContactPhone']?.toString() ?? '');
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

  void _saveProfile() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✨ Profile & Medical Identity updated successfully!'),
        backgroundColor: AppTheme.secondaryTeal,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('👤 Profile & Medical Twin'),
        actions: [
          IconButton(
            icon: const Icon(Icons.check),
            onPressed: _saveProfile,
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
                          _nameController.text,
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                        ),
                        const SizedBox(height: 2),
                        const Text('Reproductive Age (25–39)', style: TextStyle(color: AppTheme.primaryPurple, fontSize: 12, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 4),
                        const Text('AI Health Score: 92/100 • Tier 1', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
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
                    Expanded(child: _buildTextField('Date of Birth', _dobController, Icons.cake)),
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
