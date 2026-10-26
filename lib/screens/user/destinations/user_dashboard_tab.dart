import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../core/app_theme.dart';
import '../../../models/user_model.dart';
import '../../../services/api_service.dart';
import '../../../services/health_connect_service.dart';
import '../../../features/wearables/services/wearable_sync_service.dart';

class UserDashboardTab extends StatefulWidget {
  final UserModel? user;
  final VoidCallback onOpenPeriodTracker;
  final VoidCallback onOpenConnectDevices;
  final VoidCallback onOpenCareAndRecords;

  const UserDashboardTab({
    super.key,
    required this.user,
    required this.onOpenPeriodTracker,
    required this.onOpenConnectDevices,
    required this.onOpenCareAndRecords,
  });

  @override
  State<UserDashboardTab> createState() => _UserDashboardTabState();
}

class _UserDashboardTabState extends State<UserDashboardTab> {
  final WearableSyncService _wearableSyncService = WearableSyncService();
  final HealthConnectService _healthConnectService = HealthConnectService();

  bool _isLoading = true;
  bool _isSyncingHealthConnect = false;
  String? _errorMessage;

  // Real backend metrics
  Map<String, dynamic>? _wearableTelemetry;
  Map<String, dynamic>? _wearableSummary;
  List<Map<String, dynamic>> _activityHistory = [];
  Map<String, dynamic>? _periodOverview;
  List<dynamic> _appointments = [];
  Map<String, dynamic>? _latestVitals;
  String _lifeStageName = 'Reproductive Health';
  int _healthScore = 85;

  @override
  void initState() {
    super.initState();
    _healthConnectService.snapshotNotifier.addListener(_onSnapshotUpdated);
    _fetchDashboardData();
  }

  @override
  void dispose() {
    _healthConnectService.snapshotNotifier.removeListener(_onSnapshotUpdated);
    super.dispose();
  }

  void _onSnapshotUpdated() {
    if (mounted) setState(() {});
  }

