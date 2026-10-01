import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../core/app_theme.dart';
import '../../models/exercise_model.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_screen.dart';
import '../fitness/workout_player_screen.dart';
import '../user/appointments_screen.dart';
import '../user/vitals_tracker_screen.dart';
import '../user/health_reports_screen.dart';
import '../user/partner_sync_screen.dart';
import '../user/notifications_screen.dart';
import '../user/user_profile_screen.dart';
import '../user/user_settings_screen.dart';
import '../../features/wearables/core/wearable_manager.dart';
import '../../features/wearables/core/wearable_capabilities.dart';
import '../../features/wearables/core/wearable_health_data.dart';
import '../../features/wearables/services/wearable_sync_service.dart';
import '../../features/wearables/screens/universal_wearables_screen.dart';
import '../../features/wearables/screens/device_qr_scanner_screen.dart';

class UserDashboardScreen extends StatefulWidget {
  const UserDashboardScreen({super.key});

  @override
  State<UserDashboardScreen> createState() => _UserDashboardScreenState();
}

class _UserDashboardScreenState extends State<UserDashboardScreen> {
  int _selectedNavIndex = 0; // 0: Overview, 1: Period Tracker, 2: Fitness, 3: Vault
  final int _healthScore = 92;
  String _currentStageName = 'Reproductive Age (25–39)';

  // Wearables & Smartwatch Integration State
  final WearableManager _wearableManager = WearableManager();
  final WearableSyncService _wearableSyncService = WearableSyncService();
  Map<String, dynamic>? _wearableTelemetry;
  Map<String, dynamic>? _wearableSummary;
  Map<String, dynamic>? _connectedWearableDevice;
  int? _liveHeartRate;
  StreamSubscription? _liveHrSub;
  StreamSubscription? _activeDeviceSub;

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

  static const Color _roseColor = Color(0xFFF43F5E);
  static const Color _emeraldColor = Color(0xFF10B981);
  static const Color _emeraldDark = Color(0xFF065F46);

  @override
  void initState() {
    super.initState();
    _autoConnectWatch();
    _loadWearableTelemetry();

    // Listen to real-time live heart rate broadcast from active watch adapter
    _liveHrSub = _wearableManager.liveHeartRateStream.listen((bpm) {
      if (mounted) {
        setState(() {
          _liveHeartRate = bpm;
          if (_wearableTelemetry != null) {
            _wearableTelemetry!['heart_rate'] = bpm;
          }
        });
      }
    });

    // Listen for watch connection / disconnection events
    _activeDeviceSub = _wearableManager.activeDeviceStream.listen((device) {
      if (mounted) {
        _loadWearableTelemetry();
      }
    });
  }

  Future<void> _autoConnectWatch() async {
    try {
      final connected = await _wearableManager.autoConnectIfBluetoothConnected();
      if (connected != null && mounted) {
        _loadWearableTelemetry();
      }
    } catch (_) {}
  }

  @override
  void dispose() {
    _liveHrSub?.cancel();
    _activeDeviceSub?.cancel();
    super.dispose();
  }

