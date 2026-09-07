import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../models/exercise_model.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_screen.dart';
import '../fitness/workout_player_screen.dart';

class UserDashboardScreen extends StatefulWidget {
  const UserDashboardScreen({super.key});

  @override
  State<UserDashboardScreen> createState() => _UserDashboardScreenState();
}

class _UserDashboardScreenState extends State<UserDashboardScreen> {
  int _selectedNavIndex = 0; // 0: Overview, 1: Period Tracker, 2: Fitness, 3: Vault
  final int _healthScore = 92;
  String _currentStageCode = 'REPRODUCTIVE_AGE';
  String _currentStageName = 'Reproductive Age (25–39)';

  // Period Tracker State
  final int _cycleDay = 4;
  final int _totalCycleDays = 28;
  final String _cyclePhase = 'Menstrual Phase 🩸';
  final String _nextPeriodDate = 'Sep 18, 2026';
  final String _fertileWindow = 'Sep 01 – Sep 06';
  String _selectedFlow = 'Medium';

  // Fitness & Healthify State
  final int _calorieBudget = 2000;
  final int _foodCalories = 1340;
  int _burnedCalories = 420;
  int _waterCups = 9; // 250ml per cup
  final int _dailySteps = 8420;

  static const Color _roseColor = Color(0xFFF43F5E);
  static const Color _emeraldColor = Color(0xFF10B981);
  static const Color _emeraldDark = Color(0xFF065F46);

