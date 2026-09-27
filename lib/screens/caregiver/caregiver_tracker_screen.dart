import 'package:flutter/material.dart';
import '../../core/app_theme.dart';

class CaregiverTrackerScreen extends StatefulWidget {
  final String dependentName;

  const CaregiverTrackerScreen({super.key, this.dependentName = 'Sophia Rostova'});

  @override
  State<CaregiverTrackerScreen> createState() => _CaregiverTrackerScreenState();
}

class _CaregiverTrackerScreenState extends State<CaregiverTrackerScreen> {
  double _temp = 98.6;
  double _sleep = 9.5;
  String _appetite = 'Normal / Healthy';
  String _mood = 'Happy & Active 😊';
  final List<String> _selectedSymptoms = [];

  final List<Map<String, dynamic>> _logs = [
    {
      'date': 'Today, 8:00 AM',
      'temp': '98.6°F',
      'sleep': '9.5 hrs',
      'appetite': 'Healthy',
      'mood': 'Happy & Active 😊',
      'symptoms': 'None',
    },
    {
      'date': 'Yesterday, 8:30 PM',
      'temp': '98.8°F',
      'sleep': '10.0 hrs',
      'appetite': 'Mild reduced',
      'mood': 'Mild Fatigue 🥱',
      'symptoms': 'Slight nasal congestion',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final symptomOptions = ['Cough', 'Runny Nose', 'Fever', 'Tummy Ache', 'Rash', 'Fatigue'];

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: Text('📊 Vitals Log: ${widget.dependentName}'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: AppTheme.borderPurple),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Log Daily Vitals for ${widget.dependentName}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Temperature: ${_temp.toStringAsFixed(1)}°F', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: _temp > 99.5 ? Colors.red.withValues(alpha: 0.12) : AppTheme.secondaryTeal.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(_temp > 99.5 ? 'Mild Fever' : 'Normal', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: _temp > 99.5 ? Colors.red : AppTheme.secondaryTeal)),
                      ),
                    ],
                  ),
                  Slider(
                    value: _temp,
                    min: 96.0,
                    max: 104.0,
                    divisions: 80,
                    activeColor: const Color(0xFFEC4899),
                    onChanged: (val) => setState(() => _temp = val),
                  ),
                  const SizedBox(height: 12),
                  Text('Sleep Duration: ${_sleep.toStringAsFixed(1)} Hours', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  Slider(
                    value: _sleep,
                    min: 4.0,
                    max: 14.0,
                    divisions: 20,
                    activeColor: AppTheme.primaryPurple,
                    onChanged: (val) => setState(() => _sleep = val),
                  ),
                  const SizedBox(height: 12),
                  const Text('Observed Symptoms', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: symptomOptions.map((symp) {
                      final isSel = _selectedSymptoms.contains(symp);
                      return FilterChip(
                        label: Text(symp, style: TextStyle(fontSize: 12, color: isSel ? Colors.white : AppTheme.textDark)),
                        selected: isSel,
                        selectedColor: const Color(0xFFEC4899),
                        onSelected: (selected) {
                          setState(() {
                            if (selected) {
                              _selectedSymptoms.add(symp);
                            } else {
                              _selectedSymptoms.remove(symp);
                            }
                          });
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.check),
                      label: const Text('Save Daily Log', style: TextStyle(fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEC4899),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () {
                        setState(() {
                          _logs.insert(0, {
                            'date': 'Just now',
                            'temp': '${_temp.toStringAsFixed(1)}°F',
                            'sleep': '${_sleep.toStringAsFixed(1)} hrs',
                            'appetite': _appetite,
                            'mood': _mood,
                            'symptoms': _selectedSymptoms.isEmpty ? 'None' : _selectedSymptoms.join(', '),
                          });
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Vitals logged for ${widget.dependentName}!')),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('📜 Observation History', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
            const SizedBox(height: 12),
            ..._logs.map((log) {
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
                        Text(log['date'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark)),
                        Text('Temp: ${log['temp']}', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFEC4899), fontSize: 13)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text('Sleep: ${log['sleep']} • Mood: ${log['mood']}', style: const TextStyle(fontSize: 12, color: AppTheme.textDark)),
                    const SizedBox(height: 4),
                    Text('Symptoms: ${log['symptoms']}', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                  ],
                ),
              );
            }),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
