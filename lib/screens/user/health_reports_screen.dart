import 'package:flutter/material.dart';
import '../../core/app_theme.dart';

class HealthReportsScreen extends StatelessWidget {
  const HealthReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('🧬 AI Health Twin Analytics'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Secure health report link generated and ready to share!')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Downloading Comprehensive Health Twin PDF Report (2.4 MB)...')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Overall Bio-Twin Score Card
            Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF6366F1), Color(0xFF8B5CF6), Color(0xFFEC4899)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF8B5CF6).withValues(alpha: 0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Lifetime AI Health Score',
                            style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w600),
                          ),
                          SizedBox(height: 4),
                          Text(
                            '92 / 100',
                            style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text('✨ Tier 1: Optimal', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Your digital twin models 14 biological subsystems based on your 28-day menstrual rhythm, sleep continuity, and blood vitals.',
                    style: TextStyle(color: Colors.white, fontSize: 12),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Organ Systems Breakdown
            const Text(
              '🫀 Subsystem Risk Analysis',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
            ),
            const SizedBox(height: 12),

            _buildSubsystemCard(
              title: 'Hormonal & Reproductive Health',
              score: '95%',
              status: 'Optimal Balance',
              statusColor: AppTheme.secondaryTeal,
              description: 'Regular ovulatory cadence (28±1 days), progesterone-to-estrogen ratio normal.',
              icon: Icons.water_drop,
            ),
            _buildSubsystemCard(
              title: 'Cardiovascular & Resting HR',
              score: '91%',
              status: 'Low Risk (3%)',
              statusColor: AppTheme.secondaryTeal,
              description: 'Resting heart rate 68 bpm. Mean arterial pressure 89 mmHg. Arterial compliance optimal.',
              icon: Icons.favorite,
            ),
            _buildSubsystemCard(
              title: 'Metabolic & Glycemic Balance',
              score: '88%',
              status: 'Stable',
              statusColor: Colors.blue,
              description: 'Fasting glucose 92 mg/dL. Post-workout glycogen replenishment efficiency rated high.',
              icon: Icons.bolt,
            ),
            _buildSubsystemCard(
              title: 'Bone Density & Micronutrient Profile',
              score: '84%',
              status: 'Attention: Mild Vitamin D',
              statusColor: Colors.orange,
              description: 'Recommended daily intake of 2000 IU Vitamin D3 + K2 to sustain bone mineral density.',
              icon: Icons.accessibility_new,
            ),

            const SizedBox(height: 24),

            // Doctor Shared Access Box
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.borderPurple),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.lock_open, color: AppTheme.primaryPurple, size: 20),
                      SizedBox(width: 8),
                      Text('Clinical Access & Consent', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'This longitudinal report is currently shared with Dr. Sarah Jenkins (OB/GYN) under HIPAA End-to-End Encryption.',
                    style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: const Icon(Icons.security, size: 16),
                          label: const Text('Manage Consents'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppTheme.primaryPurple,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Opening HIPAA Privacy & Consent settings...')),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          icon: const Icon(Icons.picture_as_pdf, size: 16),
                          label: const Text('Export PDF'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryPurple,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Exporting full biometric report PDF...')),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSubsystemCard({
    required String title,
    required String score,
    required String status,
    required Color statusColor,
    required String description,
    required IconData icon,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 18,
                    backgroundColor: AppTheme.primaryPurple.withValues(alpha: 0.1),
                    child: Icon(icon, size: 18, color: AppTheme.primaryPurple),
                  ),
                  const SizedBox(width: 10),
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark)),
                ],
              ),
              Text(score, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.primaryPurple)),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(status, style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 6),
          Text(description, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
        ],
      ),
    );
  }
}
