import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../models/dependent_model.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../auth/login_screen.dart';
import '../caregiver/dependents_screen.dart';
import '../caregiver/caregiver_records_screen.dart';
import '../caregiver/vaccinations_screen.dart';
import '../caregiver/medications_screen.dart';
import '../caregiver/caregiver_appointments_screen.dart';
import '../caregiver/caregiver_tracker_screen.dart';
import '../caregiver/caregiver_reports_screen.dart';

class CaregiverDashboardScreen extends StatefulWidget {
  const CaregiverDashboardScreen({super.key});

  @override
  State<CaregiverDashboardScreen> createState() => _CaregiverDashboardScreenState();
}

class _CaregiverDashboardScreenState extends State<CaregiverDashboardScreen> {
  int _selectedNavIndex = 0;
  List<DependentModel> _dependents = [];
  late DependentModel _activeDependent;

  @override
  void initState() {
    super.initState();
    _activeDependent = DependentModel(
      id: 0,
      fullName: 'Dependent',
      relationship: 'Care Recipient',
      dob: '2022-01-01',
      bloodGroup: 'A+',
    );
    _loadDependents();
  }

  Future<void> _loadDependents() async {
    try {
      final raw = await ApiService.getDependents();
      final List<DependentModel> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add(DependentModel.fromJson(item));
        }
      }
      if (mounted && list.isNotEmpty) {
        setState(() {
          _dependents = list;
          _activeDependent = list.first;
        });
      }
    } catch (e) {
      // offline
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
        title: DropdownButtonHideUnderline(
          child: DropdownButton<int>(
            value: _activeDependent.id,
            icon: const Icon(Icons.keyboard_arrow_down, color: Color(0xFFEC4899)),
            items: _dependents.map((dep) {
              return DropdownMenuItem<int>(
                value: dep.id,
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 12,
                      backgroundColor: const Color(0xFFFCE7F3),
                      child: Text(
                        dep.fullName[0],
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFEC4899)),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      dep.fullName,
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '(${dep.relationship.split(' ')[0]})',
                      style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                    ),
                  ],
                ),
              );
            }).toList(),
            onChanged: (id) {
              if (id != null) {
                setState(() {
                  _activeDependent = _dependents.firstWhere((d) => d.id == id);
                });
              }
            },
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.group_add_outlined, color: Color(0xFFEC4899)),
            tooltip: 'Manage Dependents',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => DependentsScreen(
                    onSelectDependent: (dep) {
                      setState(() => _activeDependent = dep);
                    },
                  ),
                ),
              );
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
      drawer: _buildCaregiverDrawer(context, user, auth),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedNavIndex,
        onDestinationSelected: (index) {
          setState(() {
            _selectedNavIndex = index;
          });
        },
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFFFCE7F3),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard, color: Color(0xFFEC4899)),
            label: 'Overview',
          ),
          NavigationDestination(
            icon: Icon(Icons.medication_outlined),
            selectedIcon: Icon(Icons.medication, color: Color(0xFFEC4899)),
            label: 'Medications',
          ),
          NavigationDestination(
            icon: Icon(Icons.vaccines_outlined),
            selectedIcon: Icon(Icons.vaccines, color: Color(0xFFEC4899)),
            label: 'Vaccines',
          ),
          NavigationDestination(
            icon: Icon(Icons.folder_outlined),
            selectedIcon: Icon(Icons.folder, color: Color(0xFFEC4899)),
            label: 'Vault',
          ),
        ],
      ),
      body: _buildSelectedBody(user?.fullName ?? 'Marcus Caregiver'),
    );
  }

  Widget _buildSelectedBody(String caregiverName) {
    if (_selectedNavIndex == 1) {
      return MedicationsScreen(dependentName: _activeDependent.fullName);
    }
    if (_selectedNavIndex == 2) {
      return VaccinationsScreen(dependentName: _activeDependent.fullName);
    }
    if (_selectedNavIndex == 3) {
      return CaregiverRecordsScreen(dependentName: _activeDependent.fullName);
    }

    // Default: Tab 0 Overview
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Caregiver Hero Banner
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFEC4899), Color(0xFFBE185D)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFEC4899).withValues(alpha: 0.3),
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
                      'Caregiver: $caregiverName',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${_dependents.length} Linked Family Members',
                        style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Currently monitoring ${_activeDependent.fullName} (${_activeDependent.relationship}). All medications, vaccines, and vitals logged in real-time.',
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Next Dose Pill Alert
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFFCE7F3), width: 1.5),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 20,
                  backgroundColor: Color(0xFFFCE7F3),
                  child: Icon(Icons.alarm, color: Color(0xFFEC4899), size: 22),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '⏰ Upcoming Dose: Amoxicillin 250mg',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Due today at 8:00 PM with dinner • Sophia Rostova',
                        style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEC4899),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  onPressed: () => setState(() => _selectedNavIndex = 1),
                  child: const Text('Log Dose', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Modular Quick Access Hub
          const Text(
            '🤝 Caregiver Management Modules',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: _buildCareHubCard(
                  title: 'Dependents',
                  subtitle: '${_dependents.length} Linked Profiles',
                  icon: Icons.family_restroom,
                  color: const Color(0xFFEC4899),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => DependentsScreen(
                          onSelectDependent: (dep) => setState(() => _activeDependent = dep),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildCareHubCard(
                  title: 'Medications',
                  subtitle: '${_activeDependent.activeMedicationsCount} Active Rx',
                  icon: Icons.medication,
                  color: Colors.blue,
                  onTap: () => setState(() => _selectedNavIndex = 1),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: _buildCareHubCard(
                  title: 'Immunizations',
                  subtitle: '${_activeDependent.pendingVaccinesCount} Booster Due',
                  icon: Icons.vaccines,
                  color: Colors.amber.shade800,
                  onTap: () => setState(() => _selectedNavIndex = 2),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildCareHubCard(
                  title: 'Medical Vault',
                  subtitle: 'PDFs & Lab Tests',
                  icon: Icons.folder,
                  color: AppTheme.secondaryTeal,
                  onTap: () => setState(() => _selectedNavIndex = 3),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: _buildCareHubCard(
                  title: 'Doctor Visits',
                  subtitle: 'Book & Schedule',
                  icon: Icons.calendar_month,
                  color: AppTheme.primaryPurple,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => CaregiverAppointmentsScreen(dependentName: _activeDependent.fullName),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildCareHubCard(
                  title: 'Daily Tracker',
                  subtitle: 'Temp, Sleep, Mood',
                  icon: Icons.monitor_heart,
                  color: const Color(0xFF10B981),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => CaregiverTrackerScreen(dependentName: _activeDependent.fullName),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          _buildCareHubCard(
            title: 'Growth & Longitudinal Reports',
            subtitle: 'Pediatric milestones, growth percentiles & PDF exports',
            icon: Icons.auto_graph,
            color: const Color(0xFF6366F1),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => CaregiverReportsScreen(dependentName: _activeDependent.fullName),
                ),
              );
            },
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildCareHubCard({
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

  Widget _buildCaregiverDrawer(BuildContext context, dynamic user, AuthProvider auth) {
    return Drawer(
      backgroundColor: const Color(0xFFFAF8FC),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(20, 48, 20, 20),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFEC4899), Color(0xFFBE185D)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: Colors.white,
                  child: Icon(Icons.family_restroom, color: Color(0xFFEC4899), size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user?.fullName ?? 'Marcus Caregiver',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Caregiver Network Manager',
                        style: TextStyle(color: Colors.white70, fontSize: 11),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          'Active: ${_activeDependent.fullName}',
                          style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
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
                  title: 'Care Overview',
                  icon: Icons.dashboard,
                  color: const Color(0xFFEC4899),
                  isSelected: _selectedNavIndex == 0,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 0);
                  },
                ),
                _buildDrawerTile(
                  title: 'Care Dependents Directory',
                  icon: Icons.family_restroom,
                  color: const Color(0xFFEC4899),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => DependentsScreen(
                          onSelectDependent: (dep) => setState(() => _activeDependent = dep),
                        ),
                      ),
                    );
                  },
                ),
                _buildDrawerTile(
                  title: 'Medication & Pill Schedules',
                  icon: Icons.medication,
                  color: Colors.blue,
                  isSelected: _selectedNavIndex == 1,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 1);
                  },
                ),
                _buildDrawerTile(
                  title: 'Immunization & Vaccines',
                  icon: Icons.vaccines,
                  color: Colors.amber.shade800,
                  isSelected: _selectedNavIndex == 2,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 2);
                  },
                ),
                _buildDrawerTile(
                  title: 'Dependent Medical Vault',
                  icon: Icons.folder,
                  color: AppTheme.secondaryTeal,
                  isSelected: _selectedNavIndex == 3,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 3);
                  },
                ),
                _buildDrawerTile(
                  title: 'Doctor Appointments',
                  icon: Icons.calendar_month,
                  color: AppTheme.primaryPurple,
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => CaregiverAppointmentsScreen(dependentName: _activeDependent.fullName),
                      ),
                    );
                  },
                ),
                _buildDrawerTile(
                  title: 'Daily Vitals & Symptom Log',
                  icon: Icons.monitor_heart,
                  color: const Color(0xFF10B981),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => CaregiverTrackerScreen(dependentName: _activeDependent.fullName),
                      ),
                    );
                  },
                ),
                _buildDrawerTile(
                  title: 'Growth & Milestone Reports',
                  icon: Icons.auto_graph,
                  color: const Color(0xFF6366F1),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => CaregiverReportsScreen(dependentName: _activeDependent.fullName),
                      ),
                    );
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
