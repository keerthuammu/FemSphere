import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../auth/login_screen.dart';
import '../admin/admin_users_screen.dart';
import '../admin/admin_doctors_screen.dart';
import '../admin/admin_caregivers_screen.dart';
import '../admin/admin_articles_screen.dart';
import '../admin/admin_profile_screen.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  int _selectedNavIndex = 0;
  Map<String, dynamic> _stats = {
    'totalUsers': 0,
    'doctors': 0,
    'caregivers': 0,
    'pendingDoctors': 0,
  };

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    try {
      final res = await ApiService.getAdminStats();
      if (mounted && res.isNotEmpty) {
        setState(() {
          if (res['stats'] != null) {
            _stats = res['stats'] as Map<String, dynamic>;
          } else {
            _stats = res;
          }
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
        title: Row(
          children: [
            const CircleAvatar(
              radius: 14,
              backgroundColor: Color(0xFFEDE9FE),
              child: Icon(Icons.shield, size: 16, color: Color(0xFF6366F1)),
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  user?.fullName ?? 'System Administrator',
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                ),
                const Text(
                  'Superuser Control Center • Root Access',
                  style: TextStyle(fontSize: 10, color: Color(0xFF6366F1), fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.security, color: Color(0xFF6366F1)),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminProfileScreen()));
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
      drawer: _buildAdminDrawer(context, user, auth),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedNavIndex,
        onDestinationSelected: (index) {
          setState(() {
            _selectedNavIndex = index;
          });
        },
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFFEDE9FE),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard, color: Color(0xFF6366F1)),
            label: 'Overview',
          ),
          NavigationDestination(
            icon: Icon(Icons.people_outline),
            selectedIcon: Icon(Icons.people, color: Color(0xFF6366F1)),
            label: 'Users',
          ),
          NavigationDestination(
            icon: Icon(Icons.verified_user_outlined),
            selectedIcon: Icon(Icons.verified_user, color: Color(0xFF6366F1)),
            label: 'Doctors',
          ),
          NavigationDestination(
            icon: Icon(Icons.article_outlined),
            selectedIcon: Icon(Icons.article, color: Color(0xFF6366F1)),
            label: 'CMS',
          ),
        ],
      ),
      body: _buildSelectedBody(user?.fullName ?? 'System Administrator'),
    );
  }

  Widget _buildSelectedBody(String adminName) {
    if (_selectedNavIndex == 1) return const AdminUsersScreen();
    if (_selectedNavIndex == 2) return const AdminDoctorsScreen();
    if (_selectedNavIndex == 3) return const AdminArticlesScreen();

    // Default: Tab 0 Overview
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Admin Hero Banner
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF6366F1), Color(0xFF4F46E5)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6366F1).withValues(alpha: 0.3),
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
                      'Superuser: $adminName',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text('Server: Healthy 99.9%', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'Global platform governance, physician credentials verification, multi-dependent caregiver networks, and CMS health article publishing.',
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Platform Metrics Grid
          Row(
            children: [
              Expanded(
                child: _buildMetricTile(
                  'Total Users',
                  _stats['totalUsers']?.toString() ?? '0',
                  Icons.group,
                  Colors.purple,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricTile(
                  'Active Doctors',
                  _stats['doctors']?.toString() ?? '0',
                  Icons.medical_services,
                  AppTheme.secondaryTeal,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricTile(
                  'Caregivers',
                  _stats['caregivers']?.toString() ?? '0',
                  Icons.family_restroom,
                  const Color(0xFFEC4899),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Pending Approvals Action Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.amber.shade200, width: 1.5),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: const Color(0xFFFEF3C7),
                  child: Icon(Icons.pending_actions, color: Colors.amber.shade800, size: 22),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '2 Physician License Requests Pending',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textDark),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Dr. Robert Thorne & Dr. Alistair Finch submitted MD certificates',
                        style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6366F1),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  onPressed: () => setState(() => _selectedNavIndex = 2),
                  child: const Text('Review', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Governance Hub Modules
          const Text(
            '🛡️ System Governance & Tools',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: _buildAdminHubCard(
                  title: 'User Governance',
                  subtitle: 'Search, roles & status',
                  icon: Icons.people,
                  color: const Color(0xFF6366F1),
                  onTap: () => setState(() => _selectedNavIndex = 1),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildAdminHubCard(
                  title: 'Doctor Approvals',
                  subtitle: 'License MD verification',
                  icon: Icons.verified_user,
                  color: AppTheme.secondaryTeal,
                  onTap: () => setState(() => _selectedNavIndex = 2),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: _buildAdminHubCard(
                  title: 'Caregiver Networks',
                  subtitle: 'Multi-dependent trees',
                  icon: Icons.family_restroom,
                  color: const Color(0xFFEC4899),
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminCaregiversScreen()));
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildAdminHubCard(
                  title: 'Health Articles CMS',
                  subtitle: 'Create & publish content',
                  icon: Icons.article,
                  color: Colors.amber.shade800,
                  onTap: () => setState(() => _selectedNavIndex = 3),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          _buildAdminHubCard(
            title: 'Audit Logs & Root Security',
            subtitle: 'Real-time telemetry, database snapshots & security logs',
            icon: Icons.security,
            color: const Color(0xFF8B5CF6),
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminProfileScreen()));
            },
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildMetricTile(String title, String value, IconData icon, Color color) {
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

  Widget _buildAdminHubCard({
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

  Widget _buildAdminDrawer(BuildContext context, dynamic user, AuthProvider auth) {
    return Drawer(
      child: Container(
        color: Colors.white,
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            UserAccountsDrawerHeader(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF6366F1), Color(0xFF4F46E5)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              currentAccountPicture: const CircleAvatar(
                backgroundColor: Colors.white,
                child: Icon(Icons.shield, color: Color(0xFF6366F1), size: 36),
              ),
              accountName: Text(
                user?.fullName ?? 'System Administrator',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              accountEmail: Text(
                user?.email ?? 'admin@femsphere.org',
                style: const TextStyle(fontSize: 12, color: Colors.white70),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.dashboard_outlined, color: Color(0xFF6366F1)),
              title: const Text('Control Center Overview', style: TextStyle(fontWeight: FontWeight.w600)),
              onTap: () {
                Navigator.pop(context);
                setState(() => _selectedNavIndex = 0);
              },
            ),
            ListTile(
              leading: const Icon(Icons.people_outline, color: Color(0xFF6366F1)),
              title: const Text('User Governance', style: TextStyle(fontWeight: FontWeight.w600)),
              subtitle: const Text('Manage all platform users & roles', style: TextStyle(fontSize: 11)),
              onTap: () {
                Navigator.pop(context);
                setState(() => _selectedNavIndex = 1);
              },
            ),
            ListTile(
              leading: const Icon(Icons.verified_user_outlined, color: Color(0xFF6366F1)),
              title: const Text('Doctor Approvals', style: TextStyle(fontWeight: FontWeight.w600)),
              subtitle: const Text('Physician license verification', style: TextStyle(fontSize: 11)),
              onTap: () {
                Navigator.pop(context);
                setState(() => _selectedNavIndex = 2);
              },
            ),
            ListTile(
              leading: const Icon(Icons.family_restroom_outlined, color: Color(0xFFEC4899)),
              title: const Text('Caregiver Networks', style: TextStyle(fontWeight: FontWeight.w600)),
              subtitle: const Text('Multi-dependent family linkages', style: TextStyle(fontSize: 11)),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminCaregiversScreen()));
              },
            ),
            ListTile(
              leading: const Icon(Icons.article_outlined, color: Color(0xFF6366F1)),
              title: const Text('Health Articles CMS', style: TextStyle(fontWeight: FontWeight.w600)),
              subtitle: const Text('Create & publish educational content', style: TextStyle(fontSize: 11)),
              onTap: () {
                Navigator.pop(context);
                setState(() => _selectedNavIndex = 3);
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.security_outlined, color: Color(0xFF8B5CF6)),
              title: const Text('Audit Logs & Security', style: TextStyle(fontWeight: FontWeight.w600)),
              subtitle: const Text('Real-time telemetry & database backups', style: TextStyle(fontSize: 11)),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminProfileScreen()));
              },
            ),
            ListTile(
              leading: const Icon(Icons.logout, color: Colors.redAccent),
              title: const Text('Log Out', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
              onTap: () {
                Navigator.pop(context);
                auth.logout();
                Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
              },
            ),
          ],
        ),
      ),
    );
  }
}