  final List<Map<String, dynamic>> _lifeStages = const [
    {'code': 'EARLY_CHILDHOOD', 'name': 'Early Childhood', 'icon': '👶'},
    {'code': 'PRE_PUBERTY', 'name': 'Pre-Puberty', 'icon': '👧'},
    {'code': 'PUBERTY', 'name': 'Puberty', 'icon': '🌱'},
    {'code': 'MENSTRUATING_ADOLESCENT', 'name': 'Adolescent', 'icon': '🩸'},
    {'code': 'YOUNG_ADULT', 'name': 'Young Adult', 'icon': '✨'},
    {'code': 'REPRODUCTIVE_AGE', 'name': 'Reproductive Age', 'icon': '🌸'},
    {'code': 'PREGNANCY', 'name': 'Pregnancy', 'icon': '🤰'},
    {'code': 'POSTPARTUM', 'name': 'Postpartum', 'icon': '🤱'},
    {'code': 'PERIMENOPAUSE', 'name': 'Perimenopause', 'icon': '🌿'},
    {'code': 'MENOPAUSE', 'name': 'Menopause', 'icon': '🌙'},
    {'code': 'OLDER_ADULT', 'name': 'Older Adult', 'icon': '👵'},
  ];

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.currentUser;
    final remainingCalories = _calorieBudget - _foodCalories + _burnedCalories;

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: Row(
          children: [
            const Text('🌸', style: TextStyle(fontSize: 18)),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  user?.fullName ?? 'Elena Rostova',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textDark,
                  ),
                ),
                Text(
                  _currentStageName,
                  style: const TextStyle(
                    fontSize: 10,
                    color: AppTheme.primaryPurple,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined, color: AppTheme.textDark),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: AppTheme.textMuted),
            onPressed: () {
              auth.logout();
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
            },
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedNavIndex,
        onDestinationSelected: (index) {
          setState(() {
            _selectedNavIndex = index;
          });
        },
        backgroundColor: Colors.white,
        indicatorColor: AppTheme.primaryPurple.withOpacity(0.15),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard, color: AppTheme.primaryPurple),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.water_drop_outlined),
            selectedIcon: Icon(Icons.water_drop, color: _roseColor),
            label: 'Period',
          ),
          NavigationDestination(
            icon: Icon(Icons.fitness_center_outlined),
            selectedIcon: Icon(Icons.fitness_center, color: _emeraldColor),
            label: 'Fitness',
          ),
          NavigationDestination(
            icon: Icon(Icons.folder_outlined),
            selectedIcon: Icon(Icons.folder, color: AppTheme.secondaryTeal),
            label: 'Vault',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            
            // 1. LIFE STAGE SELECTOR STRIP
            SizedBox(
              height: 42,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _lifeStages.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final stage = _lifeStages[index];
                  final isSelected = stage['code'] == _currentStageCode;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _currentStageCode = stage['code'];
                        _currentStageName = stage['name'];
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? AppTheme.primaryPurple : Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isSelected ? AppTheme.primaryPurple : AppTheme.borderPurple,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(stage['icon'], style: const TextStyle(fontSize: 14)),
                          const SizedBox(width: 6),
                          Text(
                            stage['name'],
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: isSelected ? Colors.white : AppTheme.textDark,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 16),

            // 2. TAB CONTENT
            if (_selectedNavIndex == 0) _buildOverviewTab(remainingCalories),
            if (_selectedNavIndex == 1) _buildPeriodTrackerTab(),
            if (_selectedNavIndex == 2) _buildFitnessTab(remainingCalories),
            if (_selectedNavIndex == 3) _buildVaultTab(),
          ],
        ),
      ),
    );
  }

  // TAB 1: OVERVIEW & DIGITAL TWIN
  Widget _buildOverviewTab(int remainingCalories) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Digital Health Twin Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF7C3AED), Color(0xFF6D28D9)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: AppTheme.primaryPurple.withOpacity(0.3),
                blurRadius: 15,
                offset: const Offset(0, 6),
              )
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.auto_awesome, color: Colors.amberAccent, size: 14),
                        SizedBox(width: 4),
                        Text('AI Digital Twin Active', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      '$_healthScore/100',
                      style: const TextStyle(color: AppTheme.primaryPurple, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              const Text(
                'Digital Twin Health Score: 92%',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
              ),
              const SizedBox(height: 4),
              const Text(
                'Your hormonal and metabolic parameters are well synchronized across your current reproductive cycle.',
                style: TextStyle(color: Colors.white70, fontSize: 12, height: 1.4),
              ),
            ],
          ),
        ),

        const SizedBox(height: 18),

        // Quick Overview Tiles
        Row(
          children: [
            Expanded(
              child: _buildQuickTile(
                title: 'Period Status',
                value: 'Day 4 of 28',
                subtitle: 'Menstrual Phase',
                icon: Icons.water_drop,
                color: _roseColor,
                onTap: () => setState(() => _selectedNavIndex = 1),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildQuickTile(
                title: 'Energy Balance',
                value: '$remainingCalories kcal',
                subtitle: 'Calories Remaining',
                icon: Icons.fitness_center,
                color: _emeraldColor,
                onTap: () => setState(() => _selectedNavIndex = 2),
              ),
            ),
          ],
        ),

        const SizedBox(height: 18),

        // AI Health Twin Insights Card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: AppTheme.borderPurple),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text('✨ Gemini AI Health Insights', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark)),
                  Text('Daily Synthesis', style: TextStyle(fontSize: 10, color: AppTheme.primaryPurple, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 10),
              const Text(
                '• "Your records show mild mid-cycle fatigue is consistent with LH hormone fluctuations. Recommended 500ml extra hydration and restorative yoga today."',
                style: TextStyle(fontSize: 12, color: AppTheme.textDark, height: 1.45),
              ),
              const SizedBox(height: 12),
              ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.picture_as_pdf, size: 14),
                label: const Text('Export Doctor Prep Summary', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFAF5FF),
                  foregroundColor: AppTheme.primaryPurple,
                  elevation: 0,
                  side: const BorderSide(color: Color(0xFFE9D5FF)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // TAB 2: PERIOD TRACKER
  Widget _buildPeriodTrackerTab() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('🩸 Period & Cycle Tracker', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: _roseColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _roseColor.withOpacity(0.3)),
                ),
                child: Text(_cyclePhase, style: const TextStyle(color: _roseColor, fontWeight: FontWeight.bold, fontSize: 11)),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Cycle Day Display
          Center(
            child: Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  colors: [Color(0xFFFDA4AF), Color(0xFFF43F5E)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: _roseColor.withOpacity(0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  )
                ],
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('CYCLE DAY', style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold)),
                    Text('$_cycleDay', style: const TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.w900)),
                    Text('of $_totalCycleDays Days', style: const TextStyle(color: Colors.white, fontSize: 11)),
                  ],
                ),
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Predictions Row
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFAF8FC),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.borderPurple),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('NEXT PERIOD', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                      const SizedBox(height: 4),
                      Text(_nextPeriodDate, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.textDark)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFAF8FC),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.borderPurple),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('FERTILE WINDOW', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                      const SizedBox(height: 4),
                      Text(_fertileWindow, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.textDark)),
                    ],
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Flow Rate Buttons
          const Text('Log Flow Intensity:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.textDark)),
          const SizedBox(height: 8),
          Row(
            children: ['Spotting', 'Light', 'Medium', 'Heavy'].map((flow) {
              final isSel = _selectedFlow == flow;
              return Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _selectedFlow = flow),
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: isSel ? _roseColor : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: isSel ? _roseColor : AppTheme.borderPurple),
                    ),
                    child: Center(
                      child: Text(
                        flow,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: isSel ? Colors.white : AppTheme.textDark,
                        ),
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  // TAB 3: FITNESS (HOME WORKOUT SCREENSHOT MATCH)
  Widget _buildFitnessTab(int remainingCalories) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Top Header
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppTheme.borderPurple),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('HOME WORKOUT', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppTheme.textDark, letterSpacing: -0.5)),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: _roseColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: _roseColor.withOpacity(0.3)),
                        ),
                        child: Row(
                          children: const [
                            Icon(Icons.local_fire_department, size: 14, color: _roseColor),
                            SizedBox(width: 2),
                            Text('5 Days', style: TextStyle(color: _roseColor, fontWeight: FontWeight.bold, fontSize: 10)),
                          ],
                        ),
                      ),
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF3C7),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFFDE68A)),
                        ),
                        child: const Text('👑 PRO', style: TextStyle(color: Color(0xFF92400E), fontWeight: FontWeight.bold, fontSize: 10)),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // Weekly Goal Date Strip (Screenshot 2 Match)
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFFAF8FC),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppTheme.borderPurple),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text('Weekly Goal', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                        Text('3/4 Days', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.primaryPurple)),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [23, 24, 25, 26, 27, 28, 29].map((day) {
                        final isSelected = day == 25;
                        final isDone = day < 25;
                        return Container(
                          width: 38,
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected ? AppTheme.primaryPurple : (isDone ? const Color(0xFFECFDF5) : Colors.white),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isSelected ? AppTheme.primaryPurple : (isDone ? const Color(0xFFA7F3D0) : AppTheme.borderPurple),
                            ),
                          ),
                          child: Column(
                            children: [
                              Text(
                                '$day',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: isSelected ? Colors.white : (isDone ? _emeraldDark : AppTheme.textDark),
                                ),
                              ),
                              if (isDone)
                                const Text('✓', style: TextStyle(fontSize: 9, color: _emeraldDark, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Hero Spotlight ("Embark on your first workout!")
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF7C3AED), Color(0xFF4C1D95)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.primaryPurple.withOpacity(0.3),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    )
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Embark on your workout!',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Try these top guided exercises for a FULL-BODY SHRED & hormone vitality!',
                      style: TextStyle(fontSize: 11, color: Colors.white70, height: 1.4),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => WorkoutPlayerScreen(
                              workoutPlan: ExerciseCatalog.defaultPlans[0],
                            ),
                          ),
                        ).then((_) {
                          setState(() => _burnedCalories += 180);
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: AppTheme.primaryPurple,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      ),
                      child: const Text('Let\'s Go! 🚀', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
                    )
                  ],
                ),
              ),

              const SizedBox(height: 18),

              // Workout Routines List
              const Text('Featured Workout Routines', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark)),
              const SizedBox(height: 10),

              _buildWorkoutItem(
                title: 'Full-Body Female Shred',
                meta: '15 Mins • 8 Exercises • 180 kcal',
                icon: '⚡',
                onStart: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => WorkoutPlayerScreen(
                        workoutPlan: ExerciseCatalog.defaultPlans[0],
                      ),
                    ),
                  ).then((_) => setState(() => _burnedCalories += 180));
                },
              ),
              const SizedBox(height: 8),
              _buildWorkoutItem(
                title: 'Glute & Core Pelvic Sculpt',
                meta: '12 Mins • 6 Exercises • 140 kcal',
                icon: '🧘',
                onStart: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => WorkoutPlayerScreen(
                        workoutPlan: ExerciseCatalog.defaultPlans[1],
                      ),
                    ),
                  ).then((_) => setState(() => _burnedCalories += 140));
                },
              ),
              const SizedBox(height: 8),
              _buildWorkoutItem(
                title: 'Upper Body Sculpt & Mobility',
                meta: '10 Mins • 5 Exercises • 110 kcal',
                icon: '🙆',
                onStart: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => WorkoutPlayerScreen(
                        workoutPlan: ExerciseCatalog.defaultPlans[2],
                      ),
                    ),
                  ).then((_) => setState(() => _burnedCalories += 110));
                },
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Net Calorie Balance & Hydration Card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppTheme.borderPurple),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildCalorieStat('Budget', '$_calorieBudget', Colors.black87),
              const Text('-', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.grey)),
              _buildCalorieStat('Food', '$_foodCalories', Colors.amber.shade800),
              const Text('+', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.grey)),
              _buildCalorieStat('Burned', '$_burnedCalories', _roseColor),
              const Text('=', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.grey)),
              _buildCalorieStat('Left', '$remainingCalories', _emeraldDark),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildWorkoutItem({
    required String title,
    required String meta,
    required String icon,
    required VoidCallback onStart,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFAF8FC),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(icon, style: const TextStyle(fontSize: 18)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                Text(meta, style: const TextStyle(fontSize: 10, color: AppTheme.textMuted)),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: onStart,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: AppTheme.primaryPurple,
              elevation: 0,
              side: const BorderSide(color: AppTheme.borderPurple),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            ),
            child: const Text('Start', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  // TAB 4: VAULT & RECORDS
  Widget _buildVaultTab() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('📁 Encrypted Health Vault', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
          const SizedBox(height: 14),
          _buildVaultItem('Q3_Longitudinal_Blood_Panel.pdf', 'Lab Report • July 29, 2026', Icons.picture_as_pdf, Colors.red),
          const SizedBox(height: 10),
          _buildVaultItem('Pelvic_Ultrasound_Scan_Results.pdf', 'Imaging • June 14, 2026', Icons.document_scanner, Colors.purple),
          const SizedBox(height: 10),
          _buildVaultItem('OBGYN_Annual_Wellness_Consult.pdf', 'Clinical Note • May 02, 2026', Icons.medical_services, Colors.teal),
        ],
      ),
    );
  }

  Widget _buildQuickTile({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.borderPurple),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 10),
            Text(title, style: const TextStyle(fontSize: 10, color: AppTheme.textMuted, fontWeight: FontWeight.bold)),
            const SizedBox(height: 2),
            Text(value, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
            const SizedBox(height: 2),
            Text(subtitle, style: TextStyle(fontSize: 10, color: color, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildCalorieStat(String label, String value, Color color) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
        const SizedBox(height: 2),
        Text(value, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: color)),
      ],
    );
  }

  Widget _buildVaultItem(String name, String meta, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFAF8FC),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                Text(meta, style: const TextStyle(fontSize: 10, color: AppTheme.textMuted)),
              ],
            ),
          ),
          const Icon(Icons.download, size: 18, color: AppTheme.textMuted),
        ],
      ),
    );
  }
}
