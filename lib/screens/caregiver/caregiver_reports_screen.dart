import 'package:flutter/material.dart';
import '../../core/app_theme.dart';

class CaregiverReportsScreen extends StatelessWidget {
  final String dependentName;

  const CaregiverReportsScreen({super.key, this.dependentName = 'Sophia Rostova'});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: Text('📈 Growth & Health: $dependentName'),
        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Downloading $dependentName Growth & Pediatric Health Summary PDF...')),
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
            // Growth Overview Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFEC4899), Color(0xFF8B5CF6)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        dependentName,
                        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text('Age: 6 Years', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Growth Percentiles: Height 78th percentile (116 cm) • Weight 65th percentile (20.5 kg). BMI-for-age indicates healthy pediatric physical development.',
                    style: TextStyle(color: Colors.white, fontSize: 12),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text('🎯 Milestone Tracking', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
            const SizedBox(height: 12),

            _buildMilestoneCard(
              title: 'Fine Motor & Spatial Coordination',
              status: 'Achieved',
              date: 'Aug 2026',
              description: 'Prints letters, ties shoes, draws triangles and human figures with 6 body parts.',
            ),
            _buildMilestoneCard(
              title: 'Language & Cognitive Fluency',
              status: 'Advanced',
              date: 'Jul 2026',
              description: 'Speaks clearly in complex sentences; understands past/future tense concepts.',
            ),
            _buildMilestoneCard(
              title: 'Visual & Hearing Acuity Screening',
              status: 'Passed (20/20)',
              date: 'May 2026',
              description: 'Audiology and Snellen eye chart exam passed at Valley Pediatrics Clinic.',
            ),

            const SizedBox(height: 24),
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
                  const Text('👨‍⚕️ Pediatrician Review Notes', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark)),
                  const SizedBox(height: 8),
                  const Text(
                    'Dr. Sarah Jenkins: "Sophia continues to display excellent developmental markers. Continue balanced nutrition rich in calcium and omega-3s. MMR booster due October."',
                    style: TextStyle(fontSize: 12, color: AppTheme.textMuted, height: 1.4),
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.picture_as_pdf),
                      label: const Text('Export Pediatric Record', style: TextStyle(fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEC4899),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Generating full growth chart PDF...')),
                        );
                      },
                    ),
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

  Widget _buildMilestoneCard({
    required String title,
    required String status,
    required String date,
    required String description,
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
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryTeal.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(status, style: const TextStyle(color: AppTheme.secondaryTeal, fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(description, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
          const SizedBox(height: 6),
          Text('Verified: $date', style: const TextStyle(fontSize: 11, color: Color(0xFFEC4899), fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
