import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants/app_colors.dart';
import '../features/smartwatch/screens/smartwatch_history_screen.dart';
import '../features/wearables/screens/universal_wearables_screen.dart';
import '../features/wearables/screens/universal_scan_screen.dart';
import '../features/wearables/screens/device_qr_scanner_screen.dart';
import '../screens/home_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/dashboards/user_dashboard_screen.dart';
import '../screens/dashboards/caregiver_dashboard_screen.dart';
import '../screens/dashboards/doctor_dashboard_screen.dart';
import '../screens/dashboards/admin_dashboard_screen.dart';
import '../screens/doctor/doctor_pending_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      name: 'splash',
      builder: (context, state) => const _SplashScreen(),
    ),
    GoRoute(
      path: '/home',
      name: 'home',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/login',
      name: 'login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/register',
      name: 'register',
      builder: (context, state) => const RegisterScreen(),
    ),
    GoRoute(
      path: '/patient',
      name: 'patient_dashboard',
      builder: (context, state) => const UserDashboardScreen(),
    ),
    GoRoute(
      path: '/caregiver',
      name: 'caregiver_dashboard',
      builder: (context, state) => const CaregiverDashboardScreen(),
    ),
    GoRoute(
      path: '/doctor',
      name: 'doctor_dashboard',
      builder: (context, state) => const DoctorDashboardScreen(),
    ),
    GoRoute(
      path: '/doctor-pending',
      name: 'doctor_pending',
      builder: (context, state) => const DoctorPendingScreen(),
    ),
    GoRoute(
      path: '/admin',
      name: 'admin_dashboard',
      builder: (context, state) => const AdminDashboardScreen(),
    ),
    GoRoute(
      path: '/smartwatch',
      name: 'smartwatch',
      builder: (context, state) => const UniversalWearablesScreen(),
      routes: [
        GoRoute(
          path: 'scan',
          name: 'smartwatch_scan',
          builder: (context, state) => const UniversalScanScreen(),
        ),
        GoRoute(
          path: 'history',
          name: 'smartwatch_history',
          builder: (context, state) => const SmartwatchHistoryScreen(),
        ),
      ],
    ),
    GoRoute(
      path: '/wearables',
      name: 'wearables',
      builder: (context, state) => const UniversalWearablesScreen(),
      routes: [
        GoRoute(
          path: 'scan',
          name: 'wearables_scan',
          builder: (context, state) => const UniversalScanScreen(),
        ),
        GoRoute(
          path: 'qr_scan',
          name: 'wearables_qr_scan',
          builder: (context, state) {
            final targetStr = state.uri.queryParameters['target'];
            final target = targetStr == 'smartwatch' ? ScannerTarget.smartwatch : ScannerTarget.waterBottle;
            return DeviceQrScannerScreen(initialTarget: target);
          },
        ),
      ],
    ),
  ],
);

class _SplashScreen extends StatefulWidget {
  const _SplashScreen();

  @override
  State<_SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<_SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuthAndNavigate();
  }

  Future<void> _checkAuthAndNavigate() async {
    await Future.delayed(const Duration(milliseconds: 1400));
    if (!mounted) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final role = prefs.getString('user_role');

      if (token != null && token.isNotEmpty) {
        if (role == 'Caregiver') {
          context.go('/caregiver');
          return;
        } else if (role == 'Doctor') {
          context.go('/doctor');
          return;
        } else if (role == 'Administrator' || role == 'Admin (Superuser)') {
          context.go('/admin');
          return;
        } else {
          context.go('/patient');
          return;
        }
      }
    } catch (_) {}

    if (mounted) {
      context.go('/patient');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.canvas,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 88,
              height: 88,
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withValues(alpha: 0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: const Center(
                child: Text('🌸', style: TextStyle(fontSize: 44)),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'FemSphere',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Lifetime AI Health Twin Companion',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 36),
            const SizedBox(
              width: 28,
              height: 28,
              child: CircularProgressIndicator(
                strokeWidth: 2.5,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
