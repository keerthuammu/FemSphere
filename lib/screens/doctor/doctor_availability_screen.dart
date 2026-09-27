import 'package:flutter/material.dart';
import '../../core/app_theme.dart';

class DoctorAvailabilityScreen extends StatefulWidget {
  const DoctorAvailabilityScreen({super.key});

  @override
  State<DoctorAvailabilityScreen> createState() => _DoctorAvailabilityScreenState();
}

class _DoctorAvailabilityScreenState extends State<DoctorAvailabilityScreen> {
  int _fee = 80;
  final Map<String, bool> _workingDays = {
    'Monday': true,
    'Tuesday': true,
    'Wednesday': true,
    'Thursday': true,
    'Friday': true,
    'Saturday': false,
    'Sunday': false,
  };

  final Map<String, bool> _slots = {
    '09:00 AM – 10:00 AM': true,
    '10:30 AM – 11:30 AM': true,
    '02:00 PM – 03:00 PM': true,
    '03:30 PM – 04:30 PM': true,
    '05:00 PM – 06:00 PM': false,
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('⏱️ Practice Availability & Fees'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Fee Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.borderPurple),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Consultation Standard Fee', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('\$$_fee USD / 45 min', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.secondaryTeal)),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove_circle_outline, color: AppTheme.secondaryTeal),
                            onPressed: _fee > 30 ? () => setState(() => _fee -= 5) : null,
                          ),
                          IconButton(
                            icon: const Icon(Icons.add_circle_outline, color: AppTheme.secondaryTeal),
                            onPressed: _fee < 300 ? () => setState(() => _fee += 5) : null,
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Working Days
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.borderPurple),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Active Clinic Working Days', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                  const SizedBox(height: 12),
                  ..._workingDays.entries.map((entry) {
                    return SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(entry.key, style: const TextStyle(fontSize: 14)),
                      value: entry.value,
                      activeColor: AppTheme.secondaryTeal,
                      onChanged: (val) => setState(() => _workingDays[entry.key] = val),
                    );
                  }),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Daily Time Slots
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.borderPurple),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Standard Telehealth & In-Clinic Slots', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                  const SizedBox(height: 12),
                  ..._slots.entries.map((entry) {
                    return CheckboxListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(entry.key, style: const TextStyle(fontSize: 14)),
                      value: entry.value,
                      activeColor: AppTheme.secondaryTeal,
                      onChanged: (val) {
                        if (val != null) setState(() => _slots[entry.key] = val);
                      },
                    );
                  }),
                ],
              ),
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: const Icon(Icons.save),
                label: const Text('Save Availability Schedule', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.secondaryTeal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Doctor schedule and fees published successfully!'),
                      backgroundColor: AppTheme.secondaryTeal,
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
