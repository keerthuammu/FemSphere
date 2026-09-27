import 'package:flutter/material.dart';
import '../../core/app_theme.dart';

class VitalsTrackerScreen extends StatefulWidget {
  const VitalsTrackerScreen({super.key});

  @override
  State<VitalsTrackerScreen> createState() => _VitalsTrackerScreenState();
}

class _VitalsTrackerScreenState extends State<VitalsTrackerScreen> {
  // Current Form State
  int _systolic = 118;
  int _diastolic = 76;
  int _heartRate = 68;
  int _bloodGlucose = 92;
  double _temperature = 98.4;
  int _spo2 = 99;
  double _sleepHours = 7.5;
  String _selectedMood = '😊 Balanced & Energized';
  double _painScale = 1.0;

  final List<Map<String, dynamic>> _vitalHistory = [
    {
      'date': 'Today, 8:30 AM',
      'bp': '118/76',
      'hr': 68,
      'glucose': 92,
      'temp': '98.4°F',
      'spo2': 99,
      'sleep': '7.5 hrs',
      'mood': '😊 Energized',
      'status': 'Optimal',
    },
    {
      'date': 'Yesterday, 9:00 PM',
      'bp': '120/78',
      'hr': 72,
      'glucose': 104,
      'temp': '98.6°F',
      'spo2': 98,
      'sleep': '8.0 hrs',
      'mood': '😌 Calm',
      'status': 'Optimal',
    },
    {
      'date': 'Sep 19, 8:15 AM',
      'bp': '116/74',
      'hr': 65,
      'glucose': 89,
      'temp': '98.2°F',
      'spo2': 99,
      'sleep': '6.8 hrs',
      'mood': '🥱 Mild Fatigue',
      'status': 'Good',
    },
  ];

  final List<String> _moodOptions = [
    '😊 Balanced & Energized',
    '😌 Calm & Focused',
    '🥱 Luteal Fatigue',
    '😟 Anxious / Stressed',
    '😣 Pelvic Cramping',
    '🌧️ Low Mood',
  ];

