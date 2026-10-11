import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../core/app_theme.dart';
import '../../services/api_service.dart';

class VitalsTrackerScreen extends StatefulWidget {
  const VitalsTrackerScreen({super.key});

  @override
  State<VitalsTrackerScreen> createState() => _VitalsTrackerScreenState();
}

class _VitalsTrackerScreenState extends State<VitalsTrackerScreen> {
  DateTime _selectedDate = DateTime.now();
  DateTime _currentMonth = DateTime.now();
  bool _isLoading = true;
  List<dynamic> _backendLogs = [];
  Map<String, dynamic>? _selectedDateLog;

  // Set of dates string (YYYY-MM-DD) that have reported daily logs
  final Set<String> _reportedDates = {};

  @override
  void initState() {
    super.initState();
    _fetchDailyHealthLogs();
  }

  String _formatDateKey(DateTime dt) => DateFormat('yyyy-MM-dd').format(dt);

  Future<void> _fetchDailyHealthLogs() async {
    setState(() => _isLoading = true);
    try {
      final logs = await ApiService.getHealthTrackerLogs();
      final reported = <String>{};
      for (final log in logs) {
        if (log['log_date'] != null) {
          reported.add(log['log_date'].toString().split('T')[0]);
        }
      }

      final key = _formatDateKey(_selectedDate);
      final match = logs.firstWhere(
        (l) => l['log_date'] != null && l['log_date'].toString().split('T')[0] == key,
        orElse: () => null,
      );

      if (mounted) {
        setState(() {
          _backendLogs = logs;
          _reportedDates.clear();
          _reportedDates.addAll(reported);
          _selectedDateLog = match;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _onDateSelected(DateTime dt) {
    final key = _formatDateKey(dt);
    final match = _backendLogs.firstWhere(
      (l) => l['log_date'] != null && l['log_date'].toString().split('T')[0] == key,
      orElse: () => null,
    );
    setState(() {
      _selectedDate = dt;
      _selectedDateLog = match;
    });
  }

  void _openDailyActivityModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _DailyActivityFormModal(
        selectedDate: _selectedDate,
        initialData: _selectedDateLog,
        onSaved: () {
          _fetchDailyHealthLogs();
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final formattedSelected = DateFormat('MMMM d, yyyy').format(_selectedDate);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFEDE4F7), Color(0xFFFAF7FD)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // 1. TOP APP BAR (Uniform pill design)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildCircularButton(
                      icon: Icons.arrow_back_rounded,
                      onTap: () => Navigator.pop(context),
                      tooltip: 'Back',
                    ),
                    Text(
                      'Health Tracker',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textDark,
                      ),
                    ),
                    _buildCircularButton(
                      icon: Icons.add_rounded,
                      onTap: _openDailyActivityModal,
                      tooltip: 'Log Activity',
                    ),
                  ],
                ),
              ),

              Expanded(
                child: _isLoading
                    ? const Center(
                        child: CircularProgressIndicator(color: AppTheme.primaryPurple),
                      )
                    : RefreshIndicator(
                        color: AppTheme.primaryPurple,
                        onRefresh: _fetchDailyHealthLogs,
                        child: SingleChildScrollView(
                          physics: const AlwaysScrollableScrollPhysics(),
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // 2. CALENDAR CARD (With lavender square markers on reported dates)
                              Container(
                                padding: const EdgeInsets.all(18),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(26),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.03),
                                      blurRadius: 14,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  children: [
                                    // Month navigation header
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          DateFormat('MMMM yyyy').format(_currentMonth),
                                          style: GoogleFonts.plusJakartaSans(
                                            fontSize: 15,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.textDark,
                                          ),
                                        ),
                                        Row(
                                          children: [
                                            IconButton(
                                              icon: const Icon(Icons.chevron_left_rounded, size: 22),
                                              padding: EdgeInsets.zero,
                                              constraints: const BoxConstraints(),
                                              onPressed: () {
                                                setState(() {
                                                  _currentMonth = DateTime(
                                                    _currentMonth.year,
                                                    _currentMonth.month - 1,
                                                    1,
                                                  );
                                                });
                                              },
                                            ),
                                            const SizedBox(width: 8),
                                            IconButton(
                                              icon: const Icon(Icons.chevron_right_rounded, size: 22),
                                              padding: EdgeInsets.zero,
                                              constraints: const BoxConstraints(),
                                              onPressed: () {
                                                setState(() {
                                                  _currentMonth = DateTime(
                                                    _currentMonth.year,
                                                    _currentMonth.month + 1,
                                                    1,
                                                  );
                                                });
                                              },
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),

                                    const SizedBox(height: 12),

                                    // Weekday row
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                                      children: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
                                          .map((d) => SizedBox(
                                                width: 32,
                                                child: Text(
                                                  d,
                                                  textAlign: TextAlign.center,
                                                  style: GoogleFonts.plusJakartaSans(
                                                    fontSize: 11,
                                                    fontWeight: FontWeight.bold,
                                                    color: const Color(0xFF9CA3AF),
                                                  ),
                                                ),
                                              ))
                                          .toList(),
                                    ),

                                    const SizedBox(height: 8),

                                    // Calendar days grid
                                    _buildMonthGrid(),

                                    const SizedBox(height: 12),

                                    // Legend
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Container(
                                          width: 10,
                                          height: 10,
                                          decoration: BoxDecoration(
                                            color: AppTheme.primaryPurple,
                                            borderRadius: BorderRadius.circular(2.5),
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          'Plum Mauve: Reported Activity Date',
                                          style: GoogleFonts.plusJakartaSans(
                                            fontSize: 11,
                                            color: AppTheme.textMuted,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),

                              const SizedBox(height: 18),

                              // 3. SELECTED DATE ACTIVITY DETAIL CARD
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(20),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(26),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.03),
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
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'Activity Record',
                                              style: GoogleFonts.plusJakartaSans(
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                                color: AppTheme.primaryPurple,
                                              ),
                                            ),
                                            Text(
                                              formattedSelected,
                                              style: GoogleFonts.plusJakartaSans(
                                                fontSize: 17,
                                                fontWeight: FontWeight.bold,
                                                color: AppTheme.textDark,
                                              ),
                                            ),
                                          ],
                                        ),
                                        ElevatedButton.icon(
                                          onPressed: _openDailyActivityModal,
                                          icon: Icon(
                                            _selectedDateLog != null ? Icons.edit_rounded : Icons.add_rounded,
                                            size: 15,
                                          ),
                                          label: Text(
                                            _selectedDateLog != null ? 'Edit Log' : 'Log Today',
                                            style: GoogleFonts.plusJakartaSans(
                                              fontSize: 12,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: AppTheme.primaryPurple,
                                            foregroundColor: Colors.white,
                                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                            elevation: 0,
                                            shape: RoundedRectangleBorder(
                                              borderRadius: BorderRadius.circular(20),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),

                                    const SizedBox(height: 16),

                                    if (_selectedDateLog == null)
                                      Container(
                                        padding: const EdgeInsets.all(16),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFFAF7FD),
                                          borderRadius: BorderRadius.circular(18),
                                          border: Border.all(color: const Color(0xFFF3E8FF)),
                                        ),
                                        child: Center(
                                          child: Text(
                                            'No activity reported for $formattedSelected.\nTap "Log Today" to report your daily vitals.',
                                            textAlign: TextAlign.center,
                                            style: GoogleFonts.plusJakartaSans(
                                              fontSize: 12.5,
                                              height: 1.5,
                                              color: AppTheme.textMuted,
                                            ),
                                          ),
                                        ),
                                      )
                                    else
                                      _buildRecordVitalsGrid(_selectedDateLog!),
                                  ],
                                ),
                              ),

                              const SizedBox(height: 18),

                              // 4. INTERACTIVE HEALTH GRAPH CARD (Trend over time)
                              Container(
                                padding: const EdgeInsets.all(20),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(26),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.03),
                                      blurRadius: 14,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Vitals Trend Timeline',
                                      style: GoogleFonts.plusJakartaSans(
                                        fontSize: 15,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.textDark,
                                      ),
                                    ),
                                    Text(
                                      'Resting heart rate & active steps across logged dates',
                                      style: GoogleFonts.plusJakartaSans(
                                        fontSize: 11,
                                        color: AppTheme.textMuted,
                                      ),
                                    ),
                                    const SizedBox(height: 18),
                                    SizedBox(
                                      height: 180,
                                      child: _buildInteractiveChart(),
                                    ),
                                  ],
                                ),
                              ),

                              const SizedBox(height: 24),
                            ],
                          ),
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMonthGrid() {
    final firstDayOfMonth = DateTime(_currentMonth.year, _currentMonth.month, 1);
    final daysInMonth = DateTime(_currentMonth.year, _currentMonth.month + 1, 0).day;
    // Monday is 1, Sunday is 7. We want 0-based offset where Monday is 0.
    final startingOffset = (firstDayOfMonth.weekday - 1) % 7;

    final totalSlots = ((startingOffset + daysInMonth + 6) ~/ 7) * 7;

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: totalSlots,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 7,
        mainAxisSpacing: 6,
        crossAxisSpacing: 6,
        childAspectRatio: 1.1,
      ),
      itemBuilder: (context, index) {
        final dayNum = index - startingOffset + 1;
        if (dayNum < 1 || dayNum > daysInMonth) {
          return const SizedBox.shrink();
        }

        final cellDate = DateTime(_currentMonth.year, _currentMonth.month, dayNum);
        final dateKey = _formatDateKey(cellDate);
        final isSelected = _formatDateKey(_selectedDate) == dateKey;
        final isReported = _reportedDates.contains(dateKey);

        return GestureDetector(
          onTap: () => _onDateSelected(cellDate),
          child: Container(
            decoration: BoxDecoration(
              color: isSelected
                  ? AppTheme.primaryPurple
                  : (isReported ? AppTheme.primaryPurpleLight : Colors.transparent),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: isSelected
                    ? AppTheme.primaryPurple
                    : (isReported ? AppTheme.accentPink : Colors.transparent),
                width: 1.5,
              ),
            ),
            child: Stack(
               alignment: Alignment.center,
              children: [
                Text(
                  '$dayNum',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    fontWeight: isSelected || isReported ? FontWeight.bold : FontWeight.w500,
                    color: isSelected
                        ? Colors.white
                        : (isReported ? AppTheme.primaryPurpleDark : AppTheme.textDark),
                  ),
                ),
                // Plum mauve square marker on bottom right for reported activity dates
                if (isReported && !isSelected)
                  Positioned(
                    bottom: 3,
                    right: 3,
                    child: Container(
                      width: 5,
                      height: 5,
                      decoration: BoxDecoration(
                        color: AppTheme.primaryPurple,
                        borderRadius: BorderRadius.circular(1.5),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildRecordVitalsGrid(Map<String, dynamic> log) {
    final hr = log['heart_rate']?.toString() ?? '--';
    final bp = log['blood_pressure']?.toString() ?? '--';
    final sleep = log['sleep_hours']?.toString() ?? '--';
    final water = log['water_intake_liters']?.toString() ?? '--';
    final steps = log['steps']?.toString() ?? '--';
    final mood = log['mood']?.toString() ?? 'Balanced';

    return Column(
      children: [
        Row(
          children: [
            Expanded(child: _buildMetricTile('❤️ Heart Rate', '$hr bpm', const Color(0xFFF43F5E))),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricTile('🩺 Blood Pressure', bp, const Color(0xFF8B5CF6))),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(child: _buildMetricTile('🌙 Sleep Duration', '$sleep hrs', const Color(0xFF6366F1))),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricTile('💧 Hydration', '$water L', const Color(0xFF0EA5E9))),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(child: _buildMetricTile('👟 Daily Steps', steps, const Color(0xFF10B981))),
            const SizedBox(width: 10),
            Expanded(child: _buildMetricTile('🌸 Reported Mood', mood, const Color(0xFFEC4899))),
          ],
        ),
      ],
    );
  }

  Widget _buildMetricTile(String label, String value, Color accent) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFFFAF7FD),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF3E8FF)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 10.5,
              fontWeight: FontWeight.w600,
              color: AppTheme.textMuted,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: AppTheme.textDark,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInteractiveChart() {
    if (_backendLogs.isEmpty) {
      return Center(
        child: Text(
          'Log your first daily activity to populate trend lines.',
          style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textMuted),
        ),
      );
    }

    final spots = <FlSpot>[];
    final displayLogs = _backendLogs.take(7).toList().reversed.toList();
    for (int i = 0; i < displayLogs.length; i++) {
      final hr = double.tryParse(displayLogs[i]['heart_rate']?.toString() ?? '') ?? 72.0;
      spots.add(FlSpot(i.toDouble(), hr));
    }

    if (spots.length < 2) {
      spots.add(FlSpot(1, spots.first.y));
    }

    return LineChart(
      LineChartData(
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          getDrawingHorizontalLine: (value) => FlLine(
            color: const Color(0xFFF3E8FF),
            strokeWidth: 1,
          ),
        ),
        titlesData: FlTitlesData(
          show: true,
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (val, meta) {
                final idx = val.toInt();
                if (idx >= 0 && idx < displayLogs.length) {
                  final dt = displayLogs[idx]['log_date']?.toString().split('-').sublist(1).join('/') ?? '';
                  return Text(dt, style: GoogleFonts.plusJakartaSans(fontSize: 9, color: AppTheme.textMuted));
                }
                return const SizedBox.shrink();
              },
            ),
          ),
        ),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: spots,
            isCurved: true,
            color: AppTheme.primaryPurple,
            barWidth: 3,
            isStrokeCapRound: true,
            dotData: const FlDotData(show: true),
            belowBarData: BarAreaData(
              show: true,
              color: AppTheme.primaryPurple.withValues(alpha: 0.12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCircularButton({
    required IconData icon,
    required VoidCallback onTap,
    String? tooltip,
    double size = 44,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(size / 2),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white,
            border: Border.all(color: const Color(0xFFF3E8FF)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Center(
            child: Icon(icon, color: AppTheme.textDark, size: size * 0.48),
          ),
        ),
      ),
    );
  }
}

/// The Daily Activity Form Modal (Prompt #7 requirement: form opens in a modal)
class _DailyActivityFormModal extends StatefulWidget {
  final DateTime selectedDate;
  final Map<String, dynamic>? initialData;
  final VoidCallback onSaved;

  const _DailyActivityFormModal({
    required this.selectedDate,
    required this.initialData,
    required this.onSaved,
  });

  @override
  State<_DailyActivityFormModal> createState() => _DailyActivityFormModalState();
}

class _DailyActivityFormModalState extends State<_DailyActivityFormModal> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _hrController;
  late TextEditingController _bpController;
  late TextEditingController _sleepController;
  late TextEditingController _waterController;
  late TextEditingController _stepsController;
  late TextEditingController _notesController;
  String _mood = 'Balanced & Energized';
  bool _isSaving = false;

  final List<String> _moods = [
    'Balanced & Energized',
    'Calm & Focused',
    'Luteal Fatigue',
    'Pelvic Cramping',
    'Anxious / Stressed',
  ];

  @override
  void initState() {
    super.initState();
    final d = widget.initialData ?? {};
    _hrController = TextEditingController(text: d['heart_rate']?.toString() ?? '72');
    _bpController = TextEditingController(text: d['blood_pressure']?.toString() ?? '118/76');
    _sleepController = TextEditingController(text: d['sleep_hours']?.toString() ?? '7.5');
    _waterController = TextEditingController(text: d['water_intake_liters']?.toString() ?? '2.0');
    _stepsController = TextEditingController(text: d['steps']?.toString() ?? '6500');
    _notesController = TextEditingController(text: d['notes']?.toString() ?? '');
    _mood = d['mood']?.toString() ?? 'Balanced & Energized';
  }

  @override
  void dispose() {
    _hrController.dispose();
    _bpController.dispose();
    _sleepController.dispose();
    _waterController.dispose();
    _stepsController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSaving = true);

    try {
      final dateStr = DateFormat('yyyy-MM-dd').format(widget.selectedDate);
      final payload = {
        'logDate': dateStr,
        'heartRate': int.tryParse(_hrController.text.trim()) ?? 72,
        'bloodPressure': _bpController.text.trim(),
        'sleepHours': double.tryParse(_sleepController.text.trim()) ?? 7.5,
        'waterIntakeLiters': double.tryParse(_waterController.text.trim()) ?? 2.0,
        'steps': int.tryParse(_stepsController.text.trim()) ?? 6000,
        'mood': _mood,
        'notes': _notesController.text.trim(),
      };

      final res = await ApiService.saveHealthTrackerLog(payload);
      if (mounted) {
        if (res['success'] != false) {
          widget.onSaved();
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('✓ Daily activity record saved successfully!'),
              backgroundColor: AppTheme.primaryPurple,
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(res['message'] ?? 'Failed to save log')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dateDisplay = DateFormat('MMMM d, yyyy').format(widget.selectedDate);

    return Container(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE5E7EB),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Report Daily Activity',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textDark,
                        ),
                      ),
                      Text(
                        dateDisplay,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          color: AppTheme.primaryPurple,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  Expanded(
                    child: _buildInput(
                      label: 'Heart Rate (bpm)',
                      controller: _hrController,
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildInput(
                      label: 'Blood Pressure',
                      controller: _bpController,
                      hint: '120/80',
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: _buildInput(
                      label: 'Sleep Hours',
                      controller: _sleepController,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildInput(
                      label: 'Water Intake (L)',
                      controller: _waterController,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              _buildInput(
                label: 'Daily Steps',
                controller: _stepsController,
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 12),

              Text(
                'Mood & Sensation',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textDark,
                ),
              ),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _moods.contains(_mood) ? _mood : _moods.first,
                decoration: InputDecoration(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0xFFEDE9FE)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: Color(0xFFEDE9FE)),
                  ),
                ),
                items: _moods.map((m) => DropdownMenuItem(value: m, child: Text(m, style: GoogleFonts.plusJakartaSans(fontSize: 13)))).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _mood = val);
                },
              ),
              const SizedBox(height: 12),

              _buildInput(
                label: 'Notes / Symptoms',
                controller: _notesController,
                maxLines: 2,
                hint: 'e.g. Mild cramps, morning meditation done',
              ),
              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isSaving ? null : _submitForm,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryPurple,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(28),
                    ),
                  ),
                  child: _isSaving
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : Text(
                          'Save Daily Activity',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInput({
    required String label,
    required TextEditingController controller,
    String? hint,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: AppTheme.textDark,
          ),
        ),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          maxLines: maxLines,
          style: GoogleFonts.plusJakartaSans(fontSize: 13),
          decoration: InputDecoration(
            hintText: hint,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: AppTheme.softBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: AppTheme.softBorder),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: AppTheme.primaryPurple, width: 1.5),
            ),
          ),
        ),
      ],
    );
  }
}
