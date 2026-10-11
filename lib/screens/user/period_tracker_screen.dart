import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../core/app_theme.dart';
import '../../services/api_service.dart';
import '../../models/period_tracker_model.dart';
import '../../widgets/period/circular_cycle_wheel.dart';

class PeriodTrackerScreen extends StatefulWidget {
  final VoidCallback? onBack;

  const PeriodTrackerScreen({super.key, this.onBack});

  @override
  State<PeriodTrackerScreen> createState() => _PeriodTrackerScreenState();
}

class _PeriodTrackerScreenState extends State<PeriodTrackerScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  bool _isLoading = true;
  String? _errorMessage;

  // Backend Data State
  bool _isConfigured = false;
  PeriodSettingsModel? _settings;
  CyclePredictionModel? _predictions;
  CycleStatisticsModel? _historicalStats;
  List<PeriodCycleModel> _cycleHistory = [];
  List<DailyLogModel> _dailyLogs = [];
  DailyLogModel? _todayLog;
  Map<String, dynamic>? _insightsData;

  // Maternity State
  bool _isPregnant = false;
  int _gestationalWeeks = 14;
  int _gestationalDays = 2;
  int _daysRemaining = 180;
  String _eddDate = '';
  String _trimesterName = 'Second Trimester';
  String _babySize = 'Lemon (~8.7 cm)';
  String _babyIcon = '🍋';
  int _kickCount = 0;

  // Cycle Phase display
  int _cycleDay = 1;
  int _cycleLength = 28;
  int _periodDuration = 5;
  String _phaseName = 'Luteal Phase';
  String _nextPeriodDateStr = '';
  String _ovulationDateStr = '';
  String _fertileWindowStr = '';
  bool _isDelayed = false;
  int _daysDelayed = 0;
  String _affirmation = '';

  // Calendar State
  DateTime _currentCalendarMonth = DateTime.now();
  String _selectedCalendarDate = DateFormat('yyyy-MM-dd').format(DateTime.now());

  // Reminders Form State
  int _reminderDaysBefore = 2;
  bool _reminderPeriodEnabled = true;
  bool _reminderOvulationEnabled = false;
  bool _reminderDailyLoggingEnabled = false;
  bool _isSavingReminders = false;

  final List<String> _availableSymptoms = [
    'Cramps', 'Headaches', 'Bloating', 'Breast Tenderness',
    'Fatigue', 'Lower Back Ache', 'Acne', 'Mood Swings',
    'Nausea', 'Sweet Cravings', 'Pelvic Pain', 'Insomnia'
  ];

  final List<String> _moodOptions = ['Calm', 'Happy', 'Energetic', 'Sensitive', 'Irritable', 'Anxious', 'Low Energy'];
  final List<String> _energyOptions = ['High', 'Medium', 'Low', 'Exhausted'];
  final List<String> _sleepOptions = ['Restful', 'Good', 'Interrupted', 'Insomnia'];
  final List<String> _mucusOptions = ['None', 'Dry', 'Sticky', 'Creamy', 'Egg White (Fertile)', 'Watery'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _tabController.addListener(() {
      if (_tabController.index == 3 && _insightsData == null) {
        _loadInsights();
      }
    });
    _fetchPeriodData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _fetchPeriodData({bool isSilent = false}) async {
    if (!isSilent) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });
    }

    try {
      final data = await ApiService.getPeriodOverview();
      if (data['success'] == true) {
        _isConfigured = data['isConfigured'] == true ||
            data['configured'] == true ||
            (data['settings'] != null &&
                (data['settings']['isConfigured'] == true ||
                    data['settings']['is_configured'] == true));

        if (data['settings'] != null) {
          _settings = PeriodSettingsModel.fromJson(data['settings']);
          _isPregnant = _settings!.isPregnant;
          _reminderDaysBefore = _settings!.reminderPeriodDaysBefore;
          _reminderPeriodEnabled = _settings!.reminderPeriodEnabled;
          _reminderOvulationEnabled = _settings!.reminderOvulationEnabled;
          _reminderDailyLoggingEnabled = _settings!.reminderDailyLoggingEnabled;
        }

        if (data['metrics'] != null) {
          final m = data['metrics'];
          _cycleDay = int.tryParse(m['cycleDay']?.toString() ?? '') ?? 1;
          _cycleLength = int.tryParse(m['cycleLength']?.toString() ?? '') ?? 28;
          _periodDuration = int.tryParse(m['periodDuration']?.toString() ?? '') ?? 5;
          _phaseName = m['phaseName']?.toString() ?? 'Luteal Phase';
          _nextPeriodDateStr = m['nextPeriodDateStr']?.toString() ?? '';
          _ovulationDateStr = m['ovulationDateStr']?.toString() ?? '';
          _fertileWindowStr = m['fertileWindowStr']?.toString() ?? '';
          _isDelayed = m['isDelayed'] == true;
          _daysDelayed = int.tryParse(m['daysDelayed']?.toString() ?? '') ?? 0;

          if (m['isPregnant'] == true) {
            _isPregnant = true;
            _gestationalWeeks = int.tryParse(m['gestationalWeeks']?.toString() ?? '') ?? 14;
            _gestationalDays = int.tryParse(m['gestationalDays']?.toString() ?? '') ?? 2;
            _daysRemaining = int.tryParse(m['daysRemaining']?.toString() ?? '') ?? 180;
            _eddDate = m['edd']?.toString() ?? '';
            _trimesterName = m['trimesterName']?.toString() ?? 'Second Trimester';
            _babySize = m['babySize']?.toString() ?? 'Lemon';
            _babyIcon = m['babyIcon']?.toString() ?? '🍋';
          }
        }

        if (data['predictions'] != null || data['prediction'] != null) {
          _predictions = CyclePredictionModel.fromJson(data['predictions'] ?? data['prediction']);
        }

        if (data['historicalStats'] != null) {
          _historicalStats = CycleStatisticsModel.fromJson(data['historicalStats']);
        }

        if (data['cycleHistory'] is List) {
          _cycleHistory = (data['cycleHistory'] as List)
              .map((c) => PeriodCycleModel.fromJson(c))
              .toList();
        }

        if (data['todayLog'] != null) {
          _todayLog = DailyLogModel.fromJson(data['todayLog']);
        }

        _affirmation = data['affirmation']?.toString() ?? 'Your body is performing restorative biological work.';

        // Load daily logs for current calendar month
        final monthStr = DateFormat('yyyy-MM').format(_currentCalendarMonth);
        final logsList = await ApiService.getDailyLogs(month: monthStr);
        _dailyLogs = logsList.map((d) => DailyLogModel.fromJson(d)).toList();
      } else if (data['message'] != null) {
        _errorMessage = data['message'].toString();
      }
    } catch (e) {
      _errorMessage = 'Failed to load period tracker records: $e';
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _loadInsights() async {
    try {
      final res = await ApiService.getPeriodInsights();
      if (res['success'] == true) {
        if (mounted) {
          setState(() => _insightsData = res);
        }
      }
    } catch (_) {}
  }

  Future<void> _loadMonthLogs(DateTime month) async {
    final monthStr = DateFormat('yyyy-MM').format(month);
    try {
      final logsList = await ApiService.getDailyLogs(month: monthStr);
      if (mounted) {
        setState(() {
          _currentCalendarMonth = month;
          _dailyLogs = logsList.map((d) => DailyLogModel.fromJson(d)).toList();
        });
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: widget.onBack != null
            ? IconButton(
                icon: const Icon(Icons.arrow_back, color: AppTheme.textDark),
                onPressed: widget.onBack,
              )
            : null,
        title: const Row(
          children: [
            Icon(Icons.water_drop, color: Color(0xFFF43F5E), size: 20),
            SizedBox(width: 8),
            Text(
              'Period Tracker',
              style: TextStyle(
                color: AppTheme.textDark,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppTheme.primaryPurple),
            onPressed: _fetchPeriodData,
            tooltip: 'Sync with Database',
          ),
          if (_isConfigured && !_isPregnant)
            IconButton(
              icon: const Icon(Icons.tune, color: AppTheme.primaryPurple),
              onPressed: _showBaselineSetupDialog,
              tooltip: 'Adjust Baseline',
            ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: AppTheme.primaryPurple,
          unselectedLabelColor: Colors.grey,
          indicatorColor: AppTheme.primaryPurple,
          indicatorWeight: 3,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          tabs: const [
            Tab(text: 'Cycle Wheel', icon: Icon(Icons.incomplete_circle, size: 18)),
            Tab(text: 'Calendar', icon: Icon(Icons.calendar_month, size: 18)),
            Tab(text: 'Records', icon: Icon(Icons.history, size: 18)),
            Tab(text: 'Trends', icon: Icon(Icons.insights, size: 18)),
            Tab(text: 'Reminders', icon: Icon(Icons.notifications_active, size: 18)),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryPurple))
          : _errorMessage != null
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.error_outline, size: 48, color: Colors.red),
                        const SizedBox(height: 12),
                        Text(_errorMessage!, textAlign: TextAlign.center, style: const TextStyle(color: Colors.red)),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _fetchPeriodData,
                          style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryPurple),
                          child: const Text('Retry', style: TextStyle(color: Colors.white)),
                        ),
                      ],
                    ),
                  ),
                )
              : !_isConfigured
                  ? _buildUnconfiguredState()
                  : _isPregnant
                      ? _buildMaternityView()
                      : TabBarView(
                          controller: _tabController,
                          children: [
                            _buildCycleWheelTab(),
                            _buildCalendarTab(),
                            _buildHistoryTab(),
                            _buildInsightsTab(),
                            _buildRemindersTab(),
                          ],
                        ),
    );
  }

  // =========================================================================
  // 1. UNCONFIGURED ONBOARDING STATE
  // =========================================================================
  Widget _buildUnconfiguredState() {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Container(
          padding: const EdgeInsets.all(28),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFFEDE9FE)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: const Color(0xFFFAF5FF),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE9D5FF)),
                ),
                child: const Icon(Icons.calendar_today, size: 30, color: AppTheme.primaryPurple),
              ),
              const SizedBox(height: 16),
              const Text(
                'Set Up Your Cycle Baseline',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textDark,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Tell us the start date of your last period and typical cycle length. Our algorithm will calculate your cycle day, predict upcoming phases, and track fertile windows.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: Colors.grey, height: 1.4),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                icon: const Icon(Icons.play_arrow, size: 18),
                label: const Text('Start Baseline Setup', style: TextStyle(fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryPurple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: _showBaselineSetupDialog,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // 2. MATERNITY VIEW (WHEN PREGNANT)
  // =========================================================================
  Widget _buildMaternityView() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFDDD6FE)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('🤰 Maternity & Fetal Hub', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryPurpleLight,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE9D5FF)),
                      ),
                      child: const Text('Cycle Paused', style: TextStyle(color: AppTheme.primaryPurple, fontWeight: FontWeight.bold, fontSize: 11)),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                Center(
                  child: Container(
                    width: 140,
                    height: 140,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [AppTheme.accentPink, AppTheme.primaryPurple],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.primaryPurple.withOpacity(0.3),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        )
                      ],
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('GESTATIONAL AGE', style: TextStyle(color: Colors.white70, fontSize: 9, fontWeight: FontWeight.bold)),
                          Text('$_gestationalWeeks w', style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900)),
                          Text('+ $_gestationalDays Days', style: const TextStyle(color: Colors.white, fontSize: 11)),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

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
                            const Text('ESTIMATED DUE DATE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                            const SizedBox(height: 4),
                            Text(_eddDate, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.textDark)),
                            Text('$_daysRemaining days remaining', style: const TextStyle(fontSize: 10, color: AppTheme.primaryPurple, fontWeight: FontWeight.w600)),
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
                            const Text('BABY SIZE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                            const SizedBox(height: 4),
                            Text('$_babyIcon $_babySize', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.textDark)),
                            Text(_trimesterName, style: const TextStyle(fontSize: 10, color: Color(0xFF10B981), fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),

                // Kick Counter
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFAF8FC),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFE9D5FF)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Daily Kick Counter', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                          const SizedBox(height: 2),
                          Text('$_kickCount / 10 movements felt today', style: const TextStyle(fontSize: 11, color: AppTheme.primaryPurple, fontWeight: FontWeight.w600)),
                        ],
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.refresh, size: 20, color: Colors.grey),
                            onPressed: () => setState(() => _kickCount = 0),
                            tooltip: 'Reset kicks',
                          ),
                          ElevatedButton.icon(
                            icon: const Text('👣', style: TextStyle(fontSize: 14)),
                            label: const Text('+ Kick', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primaryPurple,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            onPressed: () => setState(() => _kickCount = (_kickCount + 1).clamp(0, 30)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Resume Menstrual Cycle Button
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.rotate_left, size: 16, color: Color(0xFFF43F5E)),
                    label: const Text('Conclude Maternity Mode / Resume Period', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFF43F5E))),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFFFECDD3)),
                      backgroundColor: const Color(0xFFFFF1F2),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    onPressed: _showResumeCycleDialog,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // 3. TAB 1: CYCLE WHEEL
  // =========================================================================
  Widget _buildCycleWheelTab() {
    // Collect day indices with logged symptoms for inner dots
    final List<int> loggedIndices = [];
    if (_settings != null && _settings!.lastPeriodStart.isNotEmpty) {
      try {
        final start = DateTime.parse(_settings!.lastPeriodStart);
        for (final log in _dailyLogs) {
          final logD = DateTime.parse(log.date);
          final diff = logD.difference(start).inDays;
          if (diff >= 0 && diff < _cycleLength) {
            loggedIndices.add(diff);
          }
        }
      } catch (_) {}
    }

    final todayFormatted = DateFormat('yyyy-MM-dd').format(DateTime.now());

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Circular Wheel Container Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: const Color(0xFFEDE9FE)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.03),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                )
              ],
            ),
            child: CircularCycleWheel(
              cycleDay: _cycleDay,
              cycleLength: _cycleLength,
              periodDuration: _periodDuration,
              isDelayed: _isDelayed,
              daysDelayed: _daysDelayed,
              daysUntilPeriod: _predictions?.daysUntilPeriod ?? (_cycleLength - _cycleDay).clamp(0, 99),
              phaseName: _phaseName,
              todayStatusText: _todayLog != null
                  ? 'Logged: ${_todayLog!.mood} • ${_todayLog!.symptoms.length} symptoms recorded'
                  : 'Tap to log flow, mood, energy & cramps',
              loggedDayIndices: loggedIndices,
              onHowDoYouFeelTap: () => _openDailyLogSheet(todayFormatted),
            ),
          ),

          const SizedBox(height: 16),

          // Key Biological Dates Grid
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFAF5FF),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFE9D5FF)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('NEXT PERIOD', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                      const SizedBox(height: 4),
                      Text(
                        _predictions?.nextPeriodStartDate ?? _nextPeriodDateStr,
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: AppTheme.primaryPurple),
                      ),
                      Text('$_cycleLength-day cadence', style: const TextStyle(fontSize: 10, color: Colors.grey)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0FDF4),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFBBF7D0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('ESTIMATED OVULATION', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                      const SizedBox(height: 4),
                      Text(
                        _predictions?.estimatedOvulationDate ?? _ovulationDateStr,
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13, color: Color(0xFF0D9488)),
                      ),
                      Text(
                        _predictions?.fertileWindowStartDate != null
                            ? 'Fertile: ${_predictions!.fertileWindowStartDate} - ${_predictions!.fertileWindowEndDate}'
                            : (_fertileWindowStr.isNotEmpty ? _fertileWindowStr : 'Fertile peak estimate'),
                        style: const TextStyle(fontSize: 10, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Delay Calibration Card (if running late)
          if (_isDelayed) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFFFFBEB),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFFDE68A)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.schedule, color: Color(0xFFD97706), size: 24),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Cycle Delayed (+$_daysDelayed Days)',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF92400E)),
                        ),
                        const Text(
                          'You can extend your expected cycle length to calibrate predictions.',
                          style: TextStyle(fontSize: 10, color: Color(0xFFB45309)),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: _showDelayCalibrationDialog,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFD97706),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Calibrate', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Wellness Affirmation Box
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFEDE9FE)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF43F5E),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Center(child: Text('♥', style: TextStyle(color: Colors.white, fontSize: 16))),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Gentle Affirmation',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.textDark),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '"$_affirmation"',
                        style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Colors.grey, height: 1.4),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Clinical Safety Disclaimer
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFFAF5FF),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE9D5FF)),
            ),
            child: const Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.info_outline, size: 16, color: AppTheme.primaryPurple),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Clinical Disclaimer: Calendar calculations and ovulation dates are statistical estimations. Biological timing varies naturally. Do not use calendar calculations as a method of contraception.',
                    style: TextStyle(fontSize: 10, color: Color(0xFF6B21A8), height: 1.3),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // 4. TAB 2: INTERACTIVE MENSTRUAL CALENDAR
  // =========================================================================
  Widget _buildCalendarTab() {
    final year = _currentCalendarMonth.year;
    final month = _currentCalendarMonth.month;
    final firstDay = DateTime(year, month, 1);
    final lastDay = DateTime(year, month + 1, 0);
    final daysInMonth = lastDay.day;
    final startWeekday = firstDay.weekday % 7; // 0 = Sun

    // Build recorded and predicted dates sets
    final recordedDates = <String>{};
    for (final cycle in _cycleHistory) {
      try {
        final start = DateTime.parse(cycle.startDate);
        for (int i = 0; i < cycle.durationDays; i++) {
          final d = start.add(Duration(days: i));
          recordedDates.add(DateFormat('yyyy-MM-dd').format(d));
        }
      } catch (_) {}
    }
    for (final log in _dailyLogs) {
      if (log.isPeriodDay) {
        recordedDates.add(log.date);
      }
    }

    final predictedDates = <String>{};
    if (_predictions?.nextPeriodStartDate != null) {
      try {
        final predStart = DateTime.parse(_predictions!.nextPeriodStartDate!);
        for (int i = 0; i < _predictions!.estimatedPeriodDuration; i++) {
          final d = predStart.add(Duration(days: i));
          final str = DateFormat('yyyy-MM-dd').format(d);
          if (!recordedDates.contains(str)) {
            predictedDates.add(str);
          }
        }
      } catch (_) {}
    }

    final fertileDates = <String>{};
    if (_predictions?.fertileWindowStartDate != null && _predictions?.fertileWindowEndDate != null) {
      try {
        final fStart = DateTime.parse(_predictions!.fertileWindowStartDate!);
        final fEnd = DateTime.parse(_predictions!.fertileWindowEndDate!);
        var cur = fStart;
        while (!cur.isAfter(fEnd)) {
          fertileDates.add(DateFormat('yyyy-MM-dd').format(cur));
          cur = cur.add(const Duration(days: 1));
        }
      } catch (_) {}
    }

    final todayStr = DateFormat('yyyy-MM-dd').format(DateTime.now());

    // Selected date details
    final selectedLog = _dailyLogs.where((l) => l.date == _selectedCalendarDate).firstOrNull;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFEDE9FE)),
            ),
            child: Column(
              children: [
                // Month Header Controls
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      DateFormat('MMMM yyyy').format(_currentCalendarMonth),
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.chevron_left, size: 22),
                          onPressed: () {
                            _loadMonthLogs(DateTime(year, month - 1, 1));
                          },
                        ),
                        IconButton(
                          icon: const Icon(Icons.chevron_right, size: 22),
                          onPressed: () {
                            _loadMonthLogs(DateTime(year, month + 1, 1));
                          },
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 12),

                // Weekday Headers
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) {
                    return SizedBox(
                      width: 36,
                      child: Center(
                        child: Text(
                          d,
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey),
                        ),
                      ),
                    );
                  }).toList(),
                ),

                const SizedBox(height: 8),

                // Calendar Grid
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: startWeekday + daysInMonth,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 7,
                    childAspectRatio: 1.0,
                    crossAxisSpacing: 4,
                    mainAxisSpacing: 4,
                  ),
                  itemBuilder: (context, index) {
                    if (index < startWeekday) {
                      return const SizedBox();
                    }

                    final dayNum = index - startWeekday + 1;
                    final dateStr = DateFormat('yyyy-MM-dd').format(DateTime(year, month, dayNum));
                    final isSelected = dateStr == _selectedCalendarDate;
                    final isToday = dateStr == todayStr;
                    final isRecorded = recordedDates.contains(dateStr);
                    final isPredicted = predictedDates.contains(dateStr);
                    final isFertile = fertileDates.contains(dateStr);
                    final isOvulation = _predictions?.estimatedOvulationDate == dateStr;
                    final hasLog = _dailyLogs.any((l) => l.date == dateStr);

                    return GestureDetector(
                      onTap: () {
                        setState(() => _selectedCalendarDate = dateStr);
                      },
                      child: Container(
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xFFFAF5FF)
                              : isRecorded
                                  ? const Color(0xFFFFF1F2)
                                  : isFertile
                                      ? const Color(0xFFF0FDF4)
                                      : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isSelected
                                ? AppTheme.primaryPurple
                                : isToday
                                    ? const Color(0xFFDDD6FE)
                                    : Colors.transparent,
                            width: isSelected ? 2 : 1,
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              '$dayNum',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: isRecorded || isToday ? FontWeight.w900 : FontWeight.bold,
                                color: isRecorded
                                    ? const Color(0xFFE11D48)
                                    : isToday
                                        ? AppTheme.primaryPurple
                                        : AppTheme.textDark,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                if (isRecorded)
                                  Container(
                                    width: 5,
                                    height: 5,
                                    decoration: const BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: Color(0xFFE11D48),
                                    ),
                                  )
                                else if (isPredicted)
                                  Container(
                                    width: 5,
                                    height: 5,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(color: const Color(0xFFF43F5E), width: 1),
                                    ),
                                  )
                                else if (isOvulation)
                                  Container(
                                    width: 5,
                                    height: 5,
                                    decoration: const BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: Color(0xFF0D9488),
                                    ),
                                  ),
                                if (hasLog) ...[
                                  const SizedBox(width: 2),
                                  Container(
                                    width: 4,
                                    height: 4,
                                    decoration: const BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: AppTheme.primaryPurple,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),

                const SizedBox(height: 16),

                // Calendar Legend
                Wrap(
                  spacing: 12,
                  runSpacing: 6,
                  children: [
                    _buildLegendItem(const Color(0xFFE11D48), 'Recorded Period'),
                    _buildLegendItem(const Color(0xFFFDA4AF), 'Predicted Period'),
                    _buildLegendItem(const Color(0xFF0D9488), 'Fertile / Ovulation'),
                    _buildLegendItem(AppTheme.primaryPurple, 'Symptoms Logged'),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Selected Day Details Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFEDE9FE)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Selected Date', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                        Text(
                          _selectedCalendarDate,
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                        ),
                      ],
                    ),
                    ElevatedButton.icon(
                      icon: const Icon(Icons.edit_note, size: 16),
                      label: Text(selectedLog != null ? 'Edit Log' : 'Log Day', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryPurple,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () => _openDailyLogSheet(_selectedCalendarDate),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                if (selectedLog != null) ...[
                  Row(
                    children: [
                      _buildMiniBadge('Mood', selectedLog.mood, const Color(0xFFFAF5FF), AppTheme.primaryPurple),
                      const SizedBox(width: 8),
                      _buildMiniBadge('Flow', selectedLog.flowIntensity, const Color(0xFFFFF1F2), const Color(0xFFE11D48)),
                      const SizedBox(width: 8),
                      _buildMiniBadge('Energy', selectedLog.energyLevel, const Color(0xFFF0FDF4), const Color(0xFF0D9488)),
                    ],
                  ),
                  if (selectedLog.symptoms.isNotEmpty) ...[
                    const SizedBox(height: 10),
                    const Text('Symptoms:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                    const SizedBox(height: 4),
                    Wrap(
                      spacing: 6,
                      runSpacing: 4,
                      children: selectedLog.symptoms.map((s) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF5F3FF),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(s, style: const TextStyle(fontSize: 10, color: AppTheme.primaryPurple, fontWeight: FontWeight.w600)),
                        );
                      }).toList(),
                    ),
                  ],
                  if (selectedLog.notes.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text('"${selectedLog.notes}"', style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Colors.grey)),
                  ],
                ] else ...[
                  const Text(
                    'No health log recorded for this date. Tap "Log Day" to record flow, cramps, mood & energy.',
                    style: TextStyle(fontSize: 11, color: Colors.grey),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(Color color, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(shape: BoxShape.circle, color: color),
        ),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.w600)),
      ],
    );
  }

  Widget _buildMiniBadge(String label, String value, Color bg, Color textCol) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 8, color: Colors.grey, fontWeight: FontWeight.bold)),
          Text(value, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: textCol)),
        ],
      ),
    );
  }

  // =========================================================================
  // 5. TAB 3: RECORDED CYCLES HISTORY (EDIT & DELETE)
  // =========================================================================
  Widget _buildHistoryTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Recorded Menstrual Cycles',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
              ),
              ElevatedButton.icon(
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Log Past Cycle', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryPurple,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
                onPressed: _showLogCycleDialog,
              ),
            ],
          ),

          const SizedBox(height: 12),

          if (_cycleHistory.isEmpty)
            Container(
              padding: const EdgeInsets.all(32),
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFEDE9FE)),
              ),
              child: const Column(
                children: [
                  Icon(Icons.history, size: 40, color: Colors.grey),
                  SizedBox(height: 8),
                  Text('No recorded cycles yet', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                  SizedBox(height: 4),
                  Text('Tap "Log Past Cycle" to record your history.', style: TextStyle(fontSize: 11, color: Colors.grey)),
                ],
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _cycleHistory.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final cycle = _cycleHistory[index];
                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFEDE9FE)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF1F2),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(Icons.water_drop, color: Color(0xFFF43F5E), size: 22),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              cycle.startDate,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${cycle.durationDays} days bleeding • ${cycle.cycleLengthDays} days gap',
                              style: const TextStyle(fontSize: 11, color: Colors.grey),
                            ),
                            Text(
                              'Flow: ${cycle.flowIntensity}',
                              style: const TextStyle(fontSize: 10, color: AppTheme.primaryPurple, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit_outlined, size: 20, color: AppTheme.primaryPurple),
                            onPressed: () => _showEditCycleDialog(cycle),
                            tooltip: 'Edit Cycle',
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, size: 20, color: Colors.red),
                            onPressed: () => _confirmDeleteCycle(cycle.id),
                            tooltip: 'Delete Cycle',
                          ),
                        ],
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

  // =========================================================================
  // 6. TAB 4: HEALTH INSIGHTS & CHARTS
  // =========================================================================
  Widget _buildInsightsTab() {
    final avgCycle = _historicalStats?.averageCycleLength ?? _cycleLength;
    final avgDuration = _historicalStats?.averagePeriodDuration ?? _periodDuration;
    final variability = _historicalStats?.cycleVariabilityDays ?? 0;
    final isIrregular = _historicalStats?.isIrregular ?? false;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stat Highlights
          Row(
            children: [
              Expanded(
                child: _buildInsightStatCard('AVG CYCLE', '$avgCycle Days', 'Calculated from gap', AppTheme.primaryPurple),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildInsightStatCard('AVG DURATION', '$avgDuration Days', 'Bleeding duration', const Color(0xFFF43F5E)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildInsightStatCard('VARIABILITY', '±$variability Days', isIrregular ? 'Irregular' : 'Consistent', const Color(0xFF0D9488)),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Cycle Length Trends Bar Chart
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFEDE9FE)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Cycle Length Trends', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark)),
                const Text('Historical days between period starts', style: TextStyle(fontSize: 10, color: Colors.grey)),
                const SizedBox(height: 20),

                if (_cycleHistory.length < 2)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 24),
                      child: Text('Record at least 2 cycles to generate cycle length trends.', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    ),
                  )
                else
                  SizedBox(
                    height: 140,
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: _cycleHistory.reversed.take(6).toList().reversed.map((c) {
                        final len = c.cycleLengthDays.clamp(20, 45);
                        final heightPct = ((len - 15) / 30).clamp(0.2, 1.0);

                        return Column(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Text('${c.cycleLengthDays}d', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.primaryPurple)),
                            const SizedBox(height: 4),
                            Container(
                              width: 28,
                              height: 100 * heightPct,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [AppTheme.accentPink, AppTheme.primaryPurple],
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(c.startDate.length >= 7 ? c.startDate.substring(5) : c.startDate, style: const TextStyle(fontSize: 9, color: Colors.grey)),
                          ],
                        );
                      }).toList(),
                    ),
                  ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Top Symptoms
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFEDE9FE)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Most Frequent Symptoms', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark)),
                const Text('Reported across your cycles and daily logs', style: TextStyle(fontSize: 10, color: Colors.grey)),
                const SizedBox(height: 12),

                if (_insightsData?['trends']?['topSymptoms'] is List && (_insightsData!['trends']['topSymptoms'] as List).isNotEmpty)
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: (_insightsData!['trends']['topSymptoms'] as List).map<Widget>((item) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFAF5FF),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFE9D5FF)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(item['name'] ?? '', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(color: AppTheme.primaryPurple, borderRadius: BorderRadius.circular(8)),
                              child: Text('${item['count']}x', style: const TextStyle(fontSize: 9, color: Colors.white, fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  )
                else
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 12),
                    child: Text('Log daily symptoms to build your personal symptom frequency profile.', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInsightStatCard(String title, String val, String sub, Color col) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFEDE9FE)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.grey)),
          const SizedBox(height: 4),
          Text(val, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: col)),
          const SizedBox(height: 2),
          Text(sub, style: const TextStyle(fontSize: 8, color: Colors.grey)),
        ],
      ),
    );
  }

  // =========================================================================
  // 7. TAB 5: REMINDERS & SETTINGS
  // =========================================================================
  Widget _buildRemindersTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFEDE9FE)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Period & Cycle Reminders', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                const Text('Configure notifications for upcoming periods and tracking', style: TextStyle(fontSize: 11, color: Colors.grey)),
                const SizedBox(height: 20),

                SwitchListTile(
                  title: const Text('Upcoming Period Reminder', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                  subtitle: const Text('Alert me before estimated period start', style: TextStyle(fontSize: 10, color: Colors.grey)),
                  value: _reminderPeriodEnabled,
                  activeColor: AppTheme.primaryPurple,
                  contentPadding: EdgeInsets.zero,
                  onChanged: (val) => setState(() => _reminderPeriodEnabled = val),
                ),

                if (_reminderPeriodEnabled) ...[
                  const SizedBox(height: 8),
                  const Text('Days before estimated period:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                  const SizedBox(height: 8),
                  Row(
                    children: [1, 2, 3, 5].map((d) {
                      final isSel = _reminderDaysBefore == d;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text('$d Days', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isSel ? Colors.white : AppTheme.textDark)),
                          selected: isSel,
                          selectedColor: AppTheme.primaryPurple,
                          backgroundColor: const Color(0xFFFAF8FC),
                          onSelected: (_) => setState(() => _reminderDaysBefore = d),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 12),
                ],

                const Divider(),

                SwitchListTile(
                  title: const Text('Estimated Ovulation Reminder', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                  subtitle: const Text('Notify during peak estimated fertile window', style: TextStyle(fontSize: 10, color: Colors.grey)),
                  value: _reminderOvulationEnabled,
                  activeColor: AppTheme.primaryPurple,
                  contentPadding: EdgeInsets.zero,
                  onChanged: (val) => setState(() => _reminderOvulationEnabled = val),
                ),

                const Divider(),

                SwitchListTile(
                  title: const Text('Daily Health Logging Prompt', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                  subtitle: const Text('Evening reminder to log mood & physical symptoms', style: TextStyle(fontSize: 10, color: Colors.grey)),
                  value: _reminderDailyLoggingEnabled,
                  activeColor: AppTheme.primaryPurple,
                  contentPadding: EdgeInsets.zero,
                  onChanged: (val) => setState(() => _reminderDailyLoggingEnabled = val),
                ),

                const SizedBox(height: 16),

                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _isSavingReminders ? null : _saveReminders,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryPurple,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: _isSavingReminders
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Text('Save Reminder Settings', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Positive Pregnancy Test Button
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: const Color(0xFFFAF5FF),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE9D5FF)),
            ),
            child: Row(
              children: [
                const Text('🤰', style: TextStyle(fontSize: 26)),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Positive Pregnancy Test?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark)),
                      Text('Switch to Maternity Mode to pause menstrual calculations and track fetal development.', style: TextStyle(fontSize: 10, color: Colors.grey)),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: _showPregnancyActivationDialog,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryPurple,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  ),
                  child: const Text('Activate', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // =========================================================================
  // DIALOGS & BOTTOM SHEETS
  // =========================================================================

  Future<void> _saveReminders() async {
    setState(() => _isSavingReminders = true);
    try {
      final res = await ApiService.updatePeriodSettings({
        'reminderPeriodDaysBefore': _reminderDaysBefore,
        'reminderPeriodEnabled': _reminderPeriodEnabled,
        'reminderOvulationEnabled': _reminderOvulationEnabled,
        'reminderDailyLoggingEnabled': _reminderDailyLoggingEnabled,
      });
      if (res['success'] == true && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Reminder preferences updated successfully.')),
        );
      }
    } catch (_) {} finally {
      if (mounted) setState(() => _isSavingReminders = false);
    }
  }

  // Daily Logging Bottom Sheet
  void _openDailyLogSheet(String dateStr) {
    final existing = _dailyLogs.where((l) => l.date == dateStr).firstOrNull;

    bool isPeriod = existing?.isPeriodDay ?? false;
    String flow = existing?.flowIntensity ?? (isPeriod ? 'Medium' : 'None');
    String mood = existing?.mood ?? 'Calm';
    String energy = existing?.energyLevel ?? 'Medium';
    String sleep = existing?.sleepQuality ?? 'Good';
    String mucus = existing?.cervicalMucus ?? 'None';
    String notes = existing?.notes ?? '';
    List<String> symptoms = List.from(existing?.symptoms ?? []);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Daily Health Log • $dateStr', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                        IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                      ],
                    ),

                    const SizedBox(height: 12),

                    // Flow Intensity
                    SwitchListTile(
                      title: const Text('Menstrual Bleeding Day', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                      value: isPeriod,
                      activeColor: const Color(0xFFF43F5E),
                      contentPadding: EdgeInsets.zero,
                      onChanged: (val) {
                        setSheetState(() {
                          isPeriod = val;
                          if (val && flow == 'None') flow = 'Medium';
                        });
                      },
                    ),

                    if (isPeriod) ...[
                      const SizedBox(height: 6),
                      Row(
                        children: ['Spotting', 'Light', 'Medium', 'Heavy'].map((f) {
                          final isSel = flow == f;
                          return Padding(
                            padding: const EdgeInsets.only(right: 6),
                            child: ChoiceChip(
                              label: Text(f, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isSel ? Colors.white : AppTheme.textDark)),
                              selected: isSel,
                              selectedColor: const Color(0xFFF43F5E),
                              onSelected: (_) => setSheetState(() => flow = f),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 12),
                    ],

                    // Symptoms Chips
                    const Text('Physical Symptoms', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 4,
                      children: _availableSymptoms.map((sym) {
                        final isSel = symptoms.contains(sym);
                        return FilterChip(
                          label: Text(sym, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isSel ? Colors.white : AppTheme.textDark)),
                          selected: isSel,
                          selectedColor: AppTheme.primaryPurple,
                          onSelected: (val) {
                            setSheetState(() {
                              if (val) {
                                symptoms.add(sym);
                              } else {
                                symptoms.remove(sym);
                              }
                            });
                          },
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: 12),

                    // Mood & Energy Row
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: mood,
                            decoration: const InputDecoration(labelText: 'Mood', labelStyle: TextStyle(fontSize: 11)),
                            items: _moodOptions.map((m) => DropdownMenuItem(value: m, child: Text(m, style: const TextStyle(fontSize: 12)))).toList(),
                            onChanged: (val) => setSheetState(() => mood = val ?? 'Calm'),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: energy,
                            decoration: const InputDecoration(labelText: 'Energy Level', labelStyle: TextStyle(fontSize: 11)),
                            items: _energyOptions.map((e) => DropdownMenuItem(value: e, child: Text(e, style: const TextStyle(fontSize: 12)))).toList(),
                            onChanged: (val) => setSheetState(() => energy = val ?? 'Medium'),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 10),

                    // Sleep & Mucus Row
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: sleep,
                            decoration: const InputDecoration(labelText: 'Sleep Quality', labelStyle: TextStyle(fontSize: 11)),
                            items: _sleepOptions.map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontSize: 12)))).toList(),
                            onChanged: (val) => setSheetState(() => sleep = val ?? 'Good'),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: mucus,
                            decoration: const InputDecoration(labelText: 'Cervical Mucus', labelStyle: TextStyle(fontSize: 11)),
                            items: _mucusOptions.map((m) => DropdownMenuItem(value: m, child: Text(m, style: const TextStyle(fontSize: 12)))).toList(),
                            onChanged: (val) => setSheetState(() => mucus = val ?? 'None'),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 10),

                    // Notes
                    TextField(
                      decoration: const InputDecoration(
                        labelText: 'Personal Notes',
                        hintText: 'Hydration, cramping, stress...',
                        labelStyle: TextStyle(fontSize: 11),
                      ),
                      controller: TextEditingController(text: notes),
                      onChanged: (val) => notes = val,
                    ),

                    const SizedBox(height: 20),

                    // Actions
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        if (existing != null)
                          TextButton(
                            child: const Text('Delete Log', style: TextStyle(color: Colors.red)),
                            onPressed: () async {
                              Navigator.pop(ctx);
                              await ApiService.deleteDailyLog(dateStr);
                              _fetchPeriodData(isSilent: true);
                            },
                          ),
                        const SizedBox(width: 8),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryPurple,
                            foregroundColor: Colors.white,
                          ),
                          child: const Text('Save Daily Log', style: TextStyle(fontWeight: FontWeight.bold)),
                          onPressed: () async {
                            Navigator.pop(ctx);
                            await ApiService.saveDailyLog({
                              'date': dateStr,
                              'isPeriodDay': isPeriod,
                              'flowIntensity': isPeriod ? flow : 'None',
                              'symptoms': symptoms,
                              'mood': mood,
                              'energyLevel': energy,
                              'sleepQuality': sleep,
                              'cervicalMucus': mucus,
                              'notes': notes,
                            });
                            _fetchPeriodData(isSilent: true);
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // Baseline Setup Dialog
  void _showBaselineSetupDialog() {
    String lmp = _settings?.lastPeriodStart.isNotEmpty == true
        ? _settings!.lastPeriodStart
        : DateFormat('yyyy-MM-dd').format(DateTime.now());
    int cycleLen = _settings?.cycleLength ?? 28;
    int duration = _settings?.periodDuration ?? 5;
    final lmpController = TextEditingController(text: lmp);

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setDlgState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: const Text('Configure Cycle Baseline', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                    controller: lmpController,
                    decoration: InputDecoration(
                      labelText: 'Last Period Start Date',
                      hintText: 'YYYY-MM-DD',
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.calendar_today, size: 20, color: AppTheme.primaryPurple),
                        onPressed: () async {
                          final initial = DateTime.tryParse(lmp) ?? DateTime.now();
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: initial,
                            firstDate: DateTime.now().subtract(const Duration(days: 120)),
                            lastDate: DateTime.now(),
                          );
                          if (picked != null) {
                            setDlgState(() {
                              lmp = DateFormat('yyyy-MM-dd').format(picked);
                              lmpController.text = lmp;
                            });
                          }
                        },
                      ),
                    ),
                    onChanged: (val) => lmp = val,
                  ),
                  const SizedBox(height: 10),
                  TextFormField(
                    initialValue: '$cycleLen',
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Cycle Length (Days, e.g. 28)'),
                    onChanged: (val) => cycleLen = int.tryParse(val) ?? 28,
                  ),
                  const SizedBox(height: 10),
                  TextFormField(
                    initialValue: '$duration',
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Period Duration (Bleeding Days, e.g. 5)'),
                    onChanged: (val) => duration = int.tryParse(val) ?? 5,
                  ),
                ],
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryPurple, foregroundColor: Colors.white),
                  child: const Text('Save Baseline'),
                  onPressed: () async {
                    Navigator.pop(ctx);
                    await ApiService.savePeriodSettings({
                      'lastPeriodStart': lmp,
                      'cycleLength': cycleLen,
                      'periodDuration': duration,
                    });
                    _fetchPeriodData();
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }

  // Log Cycle Dialog
  void _showLogCycleDialog() {
    String startDate = DateFormat('yyyy-MM-dd').format(DateTime.now());
    int duration = 5;
    String flow = 'Medium';
    final dateController = TextEditingController(text: startDate);

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setDlgState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: const Text('Log Period Cycle', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                    controller: dateController,
                    decoration: InputDecoration(
                      labelText: 'Period Start Date',
                      hintText: 'YYYY-MM-DD',
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.calendar_today, size: 20, color: AppTheme.primaryPurple),
                        onPressed: () async {
                          final initial = DateTime.tryParse(startDate) ?? DateTime.now();
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: initial,
                            firstDate: DateTime.now().subtract(const Duration(days: 365)),
                            lastDate: DateTime.now().add(const Duration(days: 1)),
                          );
                          if (picked != null) {
                            setDlgState(() {
                              startDate = DateFormat('yyyy-MM-dd').format(picked);
                              dateController.text = startDate;
                            });
                          }
                        },
                      ),
                    ),
                    onChanged: (val) => startDate = val,
                  ),
                  const SizedBox(height: 10),
                  TextFormField(
                    initialValue: '$duration',
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Bleeding Duration (Days)'),
                    onChanged: (val) => duration = int.tryParse(val) ?? 5,
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    value: flow,
                    decoration: const InputDecoration(labelText: 'Flow Intensity'),
                    items: ['Spotting', 'Light', 'Medium', 'Heavy']
                        .map((f) => DropdownMenuItem(value: f, child: Text(f)))
                        .toList(),
                    onChanged: (val) => setDlgState(() => flow = val ?? 'Medium'),
                  ),
                ],
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryPurple, foregroundColor: Colors.white),
                  child: const Text('Save Cycle'),
                  onPressed: () async {
                    Navigator.pop(ctx);
                    await ApiService.logPeriodCycle({
                      'startDate': startDate,
                      'durationDays': duration,
                      'flowIntensity': flow,
                      'symptoms': ['Cramps'],
                      'mood': 'Calm',
                    });
                    _fetchPeriodData(isSilent: true);
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }

  // Edit Cycle Dialog
  void _showEditCycleDialog(PeriodCycleModel cycle) {
    String startDate = cycle.startDate;
    int duration = cycle.durationDays;
    String flow = cycle.flowIntensity;
    final dateController = TextEditingController(text: startDate);

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setDlgState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: const Text('Edit Cycle Record', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                    controller: dateController,
                    decoration: InputDecoration(
                      labelText: 'Period Start Date',
                      hintText: 'YYYY-MM-DD',
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.calendar_today, size: 20, color: AppTheme.primaryPurple),
                        onPressed: () async {
                          final initial = DateTime.tryParse(startDate) ?? DateTime.now();
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: initial,
                            firstDate: DateTime.now().subtract(const Duration(days: 365)),
                            lastDate: DateTime.now().add(const Duration(days: 1)),
                          );
                          if (picked != null) {
                            setDlgState(() {
                              startDate = DateFormat('yyyy-MM-dd').format(picked);
                              dateController.text = startDate;
                            });
                          }
                        },
                      ),
                    ),
                    onChanged: (val) => startDate = val,
                  ),
                  const SizedBox(height: 10),
                  TextFormField(
                    initialValue: '$duration',
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Duration (Days)'),
                    onChanged: (val) => duration = int.tryParse(val) ?? 5,
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    value: flow,
                    decoration: const InputDecoration(labelText: 'Flow Intensity'),
                    items: ['Spotting', 'Light', 'Medium', 'Heavy']
                        .map((f) => DropdownMenuItem(value: f, child: Text(f)))
                        .toList(),
                    onChanged: (val) => setDlgState(() => flow = val ?? 'Medium'),
                  ),
                ],
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryPurple, foregroundColor: Colors.white),
                  child: const Text('Update Record'),
                  onPressed: () async {
                    Navigator.pop(ctx);
                    await ApiService.updatePeriodCycle(cycle.id, {
                      'startDate': startDate,
                      'durationDays': duration,
                      'flowIntensity': flow,
                    });
                    _fetchPeriodData(isSilent: true);
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }

  // Delete Cycle Dialog
  void _confirmDeleteCycle(dynamic id) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Delete Cycle Record?'),
          content: const Text('Are you sure you want to delete this recorded cycle? This will recalibrate your historical predictions.'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
              child: const Text('Delete'),
              onPressed: () async {
                Navigator.pop(ctx);
                await ApiService.deletePeriodCycle(id);
                _fetchPeriodData(isSilent: true);
              },
            ),
          ],
        );
      },
    );
  }

  // Delay Calibration Dialog
  void _showDelayCalibrationDialog() {
    int extendDays = 3;
    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setDlgState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: const Text('Calibrate Cycle Delay'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('Extend your expected cycle length by:'),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [2, 3, 5, 7].map((d) {
                      final isSel = extendDays == d;
                      return ChoiceChip(
                        label: Text('+$d d'),
                        selected: isSel,
                        selectedColor: AppTheme.primaryPurple,
                        labelStyle: TextStyle(color: isSel ? Colors.white : AppTheme.textDark),
                        onSelected: (_) => setDlgState(() => extendDays = d),
                      );
                    }).toList(),
                  ),
                ],
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryPurple, foregroundColor: Colors.white),
                  child: const Text('Confirm'),
                  onPressed: () async {
                    Navigator.pop(ctx);
                    await ApiService.adjustPeriodDelay(_cycleLength + extendDays, extendDays);
                    _fetchPeriodData(isSilent: true);
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }

  // Pregnancy Activation Dialog
  void _showPregnancyActivationDialog() {
    String lmp = _settings?.lastPeriodStart ?? DateFormat('yyyy-MM-dd').format(DateTime.now());
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Enter Maternity Mode', style: TextStyle(fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('This will pause period countdowns and activate gestational milestone tracking.'),
              const SizedBox(height: 10),
              TextFormField(
                initialValue: lmp,
                decoration: const InputDecoration(labelText: 'First Day of Last Period (LMP)'),
                onChanged: (val) => lmp = val,
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryPurple, foregroundColor: Colors.white),
              child: const Text('Activate Maternity'),
              onPressed: () async {
                Navigator.pop(ctx);
                await ApiService.activatePregnancy(lmp);
                _fetchPeriodData();
              },
            ),
          ],
        );
      },
    );
  }

  // Resume Cycle Dialog
  void _showResumeCycleDialog() {
    String resumeDate = DateFormat('yyyy-MM-dd').format(DateTime.now());
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Resume Menstrual Cycle'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('This will conclude active Maternity Mode and restart period countdowns.'),
              const SizedBox(height: 10),
              TextFormField(
                initialValue: resumeDate,
                decoration: const InputDecoration(labelText: 'Start Date of Resumed Period'),
                onChanged: (val) => resumeDate = val,
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFF43F5E), foregroundColor: Colors.white),
              child: const Text('Resume Cycle'),
              onPressed: () async {
                Navigator.pop(ctx);
                await ApiService.deactivatePregnancy(resumeDate);
                _fetchPeriodData();
              },
            ),
          ],
        );
      },
    );
  }
}
