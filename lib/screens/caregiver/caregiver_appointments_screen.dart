import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/appointment_model.dart';
import '../../services/api_service.dart';

class CaregiverAppointmentsScreen extends StatefulWidget {
  final String dependentName;

  const CaregiverAppointmentsScreen({super.key, this.dependentName = 'Dependent'});

  @override
  State<CaregiverAppointmentsScreen> createState() => _CaregiverAppointmentsScreenState();
}

class _CaregiverAppointmentsScreenState extends State<CaregiverAppointmentsScreen> {
  List<AppointmentModel> _appointments = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadAppointments();
  }

  Future<void> _loadAppointments() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final raw = await ApiService.getAppointments();
      final List<AppointmentModel> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add(AppointmentModel.fromJson(item));
        }
      }
      setState(() {
        _appointments = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load appointments: $e';
        _isLoading = false;
      });
    }
  }

  void _openBookDependentAppointmentModal() {
    final docController = TextEditingController(text: 'Dr. Sarah Jenkins');
    final reasonController = TextEditingController(text: 'Routine Wellness Check');
    final dateController = TextEditingController(text: DateTime.now().add(const Duration(days: 2)).toString().split(' ')[0]);
    String selectedTime = '11:00 AM';
    String selectedType = 'In-Clinic';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 24,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          '📅 Book Care Consultation',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                        ),
                        IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: docController,
                      decoration: const InputDecoration(labelText: 'Attending Doctor / Specialist', border: OutlineInputBorder()),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: dateController,
                      decoration: const InputDecoration(labelText: 'Date (YYYY-MM-DD)', border: OutlineInputBorder()),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: selectedTime,
                      decoration: const InputDecoration(labelText: 'Available Slot', border: OutlineInputBorder()),
                      items: const ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:30 PM']
                          .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) setModalState(() => selectedTime = val);
                      },
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: selectedType,
                      decoration: const InputDecoration(labelText: 'Consultation Format', border: OutlineInputBorder()),
                      items: const [
                        DropdownMenuItem(value: 'In-Clinic', child: Text('In-Clinic Visit')),
                        DropdownMenuItem(value: 'Virtual Telehealth', child: Text('Virtual Telehealth Video')),
                      ],
                      onChanged: (val) {
                        if (val != null) setModalState(() => selectedType = val);
                      },
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: reasonController,
                      decoration: const InputDecoration(labelText: 'Reason for Visit', border: OutlineInputBorder()),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryPurple,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () async {
                          final payload = {
                            'doctor': docController.text.trim(),
                            'date': dateController.text.trim(),
                            'time': selectedTime,
                            'reason': '${widget.dependentName}: ${reasonController.text.trim()}',
                            'type': selectedType,
                          };

                          try {
                            await ApiService.bookAppointment(payload);
                            if (mounted) {
                              Navigator.pop(ctx);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Appointment booked successfully!'), backgroundColor: AppTheme.secondaryTeal),
                              );
                              _loadAppointments();
                            }
                          } catch (e) {
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Failed to book: $e'), backgroundColor: Colors.red),
                              );
                            }
                          }
                        },
                        child: const Text('Confirm Booking', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: Text('🩺 ${widget.dependentName} Consults'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadAppointments),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primaryPurple,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Book Appointment'),
        onPressed: _openBookDependentAppointmentModal,
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
                        const Icon(Icons.cloud_off, size: 48, color: Colors.grey),
                        const SizedBox(height: 12),
                        Text(_errorMessage!, textAlign: TextAlign.center, style: const TextStyle(color: AppTheme.textMuted)),
                        const SizedBox(height: 16),
                        ElevatedButton(onPressed: _loadAppointments, child: const Text('Retry')),
                      ],
                    ),
                  ),
                )
              : _appointments.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.calendar_today_outlined, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                          const SizedBox(height: 16),
                          const Text('No consultations scheduled', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                          const SizedBox(height: 6),
                          const Text('Tap "Book Appointment" to schedule care visits.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadAppointments,
                      child: ListView.separated(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                        itemCount: _appointments.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final appt = _appointments[index];
                          Color statusColor = AppTheme.secondaryTeal;
                          if (appt.status == 'Pending' || appt.status == 'Scheduled') statusColor = Colors.orange;
                          if (appt.status == 'Cancelled' || appt.status == 'Rejected') statusColor = Colors.red;

                          return Container(
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
                                    Expanded(
                                      child: Text(appt.doctorName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark)),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: statusColor.withValues(alpha: 0.12),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(appt.status, style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.bold)),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(appt.doctorSpecialty, style: const TextStyle(fontSize: 12, color: AppTheme.secondaryTeal, fontWeight: FontWeight.w600)),
                                const Divider(height: 20),
                                Row(
                                  children: [
                                    const Icon(Icons.access_time, size: 14, color: AppTheme.textMuted),
                                    const SizedBox(width: 4),
                                    Text('${appt.date} • ${appt.timeSlot}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                                    const Spacer(),
                                    Text(appt.type, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text('Reason: ${appt.reason}', style: const TextStyle(fontSize: 12, color: AppTheme.textDark)),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
