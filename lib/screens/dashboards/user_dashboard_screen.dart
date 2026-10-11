import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_screen.dart';
import '../twin/smart_chat_screen.dart';
import '../user/destinations/user_dashboard_tab.dart';
import '../user/destinations/connect_devices_tab.dart';
import '../user/destinations/care_and_records_tab.dart';
import '../user/destinations/user_profile_tab.dart';
import '../user/period_tracker_screen.dart';
import '../user/notifications_screen.dart';
import '../user/specialty_journeys_screen.dart';
import '../user/partner_sync_screen.dart';
import '../../widgets/brand_logo.dart';

class UserDashboardScreen extends StatefulWidget {
  const UserDashboardScreen({super.key});

  @override
  State<UserDashboardScreen> createState() => _UserDashboardScreenState();
}

class _UserDashboardScreenState extends State<UserDashboardScreen> {
  // 0: Dashboard, 1: Period Tracker, 2: Connect Devices, 3: Care & Records, 4: Profile
  int _selectedNavIndex = 0;

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.currentUser;

    return Scaffold(
      backgroundColor: const Color(0xFFF3EEF9),
      extendBody: true,
      appBar: _buildAppBar(context),
      drawer: _buildUserDrawer(context, user, auth),
      bottomNavigationBar: _buildFloatingBottomNav(context),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFEDE4F7), Color(0xFFFAF7FD), Color(0xFFF4EEF9)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: IndexedStack(
            index: _selectedNavIndex,
            children: [
              // DESTINATION A: Dashboard
              UserDashboardTab(
                user: user,
                onOpenPeriodTracker: () => setState(() => _selectedNavIndex = 1),
                onOpenConnectDevices: () => setState(() => _selectedNavIndex = 2),
                onOpenCareAndRecords: () => setState(() => _selectedNavIndex = 3),
              ),

              // DESTINATION B: Complete Period Tracker
              PeriodTrackerScreen(
                onBack: () => setState(() => _selectedNavIndex = 0),
              ),

              // DESTINATION C: Connect Devices (Smartwatches & Manual Entry)
              ConnectDevicesTab(
                onBack: () => setState(() => _selectedNavIndex = 0),
              ),

              // DESTINATION D: Appointments & Medical Records
              CareAndRecordsTab(
                onBack: () => setState(() => _selectedNavIndex = 0),
              ),

              // DESTINATION E: Profile, Settings & Companion Mode
              UserProfileTab(
                onBack: () => setState(() => _selectedNavIndex = 0),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ===========================================================================
  // TOP APP BAR (Prompt Section 2.B: AI Chat in top-right app bar)
  // ===========================================================================
  PreferredSizeWidget? _buildAppBar(BuildContext context) {
    // If inside Period Tracker or sub-screens with their own AppBar, skip main AppBar
    if (_selectedNavIndex == 1) return null;

    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,
      leading: Builder(
        builder: (ctx) => IconButton(
          icon: const Icon(Icons.menu_rounded, color: Color(0xFF201538)),
          tooltip: 'Open Menu',
          onPressed: () => Scaffold.of(ctx).openDrawer(),
        ),
      ),
      title: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const BrandLogo(size: 32),
          const SizedBox(width: 8),
          Text(
            'FemSphere',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 18,
              fontWeight: FontWeight.w800,
              color: const Color(0xFF201538),
              letterSpacing: -0.5,
            ),
          ),
        ],
      ),
      centerTitle: true,
      actions: [
        // AI Chat icon button in top-right (Prompt Section 2.B)
        GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const SmartChatScreen()),
            );
          },
          child: Container(
            margin: const EdgeInsets.only(right: 6),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.primaryPurpleLight,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFEDE4F7)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.auto_awesome, color: AppTheme.primaryPurple, size: 15),
                const SizedBox(width: 4),
                Text(
                  'Talk to AI',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.primaryPurple,
                  ),
                ),
              ],
            ),
          ),
        ),

        // Notifications button
        IconButton(
          icon: const Icon(Icons.notifications_none_rounded, color: Color(0xFF201538), size: 22),
          tooltip: 'Notifications',
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const NotificationsScreen()),
            );
          },
        ),
        const SizedBox(width: 4),
      ],
    );
  }

  // ===========================================================================
  // FLOATING LUXURY BOTTOM NAVIGATION BAR
  // ===========================================================================
  Widget _buildFloatingBottomNav(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(18, 0, 18, 16),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(36),
        border: Border.all(color: const Color(0xFFEDE4F7), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryPurple.withValues(alpha: 0.09),
            blurRadius: 20,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // 0. Dashboard
          _buildNavBtn(
            icon: Icons.grid_view_rounded,
            label: 'Home',
            isSelected: _selectedNavIndex == 0,
            onTap: () => setState(() => _selectedNavIndex = 0),
          ),

          // 1. Period Tracker
          _buildNavBtn(
            icon: Icons.water_drop_rounded,
            label: 'Cycle',
            isSelected: _selectedNavIndex == 1,
            onTap: () => setState(() => _selectedNavIndex = 1),
          ),

          // 2. CENTER ELEVATED BUTTON: Connect Devices (Prompt Section 2.C)
          GestureDetector(
            onTap: () => setState(() => _selectedNavIndex = 2),
            child: Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: _selectedNavIndex == 2
                      ? [const Color(0xFF9333EA), const Color(0xFF6B21A8)]
                      : [AppTheme.primaryPurple, AppTheme.primaryPurpleDark],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primaryPurple.withValues(alpha: 0.45),
                    blurRadius: 14,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: const Center(
                child: Icon(Icons.watch_rounded, color: Colors.white, size: 24),
              ),
            ),
          ),

          // 3. Appointments & Medical Records
          _buildNavBtn(
            icon: Icons.folder_shared_rounded,
            label: 'Care',
            isSelected: _selectedNavIndex == 3,
            onTap: () => setState(() => _selectedNavIndex = 3),
          ),

          // 4. Profile & Settings
          _buildNavBtn(
            icon: Icons.person_rounded,
            label: 'Profile',
            isSelected: _selectedNavIndex == 4,
            onTap: () => setState(() => _selectedNavIndex = 4),
          ),
        ],
      ),
    );
  }

  Widget _buildNavBtn({
    required IconData icon,
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: 48,
        height: 48,
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primaryPurpleLight : Colors.transparent,
          borderRadius: BorderRadius.circular(24),
        ),
        child: Icon(
          icon,
          color: isSelected ? AppTheme.primaryPurple : const Color(0xFF8E859E),
          size: 22,
        ),
      ),
    );
  }

  // ===========================================================================
  // DRAWER MENU
  // ===========================================================================
  Widget _buildUserDrawer(BuildContext context, dynamic user, AuthProvider auth) {
    final userName = (user?.fullName.isNotEmpty == true ? user!.fullName : user?.username) ?? 'Alex';

    return Drawer(
      backgroundColor: const Color(0xFFFAF8FC),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(20, 48, 20, 20),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [AppTheme.primaryPurple, AppTheme.primaryPurpleDark],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundColor: Colors.white,
                  child: Text(
                    userName.substring(0, 1).toUpperCase(),
                    style: const TextStyle(color: AppTheme.primaryPurple, fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        userName,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        user?.email ?? 'alex@femsphere.health',
                        style: const TextStyle(color: Colors.white70, fontSize: 11),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
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
                  title: 'Dashboard',
                  icon: Icons.dashboard_rounded,
                  color: AppTheme.primaryPurple,
                  isSelected: _selectedNavIndex == 0,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 0);
                  },
                ),
                _buildDrawerTile(
                  title: 'Period Tracker (Cycle & Ovulation)',
                  icon: Icons.water_drop_rounded,
                  color: const Color(0xFFF43F5E),
                  isSelected: _selectedNavIndex == 1,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 1);
                  },
                ),
                _buildDrawerTile(
                  title: 'Connect Devices & Smartwatches',
                  icon: Icons.watch_rounded,
                  color: const Color(0xFF8B5CF6),
                  isSelected: _selectedNavIndex == 2,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 2);
                  },
                ),
                _buildDrawerTile(
                  title: 'Appointments & Care Vault',
                  icon: Icons.folder_shared_rounded,
                  color: AppTheme.secondaryTeal,
                  isSelected: _selectedNavIndex == 3,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 3);
                  },
                ),
                _buildDrawerTile(
                  title: 'Specialty Health Journeys',
                  icon: Icons.spa_outlined,
                  color: const Color(0xFFEC4899),
                  badge: '7 Modes',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const SpecialtyJourneysScreen()));
                  },
                ),
                _buildDrawerTile(
                  title: 'Partner Mode Sync',
                  icon: Icons.favorite_rounded,
                  color: const Color(0xFFEC4899),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const PartnerSyncScreen()));
                  },
                ),
                const Divider(),
                _buildDrawerTile(
                  title: 'Profile & Settings',
                  icon: Icons.person_rounded,
                  color: AppTheme.primaryPurple,
                  isSelected: _selectedNavIndex == 4,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => _selectedNavIndex = 4);
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
    String? badge,
    bool isSelected = false,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
      decoration: BoxDecoration(
        color: isSelected ? color.withValues(alpha: 0.12) : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        dense: true,
        leading: Icon(icon, color: isSelected ? color : const Color(0xFF64748B), size: 20),
        title: Text(
          title,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12.5,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            color: isSelected ? color : const Color(0xFF334155),
          ),
        ),
        trailing: badge != null
            ? Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(badge, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
              )
            : null,
        onTap: onTap,
      ),
    );
  }
}
