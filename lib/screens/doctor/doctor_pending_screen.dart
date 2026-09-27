import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../auth/login_screen.dart';

class DoctorPendingScreen extends StatelessWidget {
  const DoctorPendingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('🩺 Verification Pending'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
            },
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const CircleAvatar(
                radius: 40,
                backgroundColor: Color(0xFFFEF3C7),
                child: Icon(Icons.hourglass_top, color: Colors.amber, size: 40),
              ),
              const SizedBox(height: 20),
              const Text(
                'Physician Verification in Progress',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 10),
              const Text(
                'Your medical license (MD credentials) and clinical registrations are currently under review by our Medical Board Administrators. You will receive an email and push notification once your license is verified.',
                style: TextStyle(fontSize: 13, color: AppTheme.textMuted, height: 1.5),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                icon: const Icon(Icons.refresh),
                label: const Text('Check Approval Status'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.secondaryTeal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Checking medical board registry... status: Under Review.')),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
