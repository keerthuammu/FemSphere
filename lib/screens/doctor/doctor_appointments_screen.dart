import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/appointment_model.dart';
import '../../services/api_service.dart';

class DoctorAppointmentsScreen extends StatefulWidget {
  const DoctorAppointmentsScreen({super.key});

  @override
  State<DoctorAppointmentsScreen> createState() => _DoctorAppointmentsScreenState();
}

class _DoctorAppointmentsScreenState extends State<DoctorAppointmentsScreen> {
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
      final rawList = await ApiService.getAppointments();
      final List<AppointmentModel> list = [];
      for (var item in rawList) {
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
        _errorMessage = 'Error loading appointments: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _updateStatus(int id, String newStatus) async {
    try {
      await ApiService.updateAppointmentStatus(id, newStatus);
      setState(() {
        final index = _appointments.indexWhere((a) => a.id == id);
        if (index != -1) {
          _appointments[index] = _appointments[index].copyWith(status: newStatus);
        }
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Appointment status updated to $newStatus!'),
            backgroundColor: (newStatus == 'Confirmed' || newStatus == 'Accepted')
                ? AppTheme.secondaryTeal
                : Colors.red,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update status: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('🗓️ Clinical Appointment Schedule'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadAppointments,
          ),
        ],
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
                          Icon(Icons.event_available, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                          const SizedBox(height: 16),
                          const Text('No appointments in clinical schedule', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                          const SizedBox(height: 6),
                          const Text('Scheduled patient consultations will appear here.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadAppointments,
                      child: ListView.separated(
                        padding: const EdgeInsets.all(16),
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
                                    Row(
                                      children: [
                                        CircleAvatar(
                                          radius: 18,
                                          backgroundColor: AppTheme.secondaryTeal.withValues(alpha: 0.12),
                                          child: const Icon(Icons.person, color: AppTheme.secondaryTeal, size: 18),
                                        ),
                                        const SizedBox(width: 10),
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(appt.userName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark)),
                                            Text(appt.type, style: const TextStyle(fontSize: 11, color: AppTheme.secondaryTeal, fontWeight: FontWeight.bold)),
                                          ],
                                        ),
                                      ],
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
                                const Divider(height: 20),
                                Row(
                                  children: [
                                    const Icon(Icons.access_time, size: 14, color: AppTheme.textMuted),
                                    const SizedBox(width: 4),
                                    Text('${appt.date} • ${appt.timeSlot}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text('Chief Concern: ${appt.reason}', style: const TextStyle(fontSize: 12, color: AppTheme.textDark)),
                                const SizedBox(height: 14),
                                if (appt.status == 'Pending' || appt.status == 'Scheduled') ...[
                                  Row(
                                    children: [
                                      Expanded(
                                        child: OutlinedButton(
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor: Colors.red,
                                            side: const BorderSide(color: Colors.red),
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                          ),
                                          onPressed: () => _updateStatus(appt.id, 'Cancelled'),
                                          child: const Text('Decline'),
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: ElevatedButton(
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: AppTheme.secondaryTeal,
                                            foregroundColor: Colors.white,
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                          ),
                                          onPressed: () => _updateStatus(appt.id, 'Confirmed'),
                                          child: const Text('Accept Visit'),
                                        ),
                                      ),
                                    ],
                                  ),
                                ] else if (appt.status == 'Confirmed' || appt.status == 'Accepted') ...[
                                  SizedBox(
                                    width: double.infinity,
                                    child: ElevatedButton.icon(
                                      icon: Icon(appt.type.contains('Video') ? Icons.videocam : Icons.medical_information),
                                      label: Text(appt.type.contains('Video') ? 'Start Video Consultation' : 'Begin In-Clinic Consult'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppTheme.secondaryTeal,
                                        foregroundColor: Colors.white,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                      ),
                                      onPressed: () {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(content: Text('Starting consultation session with ${appt.userName}...')),
                                        );
                                      },
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
