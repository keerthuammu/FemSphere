import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../dashboards/user_dashboard_screen.dart';
import '../dashboards/caregiver_dashboard_screen.dart';
import '../dashboards/doctor_dashboard_screen.dart';
import '../dashboards/admin_dashboard_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: 'elena@femsphere.health');
  final _passwordController = TextEditingController(text: 'password123');
  bool _obscurePassword = true;
  bool _rememberMe = true;
  String? _validationError;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _navigateRoleDashboard(String role) {
    Widget targetScreen = const UserDashboardScreen();
    if (role.contains('Admin') || role.contains('Administrator')) {
      targetScreen = const AdminDashboardScreen();
    } else if (role.contains('Caregiver')) {
      targetScreen = const CaregiverDashboardScreen();
    } else if (role.contains('Doctor')) {
      targetScreen = const DoctorDashboardScreen();
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => targetScreen),
    );
  }

  Future<void> _handleLogin() async {
    setState(() => _validationError = null);
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty || !email.contains('@')) {
      setState(() => _validationError = 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setState(() => _validationError = 'Password must be at least 6 characters.');
      return;
    }

    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.login(email, password);

    if (!mounted) return;

    if (success && auth.currentUser != null) {
      _navigateRoleDashboard(auth.currentUser!.role);
    } else if (auth.errorMessage != null) {
      setState(() => _validationError = auth.errorMessage);
    }
  }

  void _quickFillDemo(String email, String role) {
    setState(() {
      _emailController.text = email;
      _passwordController.text = 'password123';
      _validationError = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: AppTheme.textDark),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'FemSphere',
              style: GoogleFonts.playfairDisplay(
                color: AppTheme.primaryPurple,
                fontWeight: FontWeight.bold,
                fontSize: 22,
              ),
            ),
            const SizedBox(width: 4),
            const Icon(Icons.auto_awesome, color: AppTheme.secondaryTeal, size: 16),
          ],
        ),
        centerTitle: true,
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const RegisterScreen()));
            },
            child: Text(
              'Register',
              style: GoogleFonts.plusJakartaSans(
                fontWeight: FontWeight.bold,
                color: AppTheme.primaryPurple,
                fontSize: 13,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          physics: const BouncingScrollPhysics(),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: Container(
              padding: const EdgeInsets.all(28.0),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: AppTheme.borderPurple),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primaryPurple.withValues(alpha: 0.08),
                    blurRadius: 28,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Arched hero visual banner (mirrors the web login hero portrait)
                  Center(
                    child: Container(
                      height: 120,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFEDE9FE), Color(0xFFFDF4FF)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: AppTheme.borderPurple),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(21),
                        child: Stack(
                          children: [
                            Positioned.fill(
                              child: Image.asset(
                                'assets/images/healthcare_hero_1785261756891.jpeg',
                                fit: BoxFit.cover,
                                alignment: Alignment.topCenter,
                                errorBuilder: (ctx, err, stack) => Container(
                                  color: const Color(0xFFEDE9FE),
                                  alignment: Alignment.center,
                                  child: const Icon(Icons.health_and_safety, size: 48, color: AppTheme.primaryPurple),
                                ),
                              ),
                            ),
                            Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.black.withValues(alpha: 0.45),
                                    Colors.transparent,
                                  ],
                                  begin: Alignment.bottomCenter,
                                  end: Alignment.topCenter,
                                ),
                              ),
                            ),
                            Positioned(
                              bottom: 10,
                              left: 14,
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withValues(alpha: 0.9),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(Icons.auto_awesome, size: 12, color: AppTheme.primaryPurple),
                                        const SizedBox(width: 4),
                                        Text(
                                          'Digital Health Twin Portal',
                                          style: GoogleFonts.plusJakartaSans(
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.primaryPurple,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Header title
                  Text(
                    'Log in to your account',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textDark,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Enter your credentials to access your Digital Twin workspace.',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      color: AppTheme.textMuted,
                      height: 1.4,
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Quick Demo Role Switcher
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFAF8FC),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: AppTheme.borderPurple),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.bolt_rounded, size: 16, color: AppTheme.accentAmber),
                            const SizedBox(width: 4),
                            Text(
                              'QUICK DEMO ACCESS',
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 0.8,
                                color: AppTheme.textMuted,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: [
                            _buildDemoChip(
                              label: 'Elena (User)',
                              icon: Icons.person_rounded,
                              color: AppTheme.primaryPurple,
                              bg: const Color(0xFFF3E8FF),
                              onTap: () => _quickFillDemo('elena@femsphere.health', 'User'),
                            ),
                            _buildDemoChip(
                              label: 'Dr. Sarah (Doctor)',
                              icon: Icons.medical_services_rounded,
                              color: AppTheme.secondaryTeal,
                              bg: const Color(0xFFCCFBF1),
                              onTap: () => _quickFillDemo('doctor.sarah@femsphere.health', 'Doctor'),
                            ),
                            _buildDemoChip(
                              label: 'Marcus (Caregiver)',
                              icon: Icons.family_restroom_rounded,
                              color: AppTheme.accentPink,
                              bg: const Color(0xFFFCE7F3),
                              onTap: () => _quickFillDemo('marcus.caregiver@femsphere.health', 'Caregiver'),
                            ),
                            _buildDemoChip(
                              label: 'Admin',
                              icon: Icons.shield_rounded,
                              color: AppTheme.accentIndigo,
                              bg: const Color(0xFFEDE9FE),
                              onTap: () => _quickFillDemo('admin@femsphere.health', 'Admin'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Validation Error Banner
                  if (_validationError != null)
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF2F2),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFFECDD3)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline_rounded, size: 18, color: Color(0xFFDC2626)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _validationError!,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 12,
                                color: const Color(0xFFB91C1C),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                  // Email Input
                  Text(
                    'EMAIL ADDRESS',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1,
                      color: const Color(0xFF4A4145),
                    ),
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    style: GoogleFonts.plusJakartaSans(fontSize: 14, color: AppTheme.textDark),
                    decoration: InputDecoration(
                      hintText: 'hello@example.com',
                      hintStyle: GoogleFonts.plusJakartaSans(color: Colors.grey.shade400, fontSize: 13),
                      prefixIcon: const Icon(Icons.mail_outline_rounded, color: AppTheme.textMuted, size: 20),
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: AppTheme.borderPurple),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: AppTheme.borderPurple),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: AppTheme.primaryPurple, width: 1.5),
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Password Input
                  Text(
                    'PASSWORD',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1,
                      color: const Color(0xFF4A4145),
                    ),
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    style: GoogleFonts.plusJakartaSans(fontSize: 14, color: AppTheme.textDark),
                    decoration: InputDecoration(
                      hintText: '••••••••••••',
                      hintStyle: GoogleFonts.plusJakartaSans(color: Colors.grey.shade400, fontSize: 13),
                      prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppTheme.textMuted, size: 20),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                          color: AppTheme.textMuted,
                          size: 20,
                        ),
                        onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                      ),
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: AppTheme.borderPurple),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: AppTheme.borderPurple),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: AppTheme.primaryPurple, width: 1.5),
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Remember me & Forgot password
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      InkWell(
                        onTap: () => setState(() => _rememberMe = !_rememberMe),
                        borderRadius: BorderRadius.circular(8),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: Row(
                            children: [
                              SizedBox(
                                width: 20,
                                height: 20,
                                child: Checkbox(
                                  value: _rememberMe,
                                  activeColor: AppTheme.primaryPurple,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                                  onChanged: (val) => setState(() => _rememberMe = val ?? true),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Remember me',
                                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppTheme.textMuted),
                              ),
                            ],
                          ),
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Password recovery instructions sent to your email.'),
                              backgroundColor: AppTheme.primaryPurple,
                            ),
                          );
                        },
                        child: Text(
                          'Forgot password?',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.primaryPurple,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Login Submit Button
                  ElevatedButton(
                    onPressed: auth.isLoading ? null : _handleLogin,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryPurple,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      elevation: 4,
                      shadowColor: AppTheme.primaryPurple.withValues(alpha: 0.3),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                    ),
                    child: auth.isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Log In',
                                style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                              const SizedBox(width: 8),
                              const Icon(Icons.arrow_forward_rounded, size: 16),
                            ],
                          ),
                  ),

                  const SizedBox(height: 24),

                  // Don't have an account
                  Center(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Don't have an account? ",
                          style: GoogleFonts.plusJakartaSans(fontSize: 13, color: AppTheme.textMuted),
                        ),
                        GestureDetector(
                          onTap: () {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(builder: (_) => const RegisterScreen()),
                            );
                          },
                          child: Text(
                            'Register',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.primaryPurple,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDemoChip({
    required String label,
    required IconData icon,
    required Color color,
    required Color bg,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 13, color: color),
            const SizedBox(width: 4),
            Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
