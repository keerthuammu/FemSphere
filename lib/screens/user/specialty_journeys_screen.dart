import 'package:flutter/material.dart';
import '../../core/app_theme.dart';

class SpecialtyJourneysScreen extends StatefulWidget {
  final String? initialJourney;
  const SpecialtyJourneysScreen({super.key, this.initialJourney});

  @override
  State<SpecialtyJourneysScreen> createState() => _SpecialtyJourneysScreenState();
}

class _SpecialtyJourneysScreenState extends State<SpecialtyJourneysScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Pregnancy state
  final DateTime _lmpDate = DateTime(2026, 4, 20);
  int _kickCount = 0;
  final List<Map<String, dynamic>> _prenatalChecklist = [
    {'task': 'Blood glucose tolerance screen (24-28w)', 'done': true},
    {'task': 'Kick counter session (10 movements in 2h)', 'done': true},
    {'task': 'Tdap vaccination & birth plan consultation', 'done': false},
    {'task': 'Pelvic ultrasound review with OB/GYN', 'done': false},
  ];

  // Postpartum state
  final int _kegelReps = 15;
  final int _epdsScore = 4; // Edinburgh Postnatal Depression Scale (< 10 normal)
  final String _lochiaStatus = 'Serosa (Moderate Pink/Brown)';
  final int _pumpingOz = 18;

  // Menopause state
  int _hotFlashesToday = 3;
  double _severityScale = 2.0; // 1 to 5
  final String _hormoneTherapyStatus = 'Active Micronized Progesterone';

  // PCOS / Endo state
  final String _pcosCycleLength = '38 days (Irregular)';
  final double _bbtTemp = 36.6;
  bool _ovulationPain = false;

  // Puberty state
  final String _menarcheReadiness = 'Prepared & Kit Assembled';
  final int _emotionalScore = 8; // 1-10

  // Early Childhood state
  final String _infantFeeding = 'Mixed (Formula + Breast)';
  final String _growthPercentile = '74th Percentile';

  // Healthy Aging state
  final String _boneDensity = 'T-score: -1.1 (Mild Osteopenia)';
  final int _dailyMobilityScore = 85;

  @override
  void initState() {
    super.initState();
    int initialIndex = 0;
    if (widget.initialJourney != null) {
      if (widget.initialJourney!.contains('Pregnancy')) {
        initialIndex = 0;
      } else if (widget.initialJourney!.contains('Postpartum')) {
        initialIndex = 1;
      } else if (widget.initialJourney!.contains('Menopause')) {
        initialIndex = 2;
      } else if (widget.initialJourney!.contains('PCOS') || widget.initialJourney!.contains('Endo')) {
        initialIndex = 3;
      } else if (widget.initialJourney!.contains('Puberty')) {
        initialIndex = 4;
      } else if (widget.initialJourney!.contains('Childhood')) {
        initialIndex = 5;
      } else if (widget.initialJourney!.contains('Aging')) {
        initialIndex = 6;
      }
    }
    _tabController = TabController(length: 7, vsync: this, initialIndex: initialIndex);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  // Pregnancy Gestational calculation
  Map<String, dynamic> _getGestationalDetails() {
    final now = DateTime(2026, 10, 10);
    final diffDays = now.difference(_lmpDate).inDays;
    final weeks = (diffDays / 7).floor().clamp(1, 42);
    final days = diffDays % 7;
    final edd = _lmpDate.add(const Duration(days: 280));

    String trimester = 'Trimester 1';
    if (weeks >= 28) {
      trimester = 'Trimester 3';
    } else if (weeks >= 14) {
      trimester = 'Trimester 2';
    }

    String babySize = 'Avocado (~100g)';
    if (weeks >= 36) {
      babySize = 'Honeydew Melon (~2.6kg)';
    } else if (weeks >= 32) {
      babySize = 'Pineapple (~1.7kg)';
    } else if (weeks >= 28) {
      babySize = 'Eggplant (~1kg)';
    } else if (weeks >= 24) {
      babySize = 'Papaya (~600g)';
    } else if (weeks >= 20) {
      babySize = 'Banana (~300g)';
    } else if (weeks >= 16) {
      babySize = 'Avocado (~100g)';
    } else if (weeks >= 12) {
      babySize = 'Lime (~14g)';
    }

    return {
      'weeks': weeks,
      'days': days,
      'trimester': trimester,
      'edd': '${edd.year}-${edd.month.toString().padLeft(2, '0')}-${edd.day.toString().padLeft(2, '0')}',
      'size': babySize,
    };
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: const Text(
          'Specialty Health Journeys',
          style: TextStyle(color: AppTheme.textDark, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: AppTheme.primaryPurple,
          unselectedLabelColor: AppTheme.textMuted,
          indicatorColor: AppTheme.primaryPurple,
          indicatorWeight: 3,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: const [
            Tab(text: '🤰 Pregnancy', icon: Icon(Icons.pregnant_woman, size: 18)),
            Tab(text: '🤱 Postpartum', icon: Icon(Icons.child_care, size: 18)),
            Tab(text: '🌿 Menopause', icon: Icon(Icons.spa, size: 18)),
            Tab(text: '🌸 PCOS & Endo', icon: Icon(Icons.water_drop, size: 18)),
            Tab(text: '🌱 Puberty', icon: Icon(Icons.school, size: 18)),
            Tab(text: '👶 Early Childhood', icon: Icon(Icons.escalator_warning, size: 18)),
            Tab(text: '👵 Healthy Aging', icon: Icon(Icons.elderly, size: 18)),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildPregnancyTab(),
          _buildPostpartumTab(),
          _buildMenopauseTab(),
          _buildPcosTab(),
          _buildPubertyTab(),
          _buildChildhoodTab(),
          _buildAgingTab(),
        ],
      ),
    );
  }

  // 1. PREGNANCY MODE
  Widget _buildPregnancyTab() {
    final gest = _getGestationalDetails();
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Hero Trimester Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFEC4899), Color(0xFFDB2777), Color(0xFF9D174D)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFEC4899).withValues(alpha: 0.3),
                blurRadius: 16,
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
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      gest['trimester'] as String,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11),
                    ),
                  ),
                  Text(
                    'EDD: ${gest['edd']}',
                    style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Text(
                'Week ${gest['weeks']}, Day ${gest['days']}',
                style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 4),
              Text(
                'Baby is roughly the size of a ${gest['size']}',
                style: const TextStyle(color: Colors.white, fontSize: 13),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Interactive Fetal Kick Counter
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
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('👣 Active Fetal Kick Counter', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  Text('Target: 10 kicks', style: TextStyle(color: Colors.pink.shade600, fontSize: 11, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    '$_kickCount',
                    style: const TextStyle(fontSize: 48, fontWeight: FontWeight.w900, color: Color(0xFFEC4899)),
                  ),
                  const SizedBox(width: 8),
                  const Text('Movements', style: TextStyle(color: Colors.black54, fontSize: 13)),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        setState(() => _kickCount++);
                      },
                      icon: const Icon(Icons.touch_app, color: Colors.white, size: 16),
                      label: const Text('Record Movement', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEC4899),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  IconButton(
                    onPressed: () => setState(() => _kickCount = 0),
                    icon: const Icon(Icons.refresh, color: Colors.black45),
                    tooltip: 'Reset Session',
                  ),
                ],
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Prenatal Checklist
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
              const Text('📋 Prenatal Checkup Checklist', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 8),
              ..._prenatalChecklist.map((item) => CheckboxListTile(
                    dense: true,
                    contentPadding: EdgeInsets.zero,
                    activeColor: const Color(0xFFEC4899),
                    title: Text(item['task'] as String, style: const TextStyle(fontSize: 12)),
                    value: item['done'] as bool,
                    onChanged: (val) {
                      setState(() => item['done'] = val ?? false);
                    },
                  )),
            ],
          ),
        ),
      ],
    );
  }

  // 2. POSTPARTUM CARE
  Widget _buildPostpartumTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF8B5CF6), Color(0xFF7C3AED)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('4th Trimester Recovery Matrix', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              const Text('Clinical pelvic floor rehabilitation & maternal mental vitality tracking.', style: TextStyle(color: Colors.white70, fontSize: 12)),
              const SizedBox(height: 14),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _statBadge('Kegel Reps', '$_kegelReps/day', Icons.fitness_center),
                  _statBadge('EPDS Score', '$_epdsScore (Normal)', Icons.favorite),
                  _statBadge('Lactation', '$_pumpingOz oz', Icons.opacity),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
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
              const Text('🌸 Pelvic Floor & Lochia Monitoring', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 12),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const CircleAvatar(backgroundColor: Color(0xFFF3E8FF), child: Icon(Icons.water_drop, color: Color(0xFF8B5CF6))),
                title: const Text('Lochia Healing Phase', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                subtitle: Text(_lochiaStatus, style: const TextStyle(fontSize: 11)),
                trailing: const Chip(
                  label: Text('Stage 2', style: TextStyle(fontSize: 10, color: Color(0xFF8B5CF6))),
                  backgroundColor: Color(0xFFF3E8FF),
                ),
              ),
              const Divider(),
              const ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(backgroundColor: Color(0xFFF3E8FF), child: Icon(Icons.psychology, color: Color(0xFF8B5CF6))),
                title: Text('EPDS Mental Health Screen', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                subtitle: Text('Low risk of Postpartum Depression (Score 4/30)', style: TextStyle(fontSize: 11)),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // 3. MENOPAUSE NAVIGATOR
  Widget _buildMenopauseTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF10B981), Color(0xFF059669)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Menopause & Vasomotor Navigator', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              const Text('Hormonal equilibrium, bone health, and thermal dysregulation analysis.', style: TextStyle(color: Colors.white70, fontSize: 12)),
              const SizedBox(height: 14),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _statBadge('Hot Flashes', '$_hotFlashesToday Today', Icons.thermostat),
                  _statBadge('Severity', 'Grade ${_severityScale.toInt()}', Icons.bolt),
                  _statBadge('Therapy', _hormoneTherapyStatus.split(' ').first, Icons.medication),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
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
              const Text('Log Vasomotor Episode (Hot Flash)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 12),
              Slider(
                value: _severityScale,
                min: 1.0,
                max: 5.0,
                divisions: 4,
                activeColor: const Color(0xFF10B981),
                label: 'Grade ${_severityScale.toInt()}',
                onChanged: (val) => setState(() => _severityScale = val),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text('Mild (1)', style: TextStyle(fontSize: 10, color: Colors.black54)),
                  Text('Moderate (3)', style: TextStyle(fontSize: 10, color: Colors.black54)),
                  Text('Severe Night Sweat (5)', style: TextStyle(fontSize: 10, color: Colors.black54)),
                ],
              ),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    setState(() => _hotFlashesToday++);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Vasomotor episode logged to clinical twin.')),
                    );
                  },
                  icon: const Icon(Icons.add_circle, color: Colors.white, size: 16),
                  label: const Text('Log Hot Flash Episode', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // 4. PCOS / ENDO LOG
  Widget _buildPcosTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFF43F5E), Color(0xFFBE123C)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('PCOS & Endometriosis Panel', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              const Text('Hormonal dysregulation, pelvic inflammation, and metabolic biomarkers.', style: TextStyle(color: Colors.white70, fontSize: 12)),
              const SizedBox(height: 14),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _statBadge('Cycle Length', _pcosCycleLength, Icons.timer),
                  _statBadge('Basal Temp', '$_bbtTemp°C', Icons.thermostat),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
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
              const Text('Clinical Symptoms & Flare-Up Tracker', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 8),
              SwitchListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                activeTrackColor: const Color(0xFFF43F5E),
                title: const Text('Mittelschmerz / Ovulatory Pelvic Pain', style: TextStyle(fontSize: 12)),
                value: _ovulationPain,
                onChanged: (val) => setState(() => _ovulationPain = val),
              ),
              const Divider(),
              const ListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                leading: Icon(Icons.bloodtype, color: Color(0xFFF43F5E)),
                title: Text('Hormonal Ratio (LH:FSH)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                subtitle: Text('2.4:1 (Consistent with Mild PCOS Profile)', style: TextStyle(fontSize: 11)),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // 5. PUBERTY
  Widget _buildPubertyTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFA855F7), Color(0xFF7E22CE)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Puberty & Development Hub', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              const Text('Growth velocity, menarche readiness, and positive body literacy.', style: TextStyle(color: Colors.white70, fontSize: 12)),
              const SizedBox(height: 12),
              Row(
                children: [
                  _statBadge('Emotional Balance', '$_emotionalScore / 10', Icons.mood),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
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
              const Text('Educational & Milestone Tracker', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 12),
              ListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.check_circle, color: Color(0xFFA855F7)),
                title: const Text('Menarche Literacy Module Completed', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                subtitle: Text(_menarcheReadiness, style: const TextStyle(fontSize: 11)),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // 6. EARLY CHILDHOOD
  Widget _buildChildhoodTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFF472B6), Color(0xFFDB2777)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Early Childhood & Pediatric Matrix', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              const Text('Pediatric growth percentiles, vaccination schedule, and developmental milestones.', style: TextStyle(color: Colors.white70, fontSize: 12)),
              const SizedBox(height: 12),
              Row(
                children: [
                  _statBadge('Feeding Protocol', _infantFeeding, Icons.restaurant),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
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
              const Text('WHO Pediatric Growth Curve', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 10),
              ListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.show_chart, color: Color(0xFFF472B6)),
                title: const Text('Height & Weight Velocity', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                subtitle: Text('Tracking along the $_growthPercentile', style: const TextStyle(fontSize: 11)),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // 7. HEALTHY AGING
  Widget _buildAgingTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF3B82F6), Color(0xFF1D4ED8)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
          ),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Healthy Aging & Longevity Engine', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
              SizedBox(height: 4),
              Text('Bone density management, cardiovascular resilience, and mobility preservation.', style: TextStyle(color: Colors.white70, fontSize: 12)),
            ],
          ),
        ),
        const SizedBox(height: 16),
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
              const Text('DEXA Bone Density & Mobility Score', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 10),
              ListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.accessibility_new, color: Color(0xFF3B82F6)),
                title: const Text('Bone Density Scan (Femoral Neck)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                subtitle: Text(_boneDensity, style: const TextStyle(fontSize: 11)),
              ),
              const Divider(),
              ListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.directions_walk, color: Color(0xFF3B82F6)),
                title: const Text('Daily Mobility Resilience Index', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                subtitle: Text('$_dailyMobilityScore / 100 (Optimal for stage)', style: const TextStyle(fontSize: 11)),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _statBadge(String title, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.white70, size: 16),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
        Text(title, style: const TextStyle(color: Colors.white60, fontSize: 9)),
      ],
    );
  }
}
