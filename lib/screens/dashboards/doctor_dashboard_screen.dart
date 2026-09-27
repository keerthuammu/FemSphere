import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../auth/login_screen.dart';
import '../doctor/doctor_patients_screen.dart';
import '../doctor/doctor_records_screen.dart';
import '../doctor/doctor_consultations_screen.dart';
import '../doctor/doctor_appointments_screen.dart';
import '../doctor/doctor_availability_screen.dart';
import '../doctor/doctor_profile_screen.dart';

class DoctorDashboardScreen extends StatefulWidget {
  const DoctorDashboardScreen({super.key});

  @override
  State<DoctorDashboardScreen> createState() => _DoctorDashboardScreenState();
}

class _DoctorDashboardScreenState extends State<DoctorDashboardScreen> {
  int _selectedNavIndex = 0;
  Map<String, dynamic> _stats = {
    'activePatients': 0,
    'appointmentsCount': 0,
    'notesCount': 0,
    'patientSatisfaction': '5.0 ★',
  };
  List<dynamic> _recentAppointments = [];

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    try {
      final res = await ApiService.getDoctorDashboardStats();
      final appts = await ApiService.getAppointments();
      if (mounted) {
        setState(() {
          if (res['stats'] != null) {
            _stats = res['stats'] as Map<String, dynamic>;
          }
          _recentAppointments = appts;
        });
      }
    } catch (e) {
      // ignore
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.currentUser;

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: Row(
          children: [
            const CircleAvatar(
              radius: 14,
              backgroundColor: Color(0xFFCCFBF1),
              child: Icon(Icons.medical_services, size: 16, color: AppTheme.secondaryTeal),
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  user?.fullName ?? 'Dr. Sarah Jenkins',
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                ),
                const Text(
                  'Obstetrics & Gynecology • Verified MD',
                  style: TextStyle(fontSize: 10, color: AppTheme.secondaryTeal, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_outline, color: AppTheme.secondaryTeal),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const DoctorProfileScreen()));
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: AppTheme.textMuted),
            onPressed: () {
              auth.logout();
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
            },
          ),
        ],
      ),
      drawer: _buildDoctorDrawer(context, user, auth),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedNavIndex,
        onDestinationSelected: (index) {
          setState(() {
            _selectedNavIndex = index;
          });
        },
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFFCCFBF1),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard, color: AppTheme.secondaryTeal),
            label: 'Overview',
          ),
          NavigationDestination(
            icon: Icon(Icons.people_outline),
            selectedIcon: Icon(Icons.people, color: AppTheme.secondaryTeal),
            label: 'Patients',
          ),
          NavigationDestination(
            icon: Icon(Icons.edit_note_outlined),
            selectedIcon: Icon(Icons.edit_note, color: AppTheme.secondaryTeal),
            label: 'Consults',
          ),
          NavigationDestination(
            icon: Icon(Icons.folder_shared_outlined),
            selectedIcon: Icon(Icons.folder_shared, color: AppTheme.secondaryTeal),
            label: 'Records',
          ),
        ],
      ),
      body: _buildSelectedBody(user?.fullName ?? 'Dr. Sarah Jenkins'),
    );
  }

  Widget _buildSelectedBody(String doctorName) {
    if (_selectedNavIndex == 1) return const DoctorPatientsScreen();
    if (_selectedNavIndex == 2) return const DoctorConsultationsScreen();
    if (_selectedNavIndex == 3) return const DoctorRecordsScreen();

    // Default: Tab 0 Overview
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Doctor Hero Banner
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0D9488), Color(0xFF14B8A6)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF0D9488).withValues(alpha: 0.3),
                  blurRadius: 15,
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
                    Text(
                      'Clinical Practice: $doctorName',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text('MD-892401', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'Telehealth consultations, digital prescriptions, patient health twin telemetry inspection, and schedule management.',
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Practice Metrics
          Row(
            children: [
              Expanded(
                child: _buildMetricTile(
                  title: 'Active Patients',
                  value: _stats['activePatients']?.toString() ?? '0',
                  icon: Icons.people,
                  color: AppTheme.secondaryTeal,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricTile(
                  title: 'Appointments Today',
                  value: _stats['appointmentsCount']?.toString() ?? '0',
                  icon: Icons.calendar_today,
                  color: AppTheme.primaryPurple,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricTile(
                  title: 'Consultations',
                  value: _stats['notesCount']?.toString() ?? '0',
                  icon: Icons.medical_services,
                  color: Colors.orange,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Next Patient Up Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.borderPurple),
            ),
            child: _recentAppointments.isNotEmpty
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('⏰ Next Patient Up', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(color: const Color(0xFFCCFBF1), borderRadius: BorderRadius.circular(8)),
                            child: Text(
                              '${_recentAppointments.first['appointment_time'] ?? _recentAppointments.first['timeSlot'] ?? 'Scheduled'}',
                              style: const TextStyle(color: AppTheme.secondaryTeal, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 20,
                            backgroundColor: const Color(0xFFF3E8FF),
                            child: Text(
                              (_recentAppointments.first['patient_name'] ?? _recentAppointments.first['userName'] ?? 'P')[0].toUpperCase(),
                              style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryPurple),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${_recentAppointments.first['patient_name'] ?? _recentAppointments.first['userName'] ?? 'Patient'}',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                ),
                                Text(
                                  '${_recentAppointments.first['reason'] ?? 'Routine consultation'}',
                                  style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              icon: const Icon(Icons.folder, size: 16),
                              label: const Text('View Vault', style: TextStyle(fontSize: 12)),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppTheme.secondaryTeal,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              onPressed: () => setState(() => _selectedNavIndex = 3),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton.icon(
                              icon: const Icon(Icons.videocam, size: 16),
                              label: const Text('Start Consult', style: TextStyle(fontSize: 12)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.secondaryTeal,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Starting consultation for ${_recentAppointments.first['patient_name'] ?? 'Patient'}...')),
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                    ],
                  )
                : const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 8),
                      child: Text('No upcoming patients booked currently.', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                    ),
                  ),
          ),
          const SizedBox(height: 20),

          // Clinical Quick Access Grid
          const Text(
            '🩺 Practice Management Modules',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: _buildDoctorHubCard(
                  title: 'Patient Directory',
                  subtitle: '142 Health Twins',
                  icon: Icons.people,
                  color: AppTheme.secondaryTeal,
                  onTap: () => setState(() => _selectedNavIndex = 1),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildDoctorHubCard(
                  title: 'Digital Prescriptions',
                  subtitle: 'Rx & Clinical Notes',
                  icon: Icons.edit_document,
                  color: AppTheme.primaryPurple,
                  onTap: () => setState(() => _selectedNavIndex = 2),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: _buildDoctorHubCard(
                  title: 'Appointments',
                  subtitle: 'Approve & Reschedule',
                  icon: Icons.calendar_month,
                  color: const Color(0xFF6366F1),
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const DoctorAppointmentsScreen()));
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildDoctorHubCard(
                  title: 'Availability & Fees',
                  subtitle: '\$80 / 45 min slots',
                  icon: Icons.access_time,
                  color: Colors.amber.shade800,
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const DoctorAvailabilityScreen()));
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          _buildDoctorHubCard(
            title: 'Physician Credentials & Bio',
            subtitle: 'MD license, clinic address & qualifications',
            icon: Icons.verified_user,
            color: const Color(0xFFEC4899),
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const DoctorProfileScreen()));
            },
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildMetricTile({required String title, required String value, required IconData icon, required Color color}) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
          Text(title, style: const TextStyle(fontSize: 10, color: AppTheme.textMuted)),
        ],
      ),
    );
  }

  Widget _buildDoctorHubCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppTheme.borderPurple),
        ),
        child: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: color.withValues(alpha: 0.12),
              child: Icon(icon, size: 18, color: color),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark)),
                  Text(subtitle, style: const TextStyle(fontSize: 10, color: AppTheme.textMuted), maxLines: 1, overflow: TextOverflow.ellipsis),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDoctorDrawer(BuildContext context, dynamic user, AuthProvider auth) {
    return Drawer(
      backgroundColor: const Color(0xFFFAF8FC),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(20, 48, 20, 20),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF0D9488), Color(0xFF14B8A6)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: Colors.white,
                  child: Icon(Icons.medical_services, color: AppTheme.secondaryTeal, size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user?.fullName ?? 'Dr. Sarah Jenkins',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Physician Portal • MD-892401',
                        style: TextStyle(color: Colors.white70, fontSize: 11),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          'Verified Practitioner',
                          style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 8),
              children: [
                _buildDrawerTile(
                  title: 'Clinical Practice Overview',
                  icon: Icons.dashboard,
                  color: AppTheme.secondaryTeal,
                  isSelected: _selectedNavIndex == 0,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 0);
                  },
                ),
                _buildDrawerTile(
                  title: 'Patient Directory & Twins',
                  icon: Icons.people,
                  color: AppTheme.secondaryTeal,
                  isSelected: _selectedNavIndex == 1,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 1);
                  },
                ),
                _buildDrawerTile(
                  title: 'Consultations & Digital Rx',
                  icon: Icons.edit_note,
                  color: AppTheme.primaryPurple,
                  isSelected: _selectedNavIndex == 2,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 2);
                  },
                ),
                _buildDrawerTile(
                  title: 'Shared Patient Records Vault',
                  icon: Icons.folder_shared,
                  color: AppTheme.secondaryTeal,
                  isSelected: _selectedNavIndex == 3,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 3);
                  },
                ),
                _buildDrawerTile(
                  title: 'Appointment Requests & Schedule',
                  icon: Icons.calendar_month,
                  color: const Color(0xFF6366F1),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const DoctorAppointmentsScreen()));
                  },
                ),
                _buildDrawerTile(
                  title: 'Practice Availability & Fees',
                  icon: Icons.access_time,
                  color: Colors.amber.shade800,
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const DoctorAvailabilityScreen()));
                  },
                ),
                _buildDrawerTile(
                  title: 'Physician Credentials & Profile',
                  icon: Icons.verified_user,
                  color: const Color(0xFFEC4899),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const DoctorProfileScreen()));
                  },
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Log Out', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 13)),
            onTap: () {
              auth.logout();
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerTile({
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
    bool isSelected = false,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
      decoration: BoxDecoration(
        color: isSelected ? color.withValues(alpha: 0.12) : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        dense: true,
        leading: Icon(icon, color: color, size: 20),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            color: isSelected ? color : AppTheme.textDark,
          ),
        ),
        onTap: onTap,
      ),
    );
  }
}