  void _saveLog() {
    setState(() {
      _vitalHistory.insert(0, {
        'date': 'Just now',
        'bp': '$_systolic/$_diastolic',
        'hr': _heartRate,
        'glucose': _bloodGlucose,
        'temp': '${_temperature.toStringAsFixed(1)}°F',
        'spo2': _spo2,
        'sleep': '${_sleepHours.toStringAsFixed(1)} hrs',
        'mood': _selectedMood,
        'status': 'Optimal',
      });
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✨ Health vitals and biometric log saved to AI Twin!'),
        backgroundColor: AppTheme.secondaryTeal,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('📊 Comprehensive Vitals Tracker'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // AI Twin Sync Banner
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF8B5CF6), Color(0xFFEC4899)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  const Icon(Icons.auto_awesome, color: Colors.white, size: 28),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'AI Health Twin Synchronized',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Your logged vitals recalibrate your cardiovascular, hormonal, and fertility forecasts in real-time.',
                          style: TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Logger Form
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
                  const Text(
                    'Log Today\'s Measurements',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 16),

                  // Blood Pressure & Heart Rate
                  Row(
                    children: [
                      Expanded(
                        child: _buildStepperInput(
                          label: 'BP Systolic (mmHg)',
                          value: _systolic,
                          min: 80,
                          max: 180,
                          onChanged: (val) => setState(() => _systolic = val),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStepperInput(
                          label: 'BP Diastolic (mmHg)',
                          value: _diastolic,
                          min: 50,
                          max: 120,
                          onChanged: (val) => setState(() => _diastolic = val),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Resting HR & Fasting Glucose
                  Row(
                    children: [
                      Expanded(
                        child: _buildStepperInput(
                          label: 'Heart Rate (BPM)',
                          value: _heartRate,
                          min: 40,
                          max: 150,
                          onChanged: (val) => setState(() => _heartRate = val),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStepperInput(
                          label: 'Glucose (mg/dL)',
                          value: _bloodGlucose,
                          min: 60,
                          max: 250,
                          onChanged: (val) => setState(() => _bloodGlucose = val),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Basal Temperature & SpO2
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Basal Temp: ${_temperature.toStringAsFixed(1)}°F', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                            Slider(
                              value: _temperature,
                              min: 96.0,
                              max: 102.0,
                              divisions: 60,
                              activeColor: Colors.orange,
                              onChanged: (val) => setState(() => _temperature = val),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStepperInput(
                          label: 'Blood Oxygen SpO2 (%)',
                          value: _spo2,
                          min: 85,
                          max: 100,
                          onChanged: (val) => setState(() => _spo2 = val),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Sleep Hours
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Sleep Duration: ${_sleepHours.toStringAsFixed(1)} Hours', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                      Slider(
                        value: _sleepHours,
                        min: 3.0,
                        max: 12.0,
                        divisions: 18,
                        activeColor: AppTheme.primaryPurple,
                        onChanged: (val) => setState(() => _sleepHours = val),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Mood Selector Dropdown
                  const Text('Daily Mood & Energy', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    value: _selectedMood,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    ),
                    items: _moodOptions.map((m) {
                      return DropdownMenuItem(value: m, child: Text(m, style: const TextStyle(fontSize: 13)));
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedMood = val);
                    },
                  ),
                  const SizedBox(height: 16),

                  // Pain & Discomfort Rating
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Pelvic / Cramp Discomfort Rating', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                      Text('${_painScale.toInt()} / 10', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.red)),
                    ],
                  ),
                  Slider(
                    value: _painScale,
                    min: 0,
                    max: 10,
                    divisions: 10,
                    activeColor: Colors.redAccent,
                    onChanged: (val) => setState(() => _painScale = val),
                  ),

                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.check_circle_outline),
                      label: const Text('Save Biometric Log', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryPurple,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: _saveLog,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // History Log List
            const Text('📜 Recent Vital Log History', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
            const SizedBox(height: 12),
            ..._vitalHistory.map((h) => _buildHistoryCard(h)),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildStepperInput({
    required String label,
    required int value,
    required int min,
    required int max,
    required ValueChanged<int> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF9F7FB),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted, fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('$value', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
              Row(
                children: [
                  InkWell(
                    onTap: value > min ? () => onChanged(value - 1) : null,
                    child: const CircleAvatar(radius: 12, backgroundColor: Colors.white, child: Icon(Icons.remove, size: 14, color: AppTheme.primaryPurple)),
                  ),
                  const SizedBox(width: 8),
                  InkWell(
                    onTap: value < max ? () => onChanged(value + 1) : null,
                    child: const CircleAvatar(radius: 12, backgroundColor: Colors.white, child: Icon(Icons.add, size: 14, color: AppTheme.primaryPurple)),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryCard(Map<String, dynamic> h) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(h['date'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryTeal.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(h['status'], style: const TextStyle(color: AppTheme.secondaryTeal, fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildMetricPill('BP', h['bp'], Icons.favorite),
              _buildMetricPill('HR', '${h['hr']} bpm', Icons.speed),
              _buildMetricPill('Sugar', '${h['glucose']} mg/dL', Icons.bloodtype),
              _buildMetricPill('Temp', h['temp'], Icons.thermostat),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.bedtime, size: 14, color: AppTheme.primaryPurple),
              const SizedBox(width: 4),
              Text('Sleep: ${h['sleep']}', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
              const Spacer(),
              Text(h['mood'], style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricPill(String label, String val, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 16, color: AppTheme.primaryPurple),
        const SizedBox(height: 2),
        Text(val, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
        Text(label, style: const TextStyle(fontSize: 10, color: AppTheme.textMuted)),
      ],
    );
  }
}