  Future<void> _handleHealthConnectSync() async {
    if (_isSyncingHealthConnect) return;
    setState(() => _isSyncingHealthConnect = true);

    try {
      final snap = await _healthConnectService.syncHealthData(requestPermissionIfDenied: true);

      if (!mounted) return;

      if (snap.status == HealthSyncStatus.notInstalled) {
        _showHealthConnectInstallDialog();
      } else if (snap.status == HealthSyncStatus.permissionRequired) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Health Connect read permissions needed for Amazfit biometrics.'),
            action: SnackBarAction(
              label: 'Grant',
              onPressed: () => _healthConnectService.requestPermissions(),
            ),
          ),
        );
      } else if (snap.status == HealthSyncStatus.zeppPending) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('ℹ️ Zepp has not exported records to Health Connect yet. Please open Zepp app to sync your watch.'),
            backgroundColor: Color(0xFFF59E0B),
            duration: Duration(seconds: 4),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(snap.isBackendSynced
                ? '✓ Amazfit biometrics synced with FemSphere cloud!'
                : '✓ Biometrics updated locally from Health Connect.'),
            backgroundColor: const Color(0xFF10B981),
            duration: const Duration(seconds: 2),
          ),
        );
      }

      await _fetchDashboardData();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Sync error: $e'), backgroundColor: const Color(0xFFEF4444)),
        );
      }
    } finally {
      if (mounted) setState(() => _isSyncingHealthConnect = false);
    }
  }

  void _showHealthConnectInstallDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Row(
          children: [
            const Icon(Icons.health_and_safety, color: AppTheme.primaryPurple),
            const SizedBox(width: 8),
            const Text('Health Connect Required'),
          ],
        ),
        content: const Text(
          'Android Health Connect is required to read health data exported by Zepp from your Amazfit watch.\n\n'
          'Would you like to open Google Play to install or update Health Connect?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryPurple,
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              Navigator.pop(ctx);
              _healthConnectService.promptInstallOrUpdate();
            },
            child: const Text('Install / Update'),
          ),
        ],
      ),
    );
  }

  Future<void> _fetchDashboardData() async {
    if (!mounted) return;
    setState(() => _isLoading = true);

    try {
      final results = await Future.wait([
        _wearableSyncService.getLatestTelemetry().catchError((_) => <String, dynamic>{}),
        _wearableSyncService.getTelemetryHistory(days: 7).catchError((_) => <Map<String, dynamic>>[]),
        ApiService.getPeriodOverview().catchError((_) => <String, dynamic>{}),
        ApiService.getAppointments().catchError((_) => <dynamic>[]),
        ApiService.getVitals().catchError((_) => <dynamic>[]),
        ApiService.getDynamicLifeStage().catchError((_) => <String, dynamic>{}),
      ]);

      if (!mounted) return;

      final telemetryRes = results[0] as Map<String, dynamic>;
      final historyRes = results[1] as List<Map<String, dynamic>>;
      final periodRes = results[2] as Map<String, dynamic>;
      final apptsRes = results[3] as List<dynamic>;
      final vitalsRes = results[4] as List<dynamic>;
      final stageRes = results[5] as Map<String, dynamic>;

      setState(() {
        _wearableTelemetry = telemetryRes['latest_reading'] as Map<String, dynamic>?;
        _wearableSummary = telemetryRes['today_summary'] as Map<String, dynamic>?;
        _activityHistory = historyRes;
        _periodOverview = periodRes;
        _appointments = apptsRes;
        if (vitalsRes.isNotEmpty && vitalsRes.first is Map<String, dynamic>) {
          _latestVitals = vitalsRes.first as Map<String, dynamic>;
        }
        if (stageRes['success'] == true && stageRes['currentStage'] != null) {
          final s = stageRes['currentStage'] as Map<String, dynamic>;
          if (s['name'] != null) _lifeStageName = s['name'].toString();
        }
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Could not sync dashboard data';
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryPurple),
        ),
      );
    }

    final userName = widget.user?.fullName.isNotEmpty == true
        ? widget.user!.fullName.split(' ').first
        : (widget.user?.username ?? 'Alex');

    return RefreshIndicator(
      color: AppTheme.primaryPurple,
      onRefresh: _fetchDashboardData,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_errorMessage != null)
              Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFFECACA)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline, color: Color(0xFFEF4444), size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _errorMessage!,
                        style: GoogleFonts.plusJakartaSans(fontSize: 12, color: const Color(0xFFB91C1C)),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, size: 16, color: Color(0xFFEF4444)),
                      onPressed: () => setState(() => _errorMessage = null),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                  ],
                ),
              ),

            // 1. HERO BANNER (Adapted from React website dashboard reference)
            _buildHeroBanner(userName),

            const SizedBox(height: 18),

            // 2. DAILY STATISTICS CARDS (Real backend metrics only)
            _buildSectionHeader(
              title: 'Today\'s Health Metrics',
              actionLabel: 'Connect Devices',
              onAction: widget.onOpenConnectDevices,
            ),
            const SizedBox(height: 10),
            _buildHealthConnectSyncBar(),
            const SizedBox(height: 12),
            _buildDailyStatisticsGrid(),

            const SizedBox(height: 22),

            // 3. MENSTRUAL CYCLE WIDGET
            _buildSectionHeader(
              title: 'Cycle Status',
              actionLabel: 'Full Calendar',
              onAction: widget.onOpenPeriodTracker,
            ),
            const SizedBox(height: 10),
            _buildMenstrualCycleWidget(),

            const SizedBox(height: 22),

            // 4. DAILY ACTIVITY / PRODUCTIVITY GRAPH
            _buildSectionHeader(
              title: 'Weekly Activity Trends',
              actionLabel: 'Log Activity',
              onAction: widget.onOpenConnectDevices,
            ),
            const SizedBox(height: 10),
            _buildActivityGraphCard(),

            const SizedBox(height: 22),

            // 5. UPCOMING APPOINTMENT SUMMARY (If any exists)
            _buildUpcomingAppointmentCard(),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  // ===========================================================================
  // SECTION HEADER
  // ===========================================================================
  Widget _buildSectionHeader({
    required String title,
    String? actionLabel,
    VoidCallback? onAction,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF201538),
            letterSpacing: -0.3,
          ),
        ),
        if (actionLabel != null && onAction != null)
          GestureDetector(
            onTap: onAction,
            child: Text(
              actionLabel,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppTheme.primaryPurple,
              ),
            ),
          ),
      ],
    );
  }

  // ===========================================================================
  // 1. HERO BANNER (React Dashboard Reference Theme)
  // ===========================================================================
  Widget _buildHeroBanner(String userName) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF201538), Color(0xFF2E1C4D), Color(0xFF3B1E63)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF201538).withValues(alpha: 0.2),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.auto_awesome, color: Color(0xFFFB7185), size: 14),
                    const SizedBox(width: 5),
                    Text(
                      _lifeStageName,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Health Score: $_healthScore',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF34D399),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Your Health is Balanced, $userName',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: -0.4,
              height: 1.25,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Track your daily circadian rhythms, hormonal cycle, and wearable biometrics in real time.',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: const Color(0xFFE9D5FF),
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  // ===========================================================================
  // 2. HEALTH CONNECT SYNC BAR & DAILY STATISTICS GRID
  // ===========================================================================
  Widget _buildHealthConnectSyncBar() {
    final hcSnap = _healthConnectService.snapshotNotifier.value;

    Color badgeBg;
    Color badgeText;
    String badgeLabel;
    IconData badgeIcon;

    if (hcSnap.status == HealthSyncStatus.synced) {
      badgeBg = const Color(0xFFECFDF5);
      badgeText = const Color(0xFF059669);
      badgeLabel = hcSnap.isBackendSynced ? 'Cloud Synced' : 'Local Only';
      badgeIcon = Icons.cloud_done_rounded;
    } else if (hcSnap.status == HealthSyncStatus.offlinePending) {
      badgeBg = const Color(0xFFFEF3C7);
      badgeText = const Color(0xFFD97706);
      badgeLabel = 'Saved Locally (Offline)';
      badgeIcon = Icons.cloud_off_rounded;
    } else if (hcSnap.status == HealthSyncStatus.zeppPending) {
      badgeBg = const Color(0xFFFFFBEB);
      badgeText = const Color(0xFFB45309);
      badgeLabel = 'Zepp Data Pending';
      badgeIcon = Icons.watch_later_outlined;
    } else if (hcSnap.status == HealthSyncStatus.permissionRequired) {
      badgeBg = const Color(0xFFFEF2F2);
      badgeText = const Color(0xFFDC2626);
      badgeLabel = 'Permission Needed';
      badgeIcon = Icons.lock_outline_rounded;
    } else if (hcSnap.status == HealthSyncStatus.notInstalled) {
      badgeBg = const Color(0xFFEFF6FF);
      badgeText = const Color(0xFF2563EB);
      badgeLabel = 'Setup Required';
      badgeIcon = Icons.download_rounded;
    } else {
      badgeBg = const Color(0xFFF3E8FF);
      badgeText = AppTheme.primaryPurple;
      badgeLabel = kIsWeb ? 'Web Cloud Mode' : 'Health Connect Ready';
      badgeIcon = Icons.sync_rounded;
    }

    String syncTimeStr = 'Not synced today';
    if (hcSnap.lastSyncTime != null) {
      syncTimeStr = 'Synced ${DateFormat('h:mm a').format(hcSnap.lastSyncTime!)}';
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFEFE8F7), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF201538).withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: AppTheme.primaryPurpleLight,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.watch_rounded, color: AppTheme.primaryPurple, size: 20),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            hcSnap.sourceName ?? 'Amazfit (via Zepp & Health Connect)',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: const Color(0xFF201538),
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: badgeBg,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(badgeIcon, size: 10, color: badgeText),
                              const SizedBox(width: 3),
                              Text(
                                badgeLabel,
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.w700,
                                  color: badgeText,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '$syncTimeStr • via Android Health Connect',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 11,
                        color: const Color(0xFF7A6F75),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton.icon(
                onPressed: _isSyncingHealthConnect ? null : _handleHealthConnectSync,
                icon: _isSyncingHealthConnect
                    ? const SizedBox(
                        width: 12,
                        height: 12,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Icon(Icons.sync_rounded, size: 14),
                label: Text(
                  _isSyncingHealthConnect
                      ? 'Syncing'
                      : (hcSnap.status == HealthSyncStatus.permissionRequired
                          ? 'Grant'
                          : 'Sync Health Data'),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryPurple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  visualDensity: VisualDensity.compact,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  textStyle: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          if (hcSnap.status == HealthSyncStatus.zeppPending) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFFFFBEB),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFFDE68A)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, size: 14, color: Color(0xFFD97706)),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'Zepp data not yet exported to Health Connect. Open Zepp on your phone to sync your watch, then tap Sync Health Data.',
                      style: GoogleFonts.plusJakartaSans(fontSize: 10.5, color: const Color(0xFF92400E)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDailyStatisticsGrid() {
    final hcSnap = _healthConnectService.snapshotNotifier.value;

    final steps = hcSnap.steps ??
        (_wearableSummary?['today_steps'] as num?) ??
        (_latestVitals?['steps'] as num?);

    final sleepMinutes = hcSnap.sleepMinutes ??
        (_wearableSummary?['today_sleep_minutes'] as num?) ??
        (_latestVitals?['sleep_hours'] != null
            ? ((_latestVitals!['sleep_hours'] as num) * 60).round()
            : null);

    final waterLiters = _latestVitals?['water_intake_liters'] as num? ??
        (_latestVitals?['water_intake_ml'] != null
            ? (_latestVitals!['water_intake_ml'] as num) / 1000.0
            : null);

    final heartRate = hcSnap.heartRate ??
        (_wearableSummary?['avg_heart_rate'] as num?) ??
        (_wearableTelemetry?['heart_rate'] as num?) ??
        (_latestVitals?['heart_rate'] as num?);

    final calories = hcSnap.calories ??
        (_wearableSummary?['today_calories'] as num?);

    final distanceMeters = hcSnap.distanceMeters ??
        (_wearableSummary?['today_distance_meters'] as num?)?.toDouble();

    final workoutSummary = hcSnap.workoutSummary;

    final hrTimestampStr = hcSnap.latestReadingTime != null
        ? (hcSnap.isHistorical
            ? 'Recorded ${DateFormat('h:mm a').format(hcSnap.latestReadingTime!)}'
            : 'Recent (${DateFormat('h:mm a').format(hcSnap.latestReadingTime!)})')
        : (heartRate != null ? 'Recorded reading' : null);

    final stepsSubtext = distanceMeters != null && distanceMeters > 0
        ? '${(distanceMeters / 1000.0).toStringAsFixed(2)} km walked'
        : null;

    final hrSubtext = hcSnap.restingHeartRate != null && hcSnap.restingHeartRate! > 0
        ? 'Resting: ${hcSnap.restingHeartRate} bpm'
        : hrTimestampStr;

    return LayoutBuilder(
      builder: (context, constraints) {
        final cardWidth = (constraints.maxWidth - 12) / 2;
        return Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            // CARD 1: Steps & Activity
            _buildStatCard(
              width: cardWidth,
              icon: Icons.directions_walk_rounded,
              iconBgColor: const Color(0xFFFFF1F2),
              iconColor: const Color(0xFFF43F5E),
              label: 'Steps & Activity',
              value: steps != null && steps > 0
                  ? NumberFormat('#,###').format(steps)
                  : null,
              unit: steps != null && steps > 0 ? 'steps' : null,
              subtext: stepsSubtext,
              emptyText: 'No steps recorded today',
              onTap: widget.onOpenConnectDevices,
            ),

            // CARD 2: Sleep Duration
            _buildStatCard(
              width: cardWidth,
              icon: Icons.nightlight_round,
              iconBgColor: const Color(0xFFF3E8FF),
              iconColor: const Color(0xFF9333EA),
              label: 'Sleep Duration',
              value: sleepMinutes != null && sleepMinutes > 0
                  ? '${(sleepMinutes ~/ 60)}h ${sleepMinutes % 60}m'
                  : null,
              unit: sleepMinutes != null && sleepMinutes > 0 ? 'logged' : null,
              subtext: sleepMinutes != null && sleepMinutes > 0 ? 'Zepp sleep session' : null,
              emptyText: 'No sleep recorded today',
              onTap: widget.onOpenConnectDevices,
            ),

            // CARD 3: Heart Rate
            _buildStatCard(
              width: cardWidth,
              icon: Icons.favorite_rounded,
              iconBgColor: const Color(0xFFFEF2F2),
              iconColor: const Color(0xFFEF4444),
              label: 'Heart Rate',
              value: heartRate != null && heartRate > 0
                  ? heartRate.round().toString()
                  : null,
              unit: heartRate != null && heartRate > 0 ? 'bpm' : null,
              subtext: hrSubtext,
              emptyText: 'No active HR data',
              onTap: widget.onOpenConnectDevices,
            ),

            // CARD 4: Calories Burned
            _buildStatCard(
              width: cardWidth,
              icon: Icons.local_fire_department_rounded,
              iconBgColor: const Color(0xFFFFF7ED),
              iconColor: const Color(0xFFF97316),
              label: 'Calories Burned',
              value: calories != null && calories > 0
                  ? NumberFormat('#,###').format(calories)
                  : null,
              unit: calories != null && calories > 0 ? 'kcal' : null,
              subtext: workoutSummary != null ? 'Activity: $workoutSummary' : null,
              emptyText: '0 kcal recorded today',
              onTap: widget.onOpenConnectDevices,
            ),

            // CARD 5: Water Intake
            _buildStatCard(
              width: cardWidth,
              icon: Icons.water_drop_rounded,
              iconBgColor: const Color(0xFFECFEFF),
              iconColor: const Color(0xFF06B6D4),
              label: 'Water Intake',
              value: waterLiters != null && waterLiters > 0
                  ? '${waterLiters.toStringAsFixed(1)} L'
                  : null,
              unit: waterLiters != null && waterLiters > 0
                  ? '(${(waterLiters * 4).round()} cups)'
                  : null,
              emptyText: '0 ml logged today',
              onTap: widget.onOpenConnectDevices,
            ),

            // CARD 6: Blood Oxygen (SpO2)
            _buildStatCard(
              width: cardWidth,
              icon: Icons.bloodtype_rounded,
              iconBgColor: const Color(0xFFEFF6FF),
              iconColor: const Color(0xFF3B82F6),
              label: 'Blood Oxygen (SpO2)',
              value: hcSnap.spo2 != null && hcSnap.spo2! > 0
                  ? '${hcSnap.spo2}'
                  : null,
              unit: hcSnap.spo2 != null && hcSnap.spo2! > 0 ? '%' : null,
              subtext: hcSnap.spo2 != null ? 'Normal range (95-100%)' : null,
              emptyText: 'No SpO2 recorded today',
              onTap: widget.onOpenConnectDevices,
            ),
          ],
        );
      },
    );
  }

  Widget _buildStatCard({
    required double width,
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
    required String label,
    required String? value,
    required String? unit,
    String? subtext,
    required String emptyText,
    required VoidCallback onTap,
  }) {
    final hasData = value != null;

    return Container(
      width: width,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1EBF9), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF201538).withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  color: iconBgColor,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: iconColor, size: 18),
              ),
              if (!hasData)
                GestureDetector(
                  onTap: onTap,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryPurpleLight,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '+ Log',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.primaryPurple,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF7A6F75),
            ),
          ),
          const SizedBox(height: 4),
          if (hasData) ...[
            Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(
                  value,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF201538),
                  ),
                ),
                if (unit != null) ...[
                  const SizedBox(width: 4),
                  Text(
                    unit,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF8E859E),
                    ),
                  ),
                ],
              ],
            ),
            if (subtext != null) ...[
              const SizedBox(height: 2),
              Text(
                subtext,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF9E92AB),
                ),
              ),
            ],
          ] else
            Text(
              emptyText,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: const Color(0xFFB3A9C4),
                fontStyle: FontStyle.italic,
              ),
            ),
        ],
      ),
    );
  }

  // ===========================================================================
  // 3. MENSTRUAL CYCLE WIDGET
  // ===========================================================================
  Widget _buildMenstrualCycleWidget() {
    final isConfigured = _periodOverview != null &&
        (_periodOverview!['isConfigured'] == true ||
            _periodOverview!['configured'] == true ||
            (_periodOverview!['settings'] is Map &&
                ((_periodOverview!['settings'] as Map)['isConfigured'] == true ||
                    (_periodOverview!['settings'] as Map)['is_configured'] == true)));
    final metrics = (_periodOverview?['metrics'] is Map<String, dynamic>)
        ? _periodOverview!['metrics'] as Map<String, dynamic>
        : <String, dynamic>{};

    final isPregnant = _periodOverview?['isPregnant'] == true;

    final cycleDay = metrics['cycleDay'] ?? 1;
    final cycleLength = metrics['cycleLength'] ?? 28;
    final phaseName = metrics['phaseName']?.toString() ?? 'Follicular Phase';
    final nextPeriodDateStr = metrics['nextPeriodDateStr']?.toString();
    final fertileWindowStr = metrics['fertileWindowStr']?.toString();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFF4DDE2), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFF43F5E).withValues(alpha: 0.04),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFFB7185), Color(0xFFF43F5E)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    isPregnant ? '🤰' : '🩸',
                    style: const TextStyle(fontSize: 20),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isPregnant
                          ? 'Maternity Companion'
                          : (isConfigured ? 'Day $cycleDay of $cycleLength' : 'Cycle Not Configured'),
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF201538),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      isPregnant ? 'Active Maternity Mode' : phaseName,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFFF43F5E),
                      ),
                    ),
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: widget.onOpenPeriodTracker,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFCF4F5),
                  foregroundColor: const Color(0xFFF43F5E),
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: const BorderSide(color: Color(0xFFF4DDE2)),
                  ),
                ),
                child: Text(
                  'Tracker',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(height: 1, color: Color(0xFFF8E7EB)),
          const SizedBox(height: 12),

          // Details row: Expected Next Period (clearly noted as Predicted vs Recorded)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Next Expected Period',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF7A6F75),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Text(
                        nextPeriodDateStr ?? 'Pending calibration',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF201538),
                        ),
                      ),
                      if (nextPeriodDateStr != null) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF3EEF9),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'Estimated',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 9,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.primaryPurple,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
              if (fertileWindowStr != null)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      'Fertile Window',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF7A6F75),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      fertileWindowStr,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF936DA2),
                      ),
                    ),
                  ],
                ),
            ],
          ),
        ],
      ),
    );
  }

  // ===========================================================================
  // 4. DAILY ACTIVITY OR PRODUCTIVITY GRAPH (fl_chart with REAL backend data)
  // ===========================================================================
  Widget _buildActivityGraphCard() {
    // Only use actual records from backend
    final validHistory = _activityHistory.where((item) {
      final steps = item['steps'] as num?;
      return steps != null && steps > 0;
    }).toList();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFF1EBF9), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF201538).withValues(alpha: 0.03),
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
              Text(
                'Recorded Daily Steps (Last 7 Days)',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF201538),
                ),
              ),
              if (validHistory.isNotEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F0FB),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '${validHistory.length} Days Recorded',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.primaryPurple,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),

          if (validHistory.isEmpty)
            // CLEAR EMPTY STATE: No fake/demo values
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
              decoration: BoxDecoration(
                color: const Color(0xFFFAF7FD),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFF1EBF9)),
              ),
              child: Column(
                children: [
                  const Icon(Icons.bar_chart_rounded, size: 36, color: Color(0xFFB3A9C4)),
                  const SizedBox(height: 8),
                  Text(
                    'No Weekly Activity Recorded',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF3A3135),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Connect a supported smartwatch or enter daily metrics manually to see your activity graph.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      color: const Color(0xFF7A6F75),
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: widget.onOpenConnectDevices,
                    icon: const Icon(Icons.add, size: 14),
                    label: const Text('Add Activity'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.primaryPurple,
                      side: const BorderSide(color: AppTheme.primaryPurple),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      textStyle: GoogleFonts.plusJakartaSans(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
            )
          else
            // REAL DATA LINE CHART
            SizedBox(
              height: 160,
              child: LineChart(
                LineChartData(
                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    horizontalInterval: 2500,
                    getDrawingHorizontalLine: (val) => FlLine(
                      color: const Color(0xFFF5F0FB),
                      strokeWidth: 1,
                    ),
                  ),
                  titlesData: FlTitlesData(
                    leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 24,
                        getTitlesWidget: (value, meta) {
                          final idx = value.toInt();
                          if (idx >= 0 && idx < _activityHistory.length) {
                            final rawDate = _activityHistory[idx]['date']?.toString() ?? '';
                            try {
                              final dt = DateTime.parse(rawDate);
                              return Text(
                                DateFormat('E').format(dt).substring(0, 1),
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w600,
                                  color: const Color(0xFF8E859E),
                                ),
                              );
                            } catch (_) {}
                          }
                          return const SizedBox.shrink();
                        },
                      ),
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  lineBarsData: [
                    LineChartBarData(
                      spots: _activityHistory.asMap().entries.map((entry) {
                        final idx = entry.key;
                        final val = (entry.value['steps'] as num?)?.toDouble() ?? 0.0;
                        return FlSpot(idx.toDouble(), val);
                      }).toList(),
                      isCurved: true,
                      color: const Color(0xFFFB7185),
                      barWidth: 3,
                      isStrokeCapRound: true,
                      dotData: const FlDotData(show: true),
                      belowBarData: BarAreaData(
                        show: true,
                        color: const Color(0xFFFB7185).withValues(alpha: 0.15),
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  // ===========================================================================
  // 5. UPCOMING APPOINTMENT SUMMARY CARD
  // ===========================================================================
  Widget _buildUpcomingAppointmentCard() {
    final scheduled = _appointments.where((a) {
      if (a is Map<String, dynamic>) {
        final status = a['status']?.toString().toLowerCase();
        return status == 'scheduled' || status == 'confirmed';
      }
      return false;
    }).toList();

    if (scheduled.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFF1EBF9)),
        ),
        child: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFFAF7FD),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.calendar_today_rounded, size: 18, color: AppTheme.primaryPurple),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'No Upcoming Consultations',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF201538),
                    ),
                  ),
                  Text(
                    'Schedule with a specialist gynecologist or endocrinologist.',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      color: const Color(0xFF7A6F75),
                    ),
                  ),
                ],
              ),
            ),
            TextButton(
              onPressed: widget.onOpenCareAndRecords,
              child: Text(
                'Book',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.primaryPurple,
                ),
              ),
            ),
          ],
        ),
      );
    }

    final nextAppt = scheduled.first as Map<String, dynamic>;
    final doctorName = nextAppt['doctor_name'] ?? nextAppt['doctor'] ?? 'Doctor Consultation';
    final apptDate = nextAppt['appointment_date'] ?? nextAppt['date'] ?? 'Upcoming';
    final apptTime = nextAppt['appointment_time'] ?? nextAppt['time'] ?? '';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFEDE4F7), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryPurple.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: AppTheme.primaryPurpleLight,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.medical_services_rounded, color: AppTheme.primaryPurple, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      doctorName.toString(),
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF201538),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                      decoration: BoxDecoration(
                        color: const Color(0xFFDCFCE7),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'Scheduled',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF15803D),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  '$apptDate ${apptTime.isNotEmpty ? "at $apptTime" : ""}',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF7A6F75),
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Color(0xFFB3A9C4)),
            onPressed: widget.onOpenCareAndRecords,
          ),
        ],
      ),
    );
  }
}