  Future<void> _loadWearableTelemetry() async {
    try {
      // Auto-connect if phone bluetooth already has the smartwatch connected
      if (_wearableManager.activeDevice == null) {
        await _wearableManager.autoConnectIfBluetoothConnected();
      }
      if (_wearableManager.activeDevice != null) {
        try {
          await _wearableManager.activeDevice!.syncToBackend();
        } catch (_) {}
      }
      final res = await _wearableSyncService.getLatestTelemetry();
      if (mounted) {
        setState(() {
          _connectedWearableDevice = res['device'] as Map<String, dynamic>?;
          _wearableTelemetry = res['latest_reading'] as Map<String, dynamic>?;
          _wearableSummary = res['today_summary'] as Map<String, dynamic>?;
        });
      }
    } catch (_) {}
  }

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
        leading: Builder(
          builder: (ctx) => IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppTheme.textDark),
            onPressed: () => Scaffold.of(ctx).openDrawer(),
          ),
        ),
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF7C3AED), Color(0xFFF43F5E)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Center(
                child: Icon(Icons.auto_awesome, color: Colors.white, size: 16),
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              'FemSphere',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppTheme.textDark,
                letterSpacing: -0.3,
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: const Color(0xFFF3E8FF),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                '🌸 Patient',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF7C3AED),
                ),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.shield_outlined, color: Colors.redAccent, size: 20),
            tooltip: 'Emergency SOS',
            onPressed: () => _showEmergencyModal(context, user),
          ),
          IconButton(
            icon: const Badge(
              label: Text('2', style: TextStyle(fontSize: 10)),
              child: Icon(Icons.notifications_outlined, color: AppTheme.textDark, size: 20),
            ),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen()));
            },
          ),
        ],
      ),
      drawer: _buildUserDrawer(context, user, auth),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedNavIndex > 4 ? 0 : _selectedNavIndex,
        onDestinationSelected: (index) {
          if (index == 2) {
            _showAIChatSheet(context);
            return;
          }
          setState(() {
            _selectedNavIndex = index;
          });
        },
        backgroundColor: Colors.white,
        indicatorColor: AppTheme.primaryPurple.withValues(alpha: 0.15),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home, color: AppTheme.primaryPurple),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.water_drop_outlined),
            selectedIcon: Icon(Icons.water_drop, color: _roseColor),
            label: 'Health',
          ),
          NavigationDestination(
            icon: Icon(Icons.auto_awesome, color: Color(0xFF7C3AED)),
            selectedIcon: Icon(Icons.auto_awesome, color: Color(0xFF7C3AED)),
            label: 'Twin AI',
          ),
          NavigationDestination(
            icon: Icon(Icons.medical_services_outlined),
            selectedIcon: Icon(Icons.medical_services, color: AppTheme.secondaryTeal),
            label: 'Care & Vault',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person, color: AppTheme.primaryPurple),
            label: 'Profile',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            
            // TAB CONTENT
            if (_selectedNavIndex == 0) _buildOverviewTab(remainingCalories),
            if (_selectedNavIndex == 1) _buildPeriodTrackerTab(),
            if (_selectedNavIndex == 2) _buildFitnessTab(remainingCalories),
            if (_selectedNavIndex == 3) _buildVaultTab(),
            if (_selectedNavIndex == 4) _buildProfileTab(user),
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
        // 1. Health Score Ring Card
        _buildHealthScoreCard(),

        const SizedBox(height: 16),

        // 2. Health Twin Visualizer Card
        _buildHealthTwinVisualizer(),

        const SizedBox(height: 18),

        // 3. Today's Snapshot (Horizontal vital telemetry cards)
        _buildTodaySnapshot(),

        const SizedBox(height: 18),

        // 4. Gemini AI Clinical Synthesis Card
        _buildAIInsightCard(),

        const SizedBox(height: 18),

        // 5. Specialty Modes (Pregnancy, Postpartum, Menopause, PCOS)
        _buildSpecialtyModes(),

        const SizedBox(height: 18),

        // 6. Quick Overview Tiles
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

        // Quick Access Sub-Modules Grid
        const Text(
          '✨ Health Twin Hub & Quick Access',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildHubCard(
                title: 'Appointments',
                subtitle: 'OB/GYN Consults',
                icon: Icons.calendar_month,
                color: AppTheme.primaryPurple,
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AppointmentsScreen())),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildHubCard(
                title: 'Vitals Logger',
                subtitle: 'BP, Sugar, Temp',
                icon: Icons.monitor_heart,
                color: const Color(0xFF10B981),
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const VitalsTrackerScreen())),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildHubCard(
                title: 'AI Analytics',
                subtitle: '92/100 Bio-Twin',
                icon: Icons.auto_awesome,
                color: const Color(0xFF6366F1),
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const HealthReportsScreen())),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildHubCard(
                title: 'Partner Sync',
                subtitle: 'Cycle & SOS Link',
                icon: Icons.favorite,
                color: const Color(0xFFEC4899),
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const PartnerSyncScreen())),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildHubCard(
                title: 'Smartwatches',
                subtitle: 'Apple, Galaxy, Garmin, BLE',
                icon: Icons.watch_outlined,
                color: const Color(0xFF0EA5E9),
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const UniversalWearablesScreen())),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildHubCard(
                title: 'Wearable Sensors',
                subtitle: 'Rings, Bands, HR & SpO2',
                icon: Icons.sensors,
                color: const Color(0xFF8B5CF6),
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const UniversalWearablesScreen())),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildHubCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppTheme.borderPurple),
        ),
        child: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: color.withValues(alpha: 0.12),
              child: Icon(icon, size: 18, color: color),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark)),
                  Text(subtitle, style: const TextStyle(fontSize: 10, color: AppTheme.textMuted), maxLines: 1, overflow: TextOverflow.ellipsis),
                ],
              ),
            ),
          ],
        ),
      ),
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
                const SizedBox(height: 2),
                Text(meta, style: const TextStyle(fontSize: 10, color: AppTheme.textMuted)),
              ],
            ),
          ),
          const Icon(Icons.download, size: 18, color: AppTheme.textMuted),
        ],
      ),
    );
  }

  Widget _buildUserDrawer(BuildContext context, dynamic user, AuthProvider auth) {
    return Drawer(
      backgroundColor: const Color(0xFFFAF8FC),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(20, 48, 20, 20),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF7C3AED), Color(0xFF6D28D9)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: Colors.white,
                  child: Text('ER', style: TextStyle(color: AppTheme.primaryPurple, fontWeight: FontWeight.bold, fontSize: 18)),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        (user?.fullName.isNotEmpty == true ? user!.fullName : user?.username) ?? 'User',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        _currentStageName,
                        style: const TextStyle(color: Colors.white70, fontSize: 11),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          'AI Twin: $_healthScore/100',
                          style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 8),
              children: [
                _buildDrawerTile(
                  title: 'Dashboard Overview',
                  icon: Icons.dashboard,
                  color: AppTheme.primaryPurple,
                  isSelected: _selectedNavIndex == 0,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 0);
                  },
                ),
                _buildDrawerTile(
                  title: 'Medical Records (Vault)',
                  icon: Icons.folder,
                  color: AppTheme.secondaryTeal,
                  isSelected: _selectedNavIndex == 3,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 3);
                  },
                ),
                _buildDrawerTile(
                  title: 'Health Tracker (Vitals)',
                  icon: Icons.monitor_heart,
                  color: const Color(0xFFF472B6),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const VitalsTrackerScreen()));
                  },
                ),
                _buildDrawerTile(
                  title: 'Wearables & Smartwatches',
                  icon: Icons.watch,
                  color: const Color(0xFF8B5CF6),
                  badge: 'BLE / Multi',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const UniversalWearablesScreen()));
                  },
                ),
                _buildDrawerTile(
                  title: 'Period Tracker (Cycle & Ovulation)',
                  icon: Icons.water_drop,
                  color: const Color(0xFFF43F5E),
                  isSelected: _selectedNavIndex == 1,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 1);
                  },
                ),
                _buildDrawerTile(
                  title: 'Doctor Appointments',
                  icon: Icons.calendar_month,
                  color: AppTheme.primaryPurple,
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const AppointmentsScreen()));
                  },
                ),
                _buildDrawerTile(
                  title: 'AI Health Reports',
                  icon: Icons.print,
                  color: const Color(0xFF14B8A6),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const HealthReportsScreen()));
                  },
                ),
                _buildDrawerTile(
                  title: 'Prescribed Fitness Workouts',
                  icon: Icons.fitness_center,
                  color: const Color(0xFF10B981),
                  isSelected: _selectedNavIndex == 2,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 2);
                  },
                ),
                _buildDrawerTile(
                  title: 'Partner Mode Sync',
                  icon: Icons.favorite,
                  color: const Color(0xFFEC4899),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const PartnerSyncScreen()));
                  },
                ),
                _buildDrawerTile(
                  title: 'Notifications Center',
                  icon: Icons.notifications,
                  color: Colors.amber.shade800,
                  badge: '2',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen()));
                  },
                ),
                const Divider(),
                _buildDrawerTile(
                  title: 'Profile & Medical ID',
                  icon: Icons.person,
                  color: AppTheme.primaryPurple,
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const UserProfileScreen()));
                  },
                ),
                _buildDrawerTile(
                  title: 'Settings & Privacy Consents',
                  icon: Icons.settings,
                  color: Colors.blueGrey,
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const UserSettingsScreen()));
                  },
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Log Out', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 13)),
            onTap: () {
              auth.logout();
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerTile({
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
    bool isSelected = false,
    String? badge,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
      child: Material(
        color: isSelected ? color.withValues(alpha: 0.12) : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        child: ListTile(
        dense: true,
        leading: Icon(icon, color: color, size: 20),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            color: isSelected ? color : AppTheme.textDark,
          ),
        ),
        trailing: badge != null
            ? Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(badge, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
              )
            : null,
        onTap: onTap,
        ),
      ),
    );
  }

  Widget _buildHealthScoreCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFF1E8F8)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 90,
                height: 90,
                child: CircularProgressIndicator(
                  value: 0.87,
                  strokeWidth: 9,
                  backgroundColor: const Color(0xFFF3E8FF),
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF7C3AED)),
                  strokeCap: StrokeCap.round,
                ),
              ),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Text(
                    '87',
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.textDark,
                    ),
                  ),
                  Text(
                    '/100',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: Colors.black45,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFECFDF5),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.arrow_upward, color: Color(0xFF059669), size: 12),
                              SizedBox(width: 2),
                              Text(
                                '+3 pts vs last week',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF059669),
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (_wearableManager.activeDevice != null || _connectedWearableDevice != null) ...[
                          const SizedBox(width: 6),
                          InkWell(
                            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const UniversalWearablesScreen())),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF3E8FF),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: const Color(0xFFDDD6FE)),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.watch_rounded, color: Color(0xFF7C3AED), size: 11),
                                  const SizedBox(width: 3),
                                  Text(
                                    _wearableManager.activeDevice?.name ?? _connectedWearableDevice?['device_name'] ?? 'Watch Synced',
                                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF7C3AED)),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                const Text(
                  'Health Score: Optimal',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textDark,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Hormonal and cardiac bio-signals are well-balanced for Day 4 of your cycle.',
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.black54,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHealthTwinVisualizer() {
    final hrvVal = _wearableSummary?['avg_hrv'] != null && _wearableSummary!['avg_hrv'] > 0
        ? '${_wearableSummary!['avg_hrv']} ms'
        : (_wearableTelemetry?['hrv_rmssd'] != null ? '${_wearableTelemetry!['hrv_rmssd']} ms' : '68 ms');

    final tempVal = _wearableSummary?['latest_body_temp'] != null
        ? '${_wearableSummary!['latest_body_temp']}°C'
        : (_wearableTelemetry?['body_temperature'] != null ? '${_wearableTelemetry!['body_temperature']}°C' : '36.6°C');

    final sleepMins = _wearableSummary?['today_sleep_minutes'] ?? _wearableTelemetry?['sleep_duration_minutes'];
    final sleepVal = (sleepMins != null && sleepMins > 0)
        ? '${(sleepMins / 60).toStringAsFixed(1)}h'
        : '7h 42m';

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF5B21B6), Color(0xFF7C3AED), Color(0xFF9333EA)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF7C3AED).withValues(alpha: 0.35),
            blurRadius: 20,
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
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.hub, color: Colors.white, size: 16),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'FemSphere Neural Twin',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withValues(alpha: 0.25),
                  border: Border.all(color: const Color(0xFF34D399).withValues(alpha: 0.5)),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.fiber_manual_record, color: Color(0xFF34D399), size: 8),
                    SizedBox(width: 4),
                    Text(
                      'Live 1s Telemetry',
                      style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Biological Resilience: 92%',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w800,
              fontSize: 18,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Continuous digital modeling across hormonal, cardiac, and sleep bio-markers.',
            style: TextStyle(color: Colors.white70, fontSize: 11, height: 1.3),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.18),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildTwinMetricPill('HRV', hrvVal, Icons.favorite_border),
                _buildTwinMetricPill('Core Temp', tempVal, Icons.thermostat_outlined),
                _buildTwinMetricPill('Sleep', sleepVal, Icons.nightlight_round),
                _buildTwinMetricPill('Phase', 'Day 4', Icons.water_drop_outlined),
              ],
            ),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => _showAIChatSheet(context),
              icon: const Icon(Icons.auto_awesome, color: Color(0xFF5B21B6), size: 16),
              label: const Text(
                'Consult Health Twin Simulation',
                style: TextStyle(color: Color(0xFF5B21B6), fontWeight: FontWeight.bold, fontSize: 12),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                elevation: 0,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTwinMetricPill(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.white70, size: 14),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
        ),
        Text(
          label,
          style: const TextStyle(color: Colors.white60, fontSize: 9),
        ),
      ],
    );
  }

  Widget _buildTodaySnapshot() {
    final isWatchLive = _liveHeartRate != null || _wearableManager.activeDevice != null;
    final devName = _wearableManager.activeDevice?.name ?? _connectedWearableDevice?['device_name'];
    final actualHr = _liveHeartRate ?? _wearableSummary?['avg_heart_rate'] ?? _wearableTelemetry?['heart_rate'];
    final hrVal = (actualHr != null && actualHr > 0) ? '$actualHr bpm' : (isWatchLive ? '74 bpm' : '--');
    final hrStatus = _liveHeartRate != null
        ? '🟢 Live Watch'
        : (_wearableManager.activeDevice != null
            ? '🟢 ${devName ?? "Watch"} Connected'
            : (_connectedWearableDevice != null
                ? '⌚ ${devName ?? "Watch"} Synced'
                : 'Connect Watch'));

    final bpSys = _wearableSummary?['latest_bp_sys'] ?? _wearableTelemetry?['blood_pressure_systolic'];
    final bpDia = _wearableSummary?['latest_bp_dia'] ?? _wearableTelemetry?['blood_pressure_diastolic'];
    final bpVal = (bpSys != null && bpDia != null) ? '$bpSys/$bpDia' : '118/76';

    final actualSpo2 = (_wearableSummary?['latest_spo2'] != null && _wearableSummary!['latest_spo2'] > 0)
        ? _wearableSummary!['latest_spo2']
        : _wearableTelemetry?['spo2'];
    final spo2Val = (actualSpo2 != null && actualSpo2 > 0) ? '$actualSpo2%' : '--';

    final actualSteps = (_wearableSummary?['today_steps'] != null && _wearableSummary!['today_steps'] > 0)
        ? _wearableSummary!['today_steps']
        : _wearableTelemetry?['steps'];
    final stepsFormatted = (actualSteps != null && actualSteps >= 0) ? NumberFormat('#,###').format(actualSteps) : '--';
    final stepsStatus = actualSteps != null ? '⌚ From Watch' : 'Goal: 10,000';

    final vitals = [
      {
        'title': 'Heart Rate',
        'val': hrVal,
        'status': hrStatus,
        'icon': Icons.favorite,
        'color': const Color(0xFFF43F5E),
      },
      {
        'title': 'Blood Pressure',
        'val': bpVal,
        'status': 'Optimal mmHg',
        'icon': Icons.speed,
        'color': const Color(0xFF6366F1),
      },
      {
        'title': 'Blood Oxygen',
        'val': spo2Val,
        'status': actualSpo2 != null ? '⌚ Watch SpO2' : 'SpO2 Optimal',
        'icon': Icons.air,
        'color': const Color(0xFF0EA5E9),
      },
      {
        'title': 'Daily Steps',
        'val': stepsFormatted,
        'status': stepsStatus,
        'icon': Icons.directions_walk,
        'color': const Color(0xFF10B981),
      },
      {
        'title': 'Hydration',
        'val': '${(_waterCups * 0.25).toStringAsFixed(2)} L',
        'status': 'Goal: 3.0 L',
        'icon': Icons.water_drop,
        'color': const Color(0xFF3B82F6),
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Expanded(
                  child: Text(
                    '📊 Today\'s Physiological Snapshot',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (isWatchLive || _connectedWearableDevice != null) ...[
                  const SizedBox(width: 8),
                  InkWell(
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const UniversalWearablesScreen())),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.circle, color: Color(0xFF10B981), size: 6),
                          const SizedBox(width: 3),
                          Text(
                            _wearableManager.activeDevice?.name ?? _connectedWearableDevice?['device_name'] ?? 'Watch Linked',
                            style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF059669)),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                InkWell(
                  onTap: () async {
                    final res = await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const DeviceQrScannerScreen(initialTarget: ScannerTarget.smartwatch),
                      ),
                    );
                    if (res == true && mounted) {
                      _loadWearableTelemetry();
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE0F2FE),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFBAE6FD)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.qr_code_scanner, size: 14, color: Color(0xFF0284C7)),
                        SizedBox(width: 3),
                        Text(
                          'Scan QR',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0284C7)),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                InkWell(
                  onTap: () => _showMatchWatchDialog(context),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3E8FF),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFDDD6FE)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.edit_note_rounded, size: 14, color: Color(0xFF7C3AED)),
                        SizedBox(width: 3),
                        Text(
                          'Match Watch',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF7C3AED)),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                InkWell(
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const VitalsTrackerScreen())),
                  child: const Text(
                    'Log New',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.primaryPurple),
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 110,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: vitals.length,
            separatorBuilder: (_, __) => const SizedBox(width: 10),
            itemBuilder: (context, index) {
              final v = vitals[index];
              final color = v['color'] as Color;
              return InkWell(
                borderRadius: BorderRadius.circular(18),
                onTap: () {
                  if (v['title'] == 'Hydration') {
                    _showHydrationTrackingDialog(context);
                  } else {
                    _showMatchWatchDialog(context);
                  }
                },
                child: Container(
                  width: 130,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: color.withValues(alpha: 0.2)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            v['title'] as String,
                            style: const TextStyle(fontSize: 10, color: Colors.black54, fontWeight: FontWeight.w600),
                          ),
                          Icon(v['icon'] as IconData, size: 14, color: color),
                        ],
                      ),
                      Text(
                        v['val'] as String,
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: color),
                      ),
                      Text(
                        v['status'] as String,
                        style: const TextStyle(fontSize: 9, color: Colors.black45),
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

  Widget _buildAIInsightCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFDDD6FE)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF7C3AED).withValues(alpha: 0.06),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3E8FF),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.auto_awesome, color: Color(0xFF7C3AED), size: 16),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'Gemini Clinical AI Synthesis',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3E8FF),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Text(
                  'Daily Brief',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF7C3AED)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            '• "Your telemetry indicates sustained resting recovery with HRV at 68ms. Since you are in the menstrual phase, metabolic demands are lower. Recommended hydration: 2.5L with light stretching."',
            style: TextStyle(fontSize: 12, color: AppTheme.textDark, height: 1.45),
          ),
          const SizedBox(height: 12),
          InkWell(
            onTap: () => _showAIChatSheet(context),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: const [
                Text(
                  'Chat with Twin AI',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF7C3AED)),
                ),
                SizedBox(width: 4),
                Icon(Icons.arrow_forward_rounded, size: 14, color: Color(0xFF7C3AED)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpecialtyModes() {
    final modes = [
      {'title': 'Pregnancy Mode', 'sub': 'Trimester & Fetal Tracker', 'icon': '🤰', 'color': const Color(0xFFEC4899)},
      {'title': 'Postpartum Care', 'sub': 'Pelvic Floor & Mental Vitals', 'icon': '🤱', 'color': const Color(0xFF8B5CF6)},
      {'title': 'Menopause Navigator', 'sub': 'Vasomotor & Hormone Balance', 'icon': '🌿', 'color': const Color(0xFF10B981)},
      {'title': 'PCOS / Endo Log', 'sub': 'Symptom & Ovulation Panel', 'icon': '🌸', 'color': const Color(0xFFF43F5E)},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '🌺 Specialty Health Journeys',
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark),
        ),
        const SizedBox(height: 10),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: modes.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 2.2,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
          ),
          itemBuilder: (context, index) {
            final m = modes[index];
            final color = m['color'] as Color;
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: color.withValues(alpha: 0.2)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Text(m['icon'] as String, style: const TextStyle(fontSize: 22)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          m['title'] as String,
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          m['sub'] as String,
                          style: const TextStyle(fontSize: 9, color: Colors.black45),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
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
    );
  }

  Widget _buildProfileTab(dynamic user) {
    final name = user?.name ?? 'Keerthana';
    final email = user?.email ?? 'keerthana@femsphere.org';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFFF1E8F8)),
          ),
          child: Row(
            children: [
              CircleAvatar(
                radius: 30,
                backgroundColor: const Color(0xFFF3E8FF),
                child: Text(
                  name.isNotEmpty ? name[0].toUpperCase() : 'F',
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF7C3AED)),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                    const SizedBox(height: 2),
                    Text(email, style: const TextStyle(fontSize: 12, color: Colors.black54)),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF3E8FF),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text('🌸 Patient Account', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF7C3AED))),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFF1E8F8)),
          ),
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.shield_outlined, color: Colors.redAccent),
                title: const Text('Emergency Health Pass & SOS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                trailing: const Icon(Icons.chevron_right, size: 20),
                onTap: () => _showEmergencyModal(context, user),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.watch_outlined, color: Color(0xFF0EA5E9)),
                title: const Text('All Smartwatches & Wearables', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: const Text('Apple Watch, Galaxy, Garmin, Fitbit, Amazfit, Noise, boAt & BLE', style: TextStyle(fontSize: 10, color: Colors.black45)),
                trailing: const Icon(Icons.chevron_right, size: 20),
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const UniversalWearablesScreen())),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.settings_outlined, color: AppTheme.primaryPurple),
                title: const Text('Account & Privacy Settings', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                trailing: const Icon(Icons.chevron_right, size: 20),
                onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const UserSettingsScreen())),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _showEmergencyModal(BuildContext context, dynamic user) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.all(24),
          child: SafeArea(
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
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEE2E2),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Icon(Icons.shield, color: Color(0xFFDC2626), size: 24),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          '🚨 Emergency Health Pass',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                        ),
                        Text(
                          'One-tap SOS and critical medical telemetry',
                          style: TextStyle(fontSize: 11, color: Colors.black54),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('🚨 SOS Alert Dispatched to Emergency Services & Primary Contacts!'),
                          backgroundColor: Color(0xFFDC2626),
                        ),
                      );
                    },
                    icon: const Icon(Icons.phone_in_talk, color: Colors.white),
                    label: const Text(
                      'CALL EMERGENCY SERVICES (911 / 112)',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFDC2626),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 0,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Calling Emergency Contact: Alex (+1 555-0192)')),
                      );
                    },
                    icon: const Icon(Icons.contact_phone, color: Color(0xFFDC2626)),
                    label: const Text(
                      'Call Primary Contact (Alex - +1 555-0192)',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFFDC2626)),
                    ),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFFFCA5A5)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF2F2),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFFECACA)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('Critical Clinical Profile:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF991B1B))),
                      SizedBox(height: 6),
                      Text('• Blood Group: O Positive (O+)', style: TextStyle(fontSize: 11, color: Color(0xFF7F1D1D))),
                      Text('• Critical Allergies: Penicillin, Sulfa Antibiotics', style: TextStyle(fontSize: 11, color: Color(0xFF7F1D1D))),
                      Text('• Medical Conditions: Mild Asthma, PCOS', style: TextStyle(fontSize: 11, color: Color(0xFF7F1D1D))),
                      Text('• Emergency Note: Inhaler in bag, Digital Health Twin active', style: TextStyle(fontSize: 11, color: Color(0xFF7F1D1D))),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showAIChatSheet(BuildContext context) {
    final textController = TextEditingController();
    final List<Map<String, String>> messages = [
      {
        'role': 'assistant',
        'text': 'Hello Keerthana! I am your FemSphere Digital Twin AI. I am continuously analyzing your cycle phase (Day 4) and wearable vitals. How can I assist you today?'
      },
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (sheetContext, setSheetState) {
            return Container(
              height: MediaQuery.of(sheetContext).size.height * 0.75,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: Column(
                children: [
                  const SizedBox(height: 12),
                  Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF7C3AED), Color(0xFFF43F5E)],
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.auto_awesome, color: Colors.white, size: 18),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'Gemini Health Twin Assistant',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                            ),
                            Text(
                              'Continuous clinical bio-synthesis',
                              style: TextStyle(fontSize: 11, color: Colors.black54),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1),
                  // Chat message list
                  Expanded(
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: messages.length,
                      itemBuilder: (context, idx) {
                        final msg = messages[idx];
                        final isUser = msg['role'] == 'user';
                        return Align(
                          alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 10),
                            padding: const EdgeInsets.all(14),
                            constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                            decoration: BoxDecoration(
                              color: isUser ? const Color(0xFF7C3AED) : const Color(0xFFF3E8FF),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Text(
                              msg['text']!,
                              style: TextStyle(
                                fontSize: 13,
                                color: isUser ? Colors.white : AppTheme.textDark,
                                height: 1.4,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  // Suggested prompts
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    child: Row(
                      children: [
                        _buildPromptChip('Explain my HRV score', () {
                          setSheetState(() {
                            messages.add({'role': 'user', 'text': 'Explain my HRV score'});
                            messages.add({
                              'role': 'assistant',
                              'text': 'Your HRV of 68ms reflects strong parasympathetic activation and good recovery resilience today.'
                            });
                          });
                        }),
                        _buildPromptChip('How to manage fatigue?', () {
                          setSheetState(() {
                            messages.add({'role': 'user', 'text': 'How to manage fatigue?'});
                            messages.add({
                              'role': 'assistant',
                              'text': 'Day 4 of your cycle often has lower estrogen. Prioritize 2.5L hydration, iron-rich meals, and gentle yoga.'
                            });
                          });
                        }),
                      ],
                    ),
                  ),
                  // Input Bar
                  Padding(
                    padding: EdgeInsets.only(
                      left: 16,
                      right: 16,
                      top: 8,
                      bottom: MediaQuery.of(sheetContext).viewInsets.bottom + 16,
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: textController,
                            decoration: InputDecoration(
                              hintText: 'Ask your health twin anything...',
                              hintStyle: const TextStyle(fontSize: 13, color: Colors.black45),
                              filled: true,
                              fillColor: const Color(0xFFF8F5FC),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(24),
                                borderSide: BorderSide.none,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        CircleAvatar(
                          backgroundColor: const Color(0xFF7C3AED),
                          radius: 22,
                          child: IconButton(
                            icon: const Icon(Icons.arrow_upward, color: Colors.white, size: 20),
                            onPressed: () {
                              final text = textController.text.trim();
                              if (text.isEmpty) return;
                              setSheetState(() {
                                messages.add({'role': 'user', 'text': text});
                                messages.add({
                                  'role': 'assistant',
                                  'text': 'Analyzing "$text" across your digital health twin profile... Your vital parameters are currently stable.'
                                });
                              });
                              textController.clear();
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildPromptChip(String text, VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ActionChip(
        label: Text(text, style: const TextStyle(fontSize: 11, color: Color(0xFF7C3AED), fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFFF3E8FF),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        side: BorderSide.none,
        onPressed: onTap,
      ),
    );
  }

  void _showMatchWatchDialog(BuildContext context) {
    final curSteps = _wearableSummary?['today_steps'] ?? _wearableTelemetry?['steps'] ?? 0;
    final curHr = _liveHeartRate ?? _wearableSummary?['avg_heart_rate'] ?? _wearableTelemetry?['heart_rate'] ?? 72;
    final curSpo2 = _wearableSummary?['latest_spo2'] ?? _wearableTelemetry?['spo2'] ?? 98;

    final stepsCtrl = TextEditingController(text: curSteps > 0 ? curSteps.toString() : '');
    final hrCtrl = TextEditingController(text: curHr > 0 ? curHr.toString() : '');
    final spo2Ctrl = TextEditingController(text: curSpo2 > 0 ? curSpo2.toString() : '');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 20,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
        ),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF3E8FF),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.watch_rounded, color: Color(0xFF7C3AED), size: 20),
                    ),
                    const SizedBox(width: 10),
                    const Text(
                      'Match Watch Display',
                      style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                    ),
                  ],
                ),
                IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
              ],
            ),
            const SizedBox(height: 6),
            const Text(
              'Enter the exact readings from your smartwatch screen so FemSphere displays the identical values.',
              style: TextStyle(fontSize: 12, color: Colors.black54),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: stepsCtrl,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Watch Step Count',
                hintText: 'e.g. 2450',
                prefixIcon: const Icon(Icons.directions_walk, color: Color(0xFF10B981)),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: hrCtrl,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'Heart Rate (bpm)',
                      hintText: 'e.g. 78',
                      prefixIcon: const Icon(Icons.favorite, color: Color(0xFFF43F5E)),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: spo2Ctrl,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'Blood Oxygen (SpO2 %)',
                      hintText: 'e.g. 98',
                      prefixIcon: const Icon(Icons.air, color: Color(0xFF0EA5E9)),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.check_circle_outline, size: 18),
                label: const Text('Sync Exactly As On Watch', style: TextStyle(fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF7C3AED),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: () async {
                  final s = int.tryParse(stepsCtrl.text);
                  final h = int.tryParse(hrCtrl.text);
                  final o = int.tryParse(spo2Ctrl.text);

                  final devName = _wearableManager.activeDevice?.name ?? _connectedWearableDevice?['device_name'] ?? 'Smartwatch';
                  final devId = _wearableManager.activeDevice?.id ?? _connectedWearableDevice?['device_identifier'] ?? 'CALIBRATED_WATCH';
                  final devModel = _wearableManager.activeDevice?.model ?? _connectedWearableDevice?['device_model'] ?? 'BLE Watch';
                  final brandCode = _wearableManager.activeDevice?.brand.code ?? _connectedWearableDevice?['brand'] ?? 'GENERIC_BLE';

                  await _wearableSyncService.syncWearableData(
                    deviceIdentifier: devId,
                    deviceName: devName,
                    deviceModel: devModel,
                    brand: brandCode,
                    batteryLevel: 85,
                    capabilities: _wearableManager.activeDevice?.capabilities ?? const WearableCapabilities(),
                    data: WearableHealthData(
                      steps: s,
                      heartRate: h,
                      restingHeartRate: h != null ? (h * 0.9).round() : null,
                      spo2: o,
                      calories: s != null ? (s * 0.042).round() : null,
                      distanceMeters: s != null ? (s * 0.76) : null,
                      source: 'MANUAL_WATCH_MATCH',
                      recordedAt: DateTime.now(),
                    ),
                  );

                  Navigator.pop(ctx);
                  await _loadWearableTelemetry();

                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('✓ FemSphere calibrated to match $devName!'),
                        backgroundColor: const Color(0xFF10B981),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showHydrationTrackingDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          final currentLiters = _waterCups * 0.25;
          final percent = (currentLiters / 3.0).clamp(0.0, 1.0);

          return Container(
            padding: const EdgeInsets.all(22),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF06B6D4).withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.water_drop, color: Color(0xFF06B6D4), size: 24),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hydration & Smart Bottle',
                            style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                          ),
                          Text(
                            'Real-time tracking & smart bottle sync',
                            style: TextStyle(fontSize: 12, color: Colors.grey),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.grey),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Intake Progress Ring / Bar
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0FDF4),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFBBF7D0)),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${currentLiters.toStringAsFixed(2)} L',
                                style: const TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF065F46),
                                ),
                              ),
                              Text(
                                'Goal: 3.00 L (${(percent * 100).toInt()}% completed)',
                                style: TextStyle(fontSize: 12, color: Colors.grey.shade700, fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                          // Quick + / - Cups Stepper
                          Row(
                            children: [
                              IconButton(
                                style: IconButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  shape: const CircleBorder(),
                                ),
                                icon: const Icon(Icons.remove, color: Color(0xFF06B6D4)),
                                onPressed: () {
                                  if (_waterCups > 0) {
                                    setState(() => _waterCups--);
                                    setModalState(() {});
                                  }
                                },
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 8),
                                child: Text(
                                  '$_waterCups cups',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                ),
                              ),
                              IconButton(
                                style: IconButton.styleFrom(
                                  backgroundColor: const Color(0xFF06B6D4),
                                  shape: const CircleBorder(),
                                ),
                                icon: const Icon(Icons.add, color: Colors.white),
                                onPressed: () {
                                  setState(() => _waterCups++);
                                  setModalState(() {});
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: LinearProgressIndicator(
                          value: percent,
                          minHeight: 10,
                          backgroundColor: Colors.grey.shade200,
                          valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF06B6D4)),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Primary Action: Scan Smart Bottle QR
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.qr_code_scanner, size: 20),
                    label: const Text('Scan QR to Connect Smart Water Bottle', style: TextStyle(fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF06B6D4),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 0,
                    ),
                    onPressed: () async {
                      Navigator.pop(ctx);
                      final res = await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const DeviceQrScannerScreen(initialTarget: ScannerTarget.waterBottle),
                        ),
                      );
                      if (res == true && mounted) {
                        setState(() {
                          _waterCups += 2; // Add 500ml on bottle pairing
                        });
                        _loadWearableTelemetry();
                      }
                    },
                  ),
                ),
                const SizedBox(height: 10),

                // Secondary Action: Pair Watch via QR
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.watch, size: 18, color: AppTheme.primaryPurple),
                    label: const Text('Scan Smartwatch QR Code Instead', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryPurple)),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFFDDD6FE)),
                      padding: const EdgeInsets.symmetric(vertical: 13),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    onPressed: () async {
                      Navigator.pop(ctx);
                      final res = await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const DeviceQrScannerScreen(initialTarget: ScannerTarget.smartwatch),
                        ),
                      );
                      if (res == true && mounted) {
                        _loadWearableTelemetry();
                      }
                    },
                  ),
                ),
                const SizedBox(height: 12),
              ],
            ),
          );
        },
      ),
    );
  }
}
