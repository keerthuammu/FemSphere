import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/app_theme.dart';
import 'auth/login_screen.dart';
import 'auth/register_screen.dart';
import 'dashboards/user_dashboard_screen.dart';
import 'dashboards/caregiver_dashboard_screen.dart';
import 'dashboards/doctor_dashboard_screen.dart';
import 'dashboards/admin_dashboard_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ScrollController _scrollController = ScrollController();

  final GlobalKey _whyKey = GlobalKey();
  final GlobalKey _featuresKey = GlobalKey();
  final GlobalKey _timelineKey = GlobalKey();
  final GlobalKey _workspacesKey = GlobalKey();

  final List<Map<String, dynamic>> _lifeStages = const [
    {
      'code': 'EARLY_CHILDHOOD',
      'name': 'Early Childhood',
      'age': '0–5 Yrs',
      'icon': '👶',
      'color': Color(0xFFF472B6),
      'focus': 'Growth milestones, pediatric vaccinations, dietary foundations',
    },
    {
      'code': 'PRE_PUBERTY',
      'name': 'Pre-Puberty',
      'age': '6–10 Yrs',
      'icon': '👧',
      'color': Color(0xFFFB923C),
      'focus': 'Immune maturity, postural tracking, nutritional counseling',
    },
    {
      'code': 'PUBERTY',
      'name': 'Puberty',
      'age': '11–13 Yrs',
      'icon': '🌱',
      'color': Color(0xFFA855F7),
      'focus': 'Menarche preparation, hormonal education, growth spurt monitoring',
    },
    {
      'code': 'MENSTRUATING_ADOLESCENT',
      'name': 'Adolescent',
      'age': '14–17 Yrs',
      'icon': '🩸',
      'color': Color(0xFFEC4899),
      'focus': 'Cycle regularity, dysmenorrhea management, skin & mental wellness',
    },
    {
      'code': 'YOUNG_ADULT',
      'name': 'Young Adult',
      'age': '18–24 Yrs',
      'icon': '✨',
      'color': Color(0xFF8B5CF6),
      'focus': 'Reproductive literacy, lifestyle optimization, stress resilience',
    },
    {
      'code': 'REPRODUCTIVE_AGE',
      'name': 'Reproductive Age',
      'age': '25–39 Yrs',
      'icon': '🌸',
      'color': Color(0xFF7C3AED),
      'focus': 'Fertility window tracking, preconception screening, career balance',
    },
    {
      'code': 'PREGNANCY',
      'name': 'Pregnancy',
      'age': '40 Weeks',
      'icon': '🤰',
      'color': Color(0xFF10B981),
      'focus': 'Trimester vitals, fetal growth twin, gestational risk prevention',
    },
    {
      'code': 'POSTPARTUM',
      'name': 'Postpartum',
      'age': '4th Trimester',
      'icon': '🤱',
      'color': Color(0xFF14B8A6),
      'focus': 'Pelvic recovery, lactation telemetry, postnatal depression alerts',
    },
    {
      'code': 'PERIMENOPAUSE',
      'name': 'Perimenopause',
      'age': '40–48 Yrs',
      'icon': '🌿',
      'color': Color(0xFFF59E0B),
      'focus': 'Hormone fluctuation alerts, bone density, vasomotor relief',
    },
    {
      'code': 'MENOPAUSE',
      'name': 'Menopause',
      'age': '49–59 Yrs',
      'icon': '🌙',
      'color': Color(0xFF6366F1),
      'focus': 'Cardiovascular health, estrogen deficit mitigation, sleep restore',
    },
    {
      'code': 'OLDER_ADULT',
      'name': 'Older Adult',
      'age': '60+ Yrs',
      'icon': '👵',
      'color': Color(0xFF3B82F6),
      'focus': 'Cognitive vitality, longevity twin, polypharmacy stewardship',
    },
  ];

  void _scrollToKey(GlobalKey key) {
    final context = key.currentContext;
    if (context != null) {
      Scrollable.ensureVisible(
        context,
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeInOutCubic,
      );
    }
  }

  void _showLifeStageDetails(Map<String, dynamic> stage) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: (stage['color'] as Color).withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Text(stage['icon'], style: const TextStyle(fontSize: 28)),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        stage['name'],
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textDark,
                        ),
                      ),
                      Text(
                        'Target Span: ${stage['age']}',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: stage['color'] as Color,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            Text(
              'Digital Twin Clinical Focus',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.5,
                color: AppTheme.textMuted,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              stage['focus'] as String,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 14,
                color: AppTheme.textDark,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterScreen()));
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryPurple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                child: Text(
                  'Initialize Twin for ${stage['name']}',
                  style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  void _showSosDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Icon(Icons.emergency, color: Color(0xFFF43F5E), size: 28),
            SizedBox(width: 10),
            Text('Emergency SOS', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF881337))),
          ],
        ),
        content: const Text(
          'FemSphere Emergency SOS instantly notifies your pre-configured emergency contacts, trusted caregivers, and nearest maternal triage units with real-time GPS telemetry.',
          style: TextStyle(fontSize: 14, height: 1.5),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('🚨 Emergency alert protocol simulation triggered!'),
                  backgroundColor: Color(0xFFE11D48),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF43F5E),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Text('Confirm SOS Alert'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: _buildTopNavbar(context),
      body: SingleChildScrollView(
        controller: _scrollController,
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. HERO SECTION (Mirroring web's Hero.tsx)
            _buildHero(context),

            // 2. STATS BAR (Mirroring web's Stats.tsx)
            _buildStatsBar(),

            const SizedBox(height: 36),

            // 3. WHY FEMSPHERE / SERVICES (Mirroring web's Services.tsx)
            Container(key: _whyKey, child: _buildWhyFemSphere()),

            const SizedBox(height: 36),

            // 4. COMPREHENSIVE CARE / FEATURES (Mirroring web's Features.tsx)
            Container(key: _featuresKey, child: _buildComprehensiveFeatures()),

            const SizedBox(height: 36),

            // 5. WEARABLE SYNC / PROJECTS (Mirroring web's Projects.tsx)
            _buildWearablesSync(),

            const SizedBox(height: 36),

            // 6. LIFE-STAGE JOURNEY / PROCESS (Mirroring web's Process.tsx)
            Container(key: _timelineKey, child: _buildLifeStageJourney()),

            const SizedBox(height: 36),

            // 7. 11 ADAPTIVE LIFE STAGES (Mobile Interactive Hub)
            _buildAdaptiveLifeStages(),

            const SizedBox(height: 36),

            // 8. 4 SPECIALIZED HEALTH WORKSPACES (Mobile Interactive Hub)
            Container(key: _workspacesKey, child: _buildSpecializedWorkspaces(context)),

            const SizedBox(height: 36),

            // 9. EMERGENCY SOS ACCESS
            _buildEmergencySosBanner(),

            const SizedBox(height: 48),

            // 10. FOOTER & CONVERSION CTA (Mirroring web's Footer.tsx)
            _buildFooter(context),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // 1. APP BAR / NAVBAR
  // ==========================================
  PreferredSizeWidget _buildTopNavbar(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white.withValues(alpha: 0.95),
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      titleSpacing: 16,
      title: Row(
        children: [
          Text(
            'FemSphere',
            style: GoogleFonts.playfairDisplay(
              color: AppTheme.primaryPurple,
              fontWeight: FontWeight.bold,
              fontSize: 24,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(width: 6),
          const Icon(Icons.auto_awesome, color: AppTheme.secondaryTeal, size: 18),
        ],
      ),
      actions: [
        // Section Jump Menu
        PopupMenuButton<String>(
          icon: const Icon(Icons.menu_rounded, color: AppTheme.textDark),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          onSelected: (value) {
            if (value == 'why') _scrollToKey(_whyKey);
            if (value == 'features') _scrollToKey(_featuresKey);
            if (value == 'timeline') _scrollToKey(_timelineKey);
            if (value == 'workspaces') _scrollToKey(_workspacesKey);
          },
          itemBuilder: (ctx) => const [
            PopupMenuItem(
              value: 'why',
              child: Row(
                children: [
                  Icon(Icons.psychology_outlined, size: 18, color: AppTheme.primaryPurple),
                  SizedBox(width: 8),
                  Text('Why FemSphere'),
                ],
              ),
            ),
            PopupMenuItem(
              value: 'features',
              child: Row(
                children: [
                  Icon(Icons.spa_outlined, size: 18, color: AppTheme.accentPink),
                  SizedBox(width: 8),
                  Text('Features'),
                ],
              ),
            ),
            PopupMenuItem(
              value: 'timeline',
              child: Row(
                children: [
                  Icon(Icons.timeline_rounded, size: 18, color: AppTheme.secondaryTeal),
                  SizedBox(width: 8),
                  Text('Journey'),
                ],
              ),
            ),
            PopupMenuItem(
              value: 'workspaces',
              child: Row(
                children: [
                  Icon(Icons.dashboard_customize_outlined, size: 18, color: AppTheme.accentIndigo),
                  SizedBox(width: 8),
                  Text('Workspaces'),
                ],
              ),
            ),
          ],
        ),
        TextButton(
          onPressed: () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
          },
          child: Text(
            'Log in',
            style: GoogleFonts.plusJakartaSans(
              color: AppTheme.textDark,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(right: 14, left: 4),
          child: ElevatedButton(
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterScreen()));
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryPurple,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            ),
            child: Text(
              'Get Started',
              style: GoogleFonts.plusJakartaSans(
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ==========================================
  // 2. HERO SECTION
  // ==========================================
  Widget _buildHero(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color(0xFFEDE9FE),
            Color(0xFFFDF4FF),
            AppTheme.backgroundLight,
          ],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          stops: [0.0, 0.45, 1.0],
        ),
      ),
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Tag Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
            decoration: BoxDecoration(
              color: AppTheme.accentPinkLight,
              borderRadius: BorderRadius.circular(30),
              border: Border.all(color: const Color(0xFFFBCFE8)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.auto_awesome, size: 14, color: AppTheme.primaryPurple),
                const SizedBox(width: 6),
                Text(
                  'PERSONALIZED HEALTH INTELLIGENCE',
                  style: GoogleFonts.plusJakartaSans(
                    color: AppTheme.primaryPurple,
                    fontWeight: FontWeight.w800,
                    fontSize: 10,
                    letterSpacing: 0.8,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Editorial Serif Headline
          RichText(
            text: TextSpan(
              style: GoogleFonts.playfairDisplay(
                fontSize: 38,
                fontWeight: FontWeight.w700,
                color: AppTheme.textDark,
                height: 1.15,
                letterSpacing: -0.5,
              ),
              children: const [
                TextSpan(text: 'Your Lifetime\n'),
                TextSpan(
                  text: 'AI Health\n',
                  style: TextStyle(color: AppTheme.primaryPurple),
                ),
                TextSpan(text: 'Companion'),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Subtitle
          Text(
            'From birth to healthy aging. Create your Digital Health Twin and receive personalized AI-powered health insights, disease risk prediction, and preventive healthcare guidance.',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 14,
              color: const Color(0xFF64595E),
              height: 1.6,
              fontWeight: FontWeight.w400,
            ),
          ),

          const SizedBox(height: 24),

          // Dual Action Buttons
          Row(
            children: [
              Expanded(
                flex: 6,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterScreen()));
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryPurple,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    elevation: 4,
                    shadowColor: AppTheme.primaryPurple.withValues(alpha: 0.3),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Get Started',
                        style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(width: 6),
                      const Icon(Icons.arrow_forward_rounded, size: 16),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                flex: 5,
                child: OutlinedButton(
                  onPressed: () => _scrollToKey(_whyKey),
                  style: OutlinedButton.styleFrom(
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: AppTheme.borderPurple),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  ),
                  child: Text(
                    'Learn More',
                    style: GoogleFonts.plusJakartaSans(
                      color: AppTheme.textDark,
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 32),

          // Arch Framed Hero Visual (Matching web's arch portrait)
          Center(
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                // Arched portrait container
                Container(
                  width: double.infinity,
                  constraints: const BoxConstraints(maxWidth: 360, maxHeight: 380),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFEDE9FE), Colors.white],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(180),
                      topRight: Radius.circular(180),
                      bottomLeft: Radius.circular(36),
                      bottomRight: Radius.circular(36),
                    ),
                    border: Border.all(color: Colors.white, width: 3),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.primaryPurple.withValues(alpha: 0.12),
                        blurRadius: 28,
                        offset: const Offset(0, 14),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(177),
                      topRight: Radius.circular(177),
                      bottomLeft: Radius.circular(33),
                      bottomRight: Radius.circular(33),
                    ),
                    child: Image.asset(
                      'assets/images/healthcare_hero_1785261756891.jpeg',
                      fit: BoxFit.cover,
                      errorBuilder: (ctx, err, stack) => Container(
                        color: const Color(0xFFEDE9FE),
                        height: 340,
                        alignment: Alignment.center,
                        child: const Icon(Icons.health_and_safety, size: 80, color: AppTheme.primaryPurple),
                      ),
                    ),
                  ),
                ),

                // Floating Live Analytics Pulse Badge
                Positioned(
                  bottom: -14,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.95),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.borderPurple),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.08),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: AppTheme.secondaryTeal.withValues(alpha: 0.15),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.insights_rounded, color: AppTheme.secondaryTeal, size: 18),
                        ),
                        const SizedBox(width: 10),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'LIVE ANALYTICS',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 9,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 0.8,
                                color: AppTheme.textMuted,
                              ),
                            ),
                            Row(
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: const BoxDecoration(
                                    color: AppTheme.secondaryTeal,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'Twin Synced',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.textDark,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),
        ],
      ),
    );
  }

  // ==========================================
  // 3. STATS BAR
  // ==========================================
  Widget _buildStatsBar() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.symmetric(vertical: 22, horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: AppTheme.borderPurple),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryPurple.withValues(alpha: 0.07),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _buildSingleStat(
                  icon: Icons.monitor_heart_outlined,
                  iconColor: AppTheme.secondaryTeal,
                  value: '89',
                  suffix: '/100',
                  label: 'Avg Health Score',
                ),
              ),
              Container(width: 1, height: 50, color: AppTheme.borderPurple),
              Expanded(
                child: _buildSingleStat(
                  icon: Icons.storage_rounded,
                  iconColor: AppTheme.primaryPurple,
                  value: '10M+',
                  suffix: '',
                  label: 'Records Stored',
                ),
              ),
            ],
          ),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 14),
            child: Divider(color: AppTheme.borderPurple, height: 1),
          ),
          Row(
            children: [
              Expanded(
                child: _buildSingleStat(
                  icon: Icons.psychology_rounded,
                  iconColor: AppTheme.accentPink,
                  value: '5M+',
                  suffix: '',
                  label: 'Predictions Made',
                ),
              ),
              Container(width: 1, height: 50, color: AppTheme.borderPurple),
              Expanded(
                child: _buildSingleStat(
                  icon: Icons.track_changes_rounded,
                  iconColor: AppTheme.secondaryTeal,
                  value: '2M+',
                  suffix: '',
                  label: 'Goals Completed',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSingleStat({
    required IconData icon,
    required Color iconColor,
    required String value,
    required String suffix,
    required String label,
  }) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Icon(icon, size: 20, color: iconColor),
            const SizedBox(width: 6),
            Text(
              value,
              style: GoogleFonts.playfairDisplay(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: AppTheme.textDark,
              ),
            ),
            if (suffix.isNotEmpty)
              Text(
                suffix,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textMuted,
                ),
              ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          label.toUpperCase(),
          textAlign: TextAlign.center,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 9,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.8,
            color: AppTheme.textMuted,
          ),
        ),
      ],
    );
  }

  // ==========================================
  // 4. WHY FEMSPHERE / SERVICES
  // ==========================================
  Widget _buildWhyFemSphere() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'WHY FEMSPHERE',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.2,
              color: AppTheme.primaryPurple,
            ),
          ),
          const SizedBox(height: 6),
          RichText(
            text: TextSpan(
              style: GoogleFonts.playfairDisplay(
                fontSize: 30,
                color: AppTheme.textDark,
                fontWeight: FontWeight.bold,
                height: 1.2,
              ),
              children: [
                const TextSpan(text: 'Intelligent Health\n'),
                TextSpan(
                  text: 'designed for you.',
                  style: GoogleFonts.playfairDisplay(
                    fontStyle: FontStyle.italic,
                    color: AppTheme.primaryPurple,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Container(width: 48, height: 2, color: AppTheme.borderPurple),
          const SizedBox(height: 12),
          Text(
            'We combine advanced AI with your unique biology to create a dynamic Digital Health Twin that evolves with you through every life stage.',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              color: const Color(0xFF64595E),
              height: 1.6,
            ),
          ),
          const SizedBox(height: 24),

          // 4 Pillars
          _buildServiceCard(
            title: 'AI Digital Health Twin',
            desc: 'A personalized virtual model of your health, updating in real-time.',
            icon: Icons.biotech_rounded,
            iconBg: const Color(0xFFF5F3FF),
            iconColor: AppTheme.primaryPurple,
          ),
          const SizedBox(height: 12),
          _buildServiceCard(
            title: 'Preventive Healthcare',
            desc: 'Proactive insights that help you stay ahead of potential health issues.',
            icon: Icons.health_and_safety_rounded,
            iconBg: const Color(0xFFCCFBF1),
            iconColor: AppTheme.secondaryTeal,
          ),
          const SizedBox(height: 12),
          _buildServiceCard(
            title: 'Explainable AI',
            desc: "Transparent recommendations so you always understand the 'why'.",
            icon: Icons.analytics_outlined,
            iconBg: const Color(0xFFFCE7F3),
            iconColor: AppTheme.accentPink,
          ),
          const SizedBox(height: 12),
          _buildServiceCard(
            title: 'Privacy-First Architecture',
            desc: 'Your data is encrypted, secure, and strictly controlled by you.',
            icon: Icons.shield_outlined,
            iconBg: const Color(0xFFEDE9FE),
            iconColor: AppTheme.primaryPurple,
          ),
        ],
      ),
    );
  }

  Widget _buildServiceCard({
    required String title,
    required String desc,
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppTheme.borderPurple),
        boxShadow: [
          BoxShadow(
            color: iconColor.withValues(alpha: 0.04),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                    color: AppTheme.textDark,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  desc,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    color: AppTheme.textMuted,
                    height: 1.45,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // 5. COMPREHENSIVE CARE / FEATURES
  // ==========================================
  Widget _buildComprehensiveFeatures() {
    final features = [
      {'title': 'Pregnancy Care', 'icon': Icons.pregnant_woman_rounded, 'bg': const Color(0xFFFCE7F3), 'color': AppTheme.accentPink},
      {'title': 'Menstrual Tracking', 'icon': Icons.water_drop_rounded, 'bg': const Color(0xFFFEE2E2), 'color': AppTheme.accentRed},
      {'title': 'Fitness Monitoring', 'icon': Icons.directions_run_rounded, 'bg': const Color(0xFFCCFBF1), 'color': AppTheme.secondaryTeal},
      {'title': 'Nutrition Intelligence', 'icon': Icons.eco_rounded, 'bg': const Color(0xFFECFCCB), 'color': AppTheme.accentGreen},
      {'title': 'Sleep Analysis', 'icon': Icons.bedtime_rounded, 'bg': const Color(0xFFE0E7FF), 'color': AppTheme.accentIndigo},
      {'title': 'Mental Wellness', 'icon': Icons.sentiment_satisfied_alt_rounded, 'bg': const Color(0xFFFEF3C7), 'color': AppTheme.accentAmber},
      {'title': 'Disease Risk Prediction', 'icon': Icons.warning_amber_rounded, 'bg': const Color(0xFFF5F3FF), 'color': AppTheme.primaryPurple},
    ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: AppTheme.borderPurple),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryPurple.withValues(alpha: 0.04),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            'COMPREHENSIVE CARE',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.2,
              color: AppTheme.primaryPurple,
            ),
          ),
          const SizedBox(height: 8),
          RichText(
            textAlign: TextAlign.center,
            text: TextSpan(
              style: GoogleFonts.playfairDisplay(
                fontSize: 26,
                fontWeight: FontWeight.bold,
                color: AppTheme.textDark,
                height: 1.2,
              ),
              children: [
                const TextSpan(text: 'Everything you need for\n'),
                TextSpan(
                  text: 'complete wellness.',
                  style: GoogleFonts.playfairDisplay(
                    fontStyle: FontStyle.italic,
                    color: AppTheme.primaryPurple,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Wrap(
            spacing: 8,
            runSpacing: 10,
            alignment: WrapAlignment.center,
            children: features.map((f) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(color: AppTheme.borderPurple),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.02),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: f['bg'] as Color,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(f['icon'] as IconData, size: 16, color: f['color'] as Color),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      f['title'] as String,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.textDark,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // 6. WEARABLES SYNC / PROJECTS
  // ==========================================
  Widget _buildWearablesSync() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFF5F3FF), Colors.white],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: AppTheme.borderPurple),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryPurple.withValues(alpha: 0.06),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(22, 24, 22, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'SEAMLESS SYNC',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.2,
                    color: AppTheme.primaryPurple,
                  ),
                ),
                const SizedBox(height: 6),
                RichText(
                  text: TextSpan(
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textDark,
                      height: 1.2,
                    ),
                    children: [
                      const TextSpan(text: 'Connect your\n'),
                      TextSpan(
                        text: 'wearables.',
                        style: GoogleFonts.playfairDisplay(
                          fontStyle: FontStyle.italic,
                          color: AppTheme.primaryPurple,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  'FemSphere integrates flawlessly with your favorite devices to continuously update your Digital Health Twin without manual entry.',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    color: const Color(0xFF64595E),
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _buildWearableBadge(Icons.watch_rounded, 'Apple Watch', AppTheme.primaryPurple),
                    _buildWearableBadge(Icons.phone_android_rounded, 'Google Fit', AppTheme.secondaryTeal),
                    _buildWearableBadge(Icons.fitness_center_rounded, 'Fitbit', AppTheme.accentPink),
                  ],
                ),
              ],
            ),
          ),
          ClipRRect(
            borderRadius: const BorderRadius.vertical(bottom: Radius.circular(32)),
            child: Image.asset(
              'assets/images/wearable_integration_1785261789910.jpg',
              width: double.infinity,
              height: 180,
              fit: BoxFit.cover,
              errorBuilder: (ctx, err, stack) => Container(
                height: 140,
                color: const Color(0xFFEDE9FE),
                alignment: Alignment.center,
                child: const Icon(Icons.watch, size: 48, color: AppTheme.primaryPurple),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWearableBadge(IconData icon, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 6),
          Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: AppTheme.textDark,
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // 7. LIFE-STAGE JOURNEY / PROCESS
  // ==========================================
  Widget _buildLifeStageJourney() {
    final steps = [
      {'num': '01', 'title': 'Childhood', 'desc': 'Establishing baselines & healthy habits early on.'},
      {'num': '02', 'title': 'Adolescence', 'desc': 'Navigating hormonal changes & menstrual health.'},
      {'num': '03', 'title': 'Reproductive', 'desc': 'Fertility tracking and proactive wellness.'},
      {'num': '04', 'title': 'Pregnancy', 'desc': 'Comprehensive monitoring for mother and child.'},
      {'num': '05', 'title': 'Menopause', 'desc': 'Managing symptoms and lifestyle adaptations.'},
      {'num': '06', 'title': 'Healthy Aging', 'desc': 'Long-term cognitive & physical vitality support.'},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'YOUR TIMELINE',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.2,
              color: AppTheme.secondaryTeal,
            ),
          ),
          const SizedBox(height: 6),
          RichText(
            text: TextSpan(
              style: GoogleFonts.playfairDisplay(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: AppTheme.textDark,
                height: 1.2,
              ),
              children: [
                const TextSpan(text: 'A partner through\n'),
                TextSpan(
                  text: 'every life stage.',
                  style: GoogleFonts.playfairDisplay(
                    fontStyle: FontStyle.italic,
                    color: AppTheme.secondaryTeal,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Stepped List
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: steps.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (ctx, i) {
              final s = steps[i];
              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderPurple),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppTheme.primaryPurple, width: 2),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.primaryPurple.withValues(alpha: 0.12),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        s['num']!,
                        style: GoogleFonts.plusJakartaSans(
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primaryPurple,
                          fontSize: 14,
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            s['title']!,
                            style: GoogleFonts.plusJakartaSans(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppTheme.textDark,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            s['desc']!,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 11,
                              color: AppTheme.textMuted,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // ==========================================
  // 8. 11 ADAPTIVE LIFE STAGES
  // ==========================================
  Widget _buildAdaptiveLifeStages() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '11 Adaptive Life Stages',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textDark,
                ),
              ),
              Text(
                'Tap to explore',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryPurple,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        SizedBox(
          height: 120,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: _lifeStages.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (context, index) {
              final stage = _lifeStages[index];
              return InkWell(
                onTap: () => _showLifeStageDetails(stage),
                borderRadius: BorderRadius.circular(22),
                child: Container(
                  width: 145,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: AppTheme.borderPurple),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(stage['icon'] as String, style: const TextStyle(fontSize: 22)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: (stage['color'] as Color).withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              stage['age'] as String,
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                                color: stage['color'] as Color,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        stage['name'] as String,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textDark,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'View Care Twin →',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 9,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.primaryPurple,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // ==========================================
  // 9. 4 SPECIALIZED HEALTH WORKSPACES
  // ==========================================
  Widget _buildSpecializedWorkspaces(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'SPECIALIZED ROLES',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.2,
              color: AppTheme.primaryPurple,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            '4 Tailored Workspaces',
            style: GoogleFonts.playfairDisplay(
              fontSize: 26,
              fontWeight: FontWeight.bold,
              color: AppTheme.textDark,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Unified ecosystem connecting female patients, family caregivers, clinicians, and medical governance.',
            style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textMuted, height: 1.4),
          ),
          const SizedBox(height: 18),

          _buildInteractiveWorkspaceCard(
            title: 'Myself (Female User)',
            subtitle: 'Digital Twin score, period cycle & ovulation, fitness trainer, daily vitals vault.',
            icon: Icons.person_rounded,
            color: AppTheme.primaryPurple,
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const UserDashboardScreen()));
            },
          ),
          const SizedBox(height: 12),
          _buildInteractiveWorkspaceCard(
            title: 'Caregiver Portal',
            subtitle: 'Dependent profiles, pediatric/elderly care schedules, medication & vaccine radar.',
            icon: Icons.family_restroom_rounded,
            color: AppTheme.accentPink,
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const CaregiverDashboardScreen()));
            },
          ),
          const SizedBox(height: 12),
          _buildInteractiveWorkspaceCard(
            title: 'Doctor Portal',
            subtitle: 'Clinical telemetry, patient history review, telemedicine consultations, prescription drafts.',
            icon: Icons.medical_services_rounded,
            color: AppTheme.secondaryTeal,
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const DoctorDashboardScreen()));
            },
          ),
          const SizedBox(height: 12),
          _buildInteractiveWorkspaceCard(
            title: 'Administrator Governance',
            subtitle: 'Doctor credential verification, platform compliance, health intelligence articles CMS.',
            icon: Icons.admin_panel_settings_rounded,
            color: AppTheme.accentIndigo,
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminDashboardScreen()));
            },
          ),
        ],
      ),
    );
  }

  Widget _buildInteractiveWorkspaceCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(22),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppTheme.borderPurple),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.04),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textDark,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    subtitle,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      color: AppTheme.textMuted,
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.textMuted),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // 10. EMERGENCY SOS ACCESS
  // ==========================================
  Widget _buildEmergencySosBanner() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF1F2),
        borderRadius: BorderRadius.circular(24),
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
                  color: const Color(0xFFF43F5E).withValues(alpha: 0.25),
                  blurRadius: 8,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: const Icon(Icons.emergency_rounded, color: Color(0xFFF43F5E), size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Emergency SOS Hotline',
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: const Color(0xFF881337),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Instant triage broadcast to emergency contacts & clinics.',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    color: const Color(0xFF9F1239),
                  ),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: _showSosDialog,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF43F5E),
              foregroundColor: Colors.white,
              elevation: 2,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Text('SOS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // 11. FOOTER & CALL TO ACTION
  // ==========================================
  Widget _buildFooter(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 36, 20, 32),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppTheme.borderPurple)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          RichText(
            text: TextSpan(
              style: GoogleFonts.playfairDisplay(
                fontSize: 30,
                color: AppTheme.textDark,
                fontWeight: FontWeight.bold,
                height: 1.2,
              ),
              children: [
                const TextSpan(text: 'Ready to meet your\n'),
                TextSpan(
                  text: 'Digital Health Twin? ',
                  style: GoogleFonts.playfairDisplay(
                    fontStyle: FontStyle.italic,
                    color: AppTheme.primaryPurple,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Join thousands of women taking proactive control of their lifetime health journey today.',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              color: AppTheme.textMuted,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 22),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterScreen()));
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryPurple,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                elevation: 4,
                shadowColor: AppTheme.primaryPurple.withValues(alpha: 0.3),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Join FemSphere Now',
                    style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                  const SizedBox(width: 8),
                  const Icon(Icons.arrow_forward_rounded, size: 16),
                ],
              ),
            ),
          ),
          const SizedBox(height: 36),
          const Divider(color: AppTheme.borderPurple),
          const SizedBox(height: 20),

          // Platform Links & Info
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'PLATFORM',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1,
                        color: AppTheme.textDark,
                      ),
                    ),
                    const SizedBox(height: 8),
                    _buildFooterLink('Digital Health Twin'),
                    _buildFooterLink('Wearables Sync'),
                    _buildFooterLink('Predictive Analytics'),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'LEGAL & TRUST',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1,
                        color: AppTheme.textDark,
                      ),
                    ),
                    const SizedBox(height: 8),
                    _buildFooterLink('HIPAA Privacy'),
                    _buildFooterLink('Security Vault'),
                    _buildFooterLink('Terms of Care'),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 28),
          const Divider(color: AppTheme.borderPurple),
          const SizedBox(height: 16),

          // Copyright & Branding
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '© 2026 FEMSPHERE HEALTH INC.',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                  color: AppTheme.textMuted,
                ),
              ),
              const Row(
                children: [
                  Icon(Icons.public, size: 16, color: AppTheme.textMuted),
                  SizedBox(width: 12),
                  Icon(Icons.favorite, size: 16, color: AppTheme.accentPink),
                  SizedBox(width: 12),
                  Icon(Icons.mail_outline_rounded, size: 16, color: AppTheme.textMuted),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFooterLink(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(
        label,
        style: GoogleFonts.plusJakartaSans(
          fontSize: 12,
          color: AppTheme.textMuted,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
