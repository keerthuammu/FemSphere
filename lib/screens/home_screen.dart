import 'package:flutter/material.dart';
import '../core/app_theme.dart';
import 'auth/login_screen.dart';
import 'auth/register_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  final List<Map<String, dynamic>> _lifeStages = const [
    {'code': 'EARLY_CHILDHOOD', 'name': 'Early Childhood (0–5)', 'icon': '👶', 'color': Color(0xFFF472B6)},
    {'code': 'PRE_PUBERTY', 'name': 'Pre-Puberty (6–10)', 'icon': '👧', 'color': Color(0xFFFB923C)},
    {'code': 'PUBERTY', 'name': 'Puberty (11–13)', 'icon': '🌱', 'color': Color(0xFFA855F7)},
    {'code': 'MENSTRUATING_ADOLESCENT', 'name': 'Adolescent (14–17)', 'icon': '🩸', 'color': Color(0xFFEC4899)},
    {'code': 'YOUNG_ADULT', 'name': 'Young Adult (18–24)', 'icon': '✨', 'color': Color(0xFF8B5CF6)},
    {'code': 'REPRODUCTIVE_AGE', 'name': 'Reproductive Age (25–39)', 'icon': '🌸', 'color': Color(0xFF7C3AED)},
    {'code': 'PREGNANCY', 'name': 'Pregnancy (40 Weeks)', 'icon': '🤰', 'color': Color(0xFF10B981)},
    {'code': 'POSTPARTUM', 'name': 'Postpartum (Fourth Trimester)', 'icon': '🤱', 'color': Color(0xFF14B8A6)},
    {'code': 'PERIMENOPAUSE', 'name': 'Perimenopause (40–48)', 'icon': '🌿', 'color': Color(0xFFF59E0B)},
    {'code': 'MENOPAUSE', 'name': 'Menopause (49–59)', 'icon': '🌙', 'color': Color(0xFF6366F1)},
    {'code': 'OLDER_ADULT', 'name': 'Older Adult (60+)', 'icon': '👵', 'color': Color(0xFF3B82F6)},
  ];

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isDesktop = size.width > 800;

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.primaryPurple.withOpacity(0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Text('🌸', style: TextStyle(fontSize: 18)),
            ),
            const SizedBox(width: 8),
            const Text(
              'FemSphere',
              style: TextStyle(
                color: AppTheme.primaryPurple,
                fontWeight: FontWeight.w900,
                fontSize: 22,
                letterSpacing: -0.5,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
            },
            child: const Text(
              'Log in',
              style: TextStyle(color: AppTheme.textDark, fontWeight: FontWeight.bold, fontSize: 14),
            ),
          ),
          const SizedBox(width: 6),
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterScreen()));
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryPurple,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: const Text('Get Started', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            
            // 1. HERO SECTION
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFEDE9FE), Color(0xFFFDF4FF), Colors.white],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: AppTheme.borderPurple),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primaryPurple.withOpacity(0.06),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  )
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Pill Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFCE7F3),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFFBCFE8)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(Icons.auto_awesome, size: 14, color: AppTheme.primaryPurple),
                        SizedBox(width: 6),
                        Text(
                          'Personalized Female Health Intelligence',
                          style: TextStyle(
                            color: AppTheme.primaryPurple,
                            fontWeight: FontWeight.bold,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

                  const Text(
                    'Your Lifetime\nAI Health Companion',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.textDark,
                      height: 1.15,
                      letterSpacing: -0.5,
                    ),
                  ),

                  const SizedBox(height: 12),

                  const Text(
                    'From early childhood to healthy aging. Create your Digital Health Twin and receive personalized AI-powered health insights, cycle tracking, and role-based care management.',
                    style: TextStyle(
                      fontSize: 13,
                      color: AppTheme.textMuted,
                      height: 1.5,
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterScreen()));
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryPurple,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            elevation: 2,
                          ),
                          child: const Text('Get Started Free', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
                          },
                          style: OutlinedButton.styleFrom(
                            backgroundColor: Colors.white,
                            side: const BorderSide(color: AppTheme.borderPurple),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          child: const Text('Access Portal', style: TextStyle(color: AppTheme.textDark, fontWeight: FontWeight.bold, fontSize: 13)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // 2. 11 LIFE-STAGES HORIZONTAL SELECTOR
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text(
                        '11 Adaptive Life Stages',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                      ),
                      Text(
                        'Continuous Care',
                        style: TextStyle(fontSize: 11, color: AppTheme.primaryPurple, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    height: 90,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: _lifeStages.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 10),
                      itemBuilder: (context, index) {
                        final stage = _lifeStages[index];
                        return Container(
                          width: 130,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: AppTheme.borderPurple),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.02),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              )
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(stage['icon'], style: const TextStyle(fontSize: 20)),
                              const SizedBox(height: 6),
                              Text(
                                stage['name'],
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textDark, height: 1.2),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // 3. 4 SPECIALIZED HEALTH WORKSPACES
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '4 Specialized Health Workspaces',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 12),

                  Column(
                    children: const [
                      _WorkspaceCard(
                        title: 'Myself (User)',
                        subtitle: 'Digital Twin score, Period & Fitness trackers, daily vitals & vault.',
                        icon: Icons.person,
                        color: AppTheme.primaryPurple,
                      ),
                      SizedBox(height: 10),
                      _WorkspaceCard(
                        title: 'Caregiver',
                        subtitle: 'Family care management, medication & vaccination tracking.',
                        icon: Icons.people,
                        color: Color(0xFFEC4899),
                      ),
                      SizedBox(height: 10),
                      _WorkspaceCard(
                        title: 'Doctor',
                        subtitle: 'Clinical patient directory, shared records & consultation notes.',
                        icon: Icons.medical_services,
                        color: AppTheme.secondaryTeal,
                      ),
                      SizedBox(height: 10),
                      _WorkspaceCard(
                        title: 'Administrator',
                        subtitle: 'System governance, doctor verification & health article CMS.',
                        icon: Icons.shield,
                        color: Color(0xFF6366F1),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // 4. EMERGENCY SOS QUICK ACCESS
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF1F2),
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: const Color(0xFFFECDD3)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFF43F5E).withOpacity(0.2),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        )
                      ],
                    ),
                    child: const Icon(Icons.emergency, color: Color(0xFFF43F5E), size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'Emergency SOS Hotline',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF881337)),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Instant broadcast to emergency contacts & maternal services.',
                          style: TextStyle(fontSize: 11, color: Color(0xFF9F1239)),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF43F5E),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    ),
                    child: const Text('SOS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  )
                ],
              ),
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class _WorkspaceCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;

  const _WorkspaceCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderPurple),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textDark,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppTheme.textMuted,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios, size: 14, color: AppTheme.textMuted),
        ],
      ),
    );
  }
}
