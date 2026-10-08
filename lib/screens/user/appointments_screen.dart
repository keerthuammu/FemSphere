import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/appointment_model.dart';
import '../../services/api_service.dart';

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<AppointmentModel> _appointments = [];
  bool _isLoading = true;
  String? _errorMessage;

  List<Map<String, String>> _availableDoctors = [
    {
      'name': 'Dr. Sarah Jenkins',
      'specialty': 'Obstetrics & Gynecology',
      'experience': '14 yrs exp',
      'rating': '4.9 ★ (128 reviews)',
      'fee': '\$80',
    },
    {
      'name': 'Dr. Maya Patel',
      'specialty': 'Reproductive Endocrinology & Fertility',
      'experience': '11 yrs exp',
      'rating': '4.8 ★ (94 reviews)',
      'fee': '\$95',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadAppointments();
    _loadDoctors();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
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

  Future<void> _loadDoctors() async {
    try {
      final raw = await ApiService.getDoctors();
      if (raw.isNotEmpty) {
        final List<Map<String, String>> list = [];
        for (var doc in raw) {
          if (doc is Map<String, dynamic>) {
            list.add({
              'name': doc['full_name'] ?? doc['name'] ?? 'Dr. Specialist',
              'specialty': doc['specialization'] ?? 'Women\'s Health',
              'experience': '${doc['years_experience'] ?? '5'} yrs exp',
              'rating': '5.0 ★',
              'fee': '\$75',
            });
          }
        }
        if (list.isNotEmpty) {
          setState(() => _availableDoctors = list);
        }
      }
    } catch (e) {
      // fallback to defaults
    }
  }

  void _openBookingModal([Map<String, String>? doctor]) {
    String selectedDoctor = doctor != null ? doctor['name']! : _availableDoctors.first['name']!;
    String selectedSpecialty = doctor != null ? doctor['specialty']! : _availableDoctors.first['specialty']!;
    String selectedType = 'Video Consultation';
    DateTime selectedDate = DateTime.now().add(const Duration(days: 2));
    String selectedSlot = '10:30 AM';
    final reasonController = TextEditingController(text: 'Routine Health Twin Consult');

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
                          '📅 Book Consultation',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Text('Select Doctor', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String>(
                      isExpanded: true,
                      initialValue: selectedDoctor,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      ),
                      items: _availableDoctors.map((d) {
                        return DropdownMenuItem<String>(
                          value: d['name'],
                          child: Text(
                            '${d['name']} (${d['specialty']})',
                            style: const TextStyle(fontSize: 13),
                            overflow: TextOverflow.ellipsis,
                          ),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setModalState(() {
                            selectedDoctor = val;
                            final docObj = _availableDoctors.firstWhere((d) => d['name'] == val);
                            selectedSpecialty = docObj['specialty']!;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    const Text('Consultation Type', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Expanded(
                          child: ChoiceChip(
                            label: const Text('📹 Video Call'),
                            selected: selectedType == 'Video Consultation',
                            onSelected: (selected) {
                              if (selected) setModalState(() => selectedType = 'Video Consultation');
                            },
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ChoiceChip(
                            label: const Text('🏥 In-Clinic'),
                            selected: selectedType == 'In-Clinic Visit',
                            onSelected: (selected) {
                              if (selected) setModalState(() => selectedType = 'In-Clinic Visit');
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Text('Available Time Slots', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'].map((slot) {
                        final isSel = selectedSlot == slot;
                        return ChoiceChip(
                          label: Text(slot, style: TextStyle(fontSize: 12, color: isSel ? Colors.white : AppTheme.textDark)),
                          selected: isSel,
                          selectedColor: AppTheme.primaryPurple,
                          onSelected: (sel) {
                            if (sel) setModalState(() => selectedSlot = slot);
                          },
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: reasonController,
                      decoration: InputDecoration(
                        labelText: 'Reason for Visit / Symptoms',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryPurple,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () async {
                          final dateStr = '${selectedDate.year}-${selectedDate.month.toString().padLeft(2, '0')}-${selectedDate.day.toString().padLeft(2, '0')}';
                          final payload = {
                            'doctor': selectedDoctor,
                            'specialty': selectedSpecialty,
                            'date': dateStr,
                            'time': selectedSlot,
                            'type': selectedType,
                            'reason': reasonController.text.trim().isEmpty ? 'General Consultation' : reasonController.text.trim(),
                          };

                          final messenger = ScaffoldMessenger.of(context);
                          try {
                            await ApiService.bookAppointment(payload);
                            if (ctx.mounted) {
                              Navigator.pop(ctx);
                            }
                            messenger.showSnackBar(
                              SnackBar(
                                content: Text('Appointment booked successfully with $selectedDoctor!'),
                                backgroundColor: AppTheme.secondaryTeal,
                              ),
                            );
                            if (mounted) {
                              _loadAppointments();
                            }
                          } catch (e) {
                            messenger.showSnackBar(
                              SnackBar(content: Text('Failed to book: $e'), backgroundColor: Colors.red),
                            );
                          }
                        },
                        child: const Text('Confirm Booking', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
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
    final upcomingList = _appointments.where((a) => a.status == 'Confirmed' || a.status == 'Pending' || a.status == 'Scheduled' || a.status == 'Accepted').toList();
    final pastList = _appointments.where((a) => a.status == 'Completed' || a.status == 'Cancelled' || a.status == 'Rejected').toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('🩺 Doctor Appointments'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadAppointments),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppTheme.primaryPurple,
          unselectedLabelColor: AppTheme.textMuted,
          indicatorColor: AppTheme.primaryPurple,
          tabs: [
            Tab(text: 'Upcoming (${upcomingList.length})'),
            Tab(text: 'Past History (${pastList.length})'),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primaryPurple,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Book Appointment'),
        onPressed: () => _openBookingModal(),
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
              : TabBarView(
                  controller: _tabController,
                  children: [
                    // Tab 1: Upcoming Appointments & Doctors Directory
                    RefreshIndicator(
                      onRefresh: _loadAppointments,
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (upcomingList.isEmpty)
                              Container(
                                padding: const EdgeInsets.all(24),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: AppTheme.borderPurple),
                                ),
                                child: Center(
                                  child: Column(
                                    children: [
                                      const Icon(Icons.calendar_today, size: 40, color: AppTheme.primaryPurple),
                                      const SizedBox(height: 12),
                                      const Text('No Upcoming Appointments', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                      const SizedBox(height: 6),
                                      const Text('Book a consultation with certified OB/GYN doctors.', style: TextStyle(color: AppTheme.textMuted, fontSize: 13)),
                                      const SizedBox(height: 16),
                                      ElevatedButton(
                                        onPressed: () => _openBookingModal(),
                                        child: const Text('Find a Doctor'),
                                      ),
                                    ],
                                  ),
                                ),
                              )
                            else
                              ...upcomingList.map((appt) => _buildAppointmentCard(appt)),
                            const SizedBox(height: 24),
                            const Text(
                              '🌟 Certified Specialists Directory',
                              style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                            ),
                            const SizedBox(height: 12),
                            ..._availableDoctors.map((doc) => _buildDoctorDirectoryCard(doc)),
                            const SizedBox(height: 80),
                          ],
                        ),
                      ),
                    ),

                    // Tab 2: Past History
                    RefreshIndicator(
                      onRefresh: _loadAppointments,
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            if (pastList.isEmpty)
                              Container(
                                padding: const EdgeInsets.all(24),
                                width: double.infinity,
                                child: const Center(
                                  child: Text('No previous appointment records found.', style: TextStyle(color: AppTheme.textMuted)),
                                ),
                              )
                            else
                              ...pastList.map((appt) => _buildAppointmentCard(appt, isPast: true)),
                            const SizedBox(height: 80),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
    );
  }

  Widget _buildAppointmentCard(AppointmentModel appt, {bool isPast = false}) {
    Color statusColor = AppTheme.secondaryTeal;
    if (appt.status == 'Pending' || appt.status == 'Scheduled') statusColor = Colors.orange;
    if (appt.status == 'Cancelled' || appt.status == 'Rejected') statusColor = Colors.red;

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderPurple),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
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
                  CircleAvatar(
                    backgroundColor: AppTheme.primaryPurple.withValues(alpha: 0.1),
                    child: const Icon(Icons.medical_services, color: AppTheme.primaryPurple, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(appt.doctorName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                      Text(appt.doctorSpecialty, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
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
                child: Text(
                  appt.status,
                  style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 11),
                ),
              ),
            ],
          ),
          const Divider(height: 24),
          Row(
            children: [
              const Icon(Icons.access_time, size: 14, color: AppTheme.textMuted),
              const SizedBox(width: 4),
              Text('${appt.date} • ${appt.timeSlot}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
              const Spacer(),
              Text(appt.type, style: const TextStyle(fontSize: 12, color: AppTheme.secondaryTeal, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 6),
          Text(appt.reason, style: const TextStyle(fontSize: 12, color: AppTheme.textDark)),
        ],
      ),
    );
  }

  Widget _buildDoctorDirectoryCard(Map<String, String> doc) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundColor: const Color(0xFFCCFBF1),
            child: Text(
              doc['name']!.split(' ').last[0],
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.secondaryTeal),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(doc['name']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark)),
                const SizedBox(height: 2),
                Text(doc['specialty']!, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(doc['rating']!, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.amber)),
                    const SizedBox(width: 8),
                    Text(doc['experience']!, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                  ],
                ),
              ],
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryPurple,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () => _openBookingModal(doc),
            child: const Text('Book', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
