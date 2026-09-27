import 'package:flutter/material.dart';
import '../../core/app_theme.dart';

class DoctorProfileScreen extends StatefulWidget {
  const DoctorProfileScreen({super.key});

  @override
  State<DoctorProfileScreen> createState() => _DoctorProfileScreenState();
}

class _DoctorProfileScreenState extends State<DoctorProfileScreen> {
  final _nameController = TextEditingController(text: 'Dr. Sarah Jenkins');
  final _specialtyController = TextEditingController(text: 'Obstetrics & Gynecology (OB/GYN)');
  final _licenseController = TextEditingController(text: 'MD-892401');
  final _hospitalController = TextEditingController(text: 'Metro Women’s Hospital & Fertility Institute');
  final _bioController = TextEditingController(
    text: 'Board-certified OB/GYN with 14+ years of clinical experience specializing in reproductive endocrinology, luteal phase support, and digital twin health monitoring.',
  );

  @override
  void dispose() {
    _nameController.dispose();
    _specialtyController.dispose();
    _licenseController.dispose();
    _hospitalController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('🩺 Physician Credential Profile'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.borderPurple),
              ),
              child: Column(
                children: [
                  const CircleAvatar(
                    radius: 36,
                    backgroundColor: Color(0xFFCCFBF1),
                    child: Icon(Icons.medical_services, size: 36, color: AppTheme.secondaryTeal),
                  ),
                  const SizedBox(height: 12),
                  Text(_nameController.text, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.textDark)),
                  const SizedBox(height: 2),
                  Text(_specialtyController.text, style: const TextStyle(fontSize: 12, color: AppTheme.secondaryTeal, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFCCFBF1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.verified, size: 14, color: AppTheme.secondaryTeal),
                        SizedBox(width: 4),
                        Text('Verified Practitioner • MD-892401', style: TextStyle(color: AppTheme.secondaryTeal, fontSize: 11, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.borderPurple),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Clinical Information', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark)),
                  const SizedBox(height: 14),
                  TextField(
                    controller: _hospitalController,
                    decoration: InputDecoration(
                      labelText: 'Primary Hospital / Clinic Affiliation',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _bioController,
                    maxLines: 4,
                    decoration: InputDecoration(
                      labelText: 'Clinical Bio & Research Interests',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.save),
                label: const Text('Save Practitioner Profile', style: TextStyle(fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.secondaryTeal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Doctor Profile Saved!'), backgroundColor: AppTheme.secondaryTeal),
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
}
