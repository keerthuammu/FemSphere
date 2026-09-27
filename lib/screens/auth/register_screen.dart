import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../dashboards/user_dashboard_screen.dart';
import '../dashboards/caregiver_dashboard_screen.dart';
import '../dashboards/doctor_dashboard_screen.dart';
import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  int _currentStep = 1;

  // Step 1: Role Selection
  String _accountType = 'Myself'; // 'Myself', 'Caregiver', 'Doctor'

  // Step 2: Personal Information
  final _fullNameController = TextEditingController();
  final _dobController = TextEditingController(text: '1998-05-14');
  String _gender = 'Female';
  final _mobileController = TextEditingController();
  final _emailController = TextEditingController();
  final _cityController = TextEditingController();

  // Step 3: Account Credentials
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  // Step 4: Role-Specific Information (Myself)
  String _bloodGroup = 'A+';
  final _heightController = TextEditingController(text: '165');
  final _weightController = TextEditingController(text: '58');
  String _lifeStage = 'Reproductive Age (25–39)';
  final _emergencyNameController = TextEditingController();
  final _emergencyPhoneController = TextEditingController();

  // Step 4: Caregiver Specific
  String _caregiverRelationship = 'Child (Daughter)';
  final _dependentNameController = TextEditingController();
  final _dependentDobController = TextEditingController(text: '2020-03-12');
  String _dependentBloodGroup = 'A+';
  final List<String> _caregiverScopes = ['Medication Schedule', 'Telemetry Monitoring'];

  // Step 4: Doctor Specific
  final _licenseController = TextEditingController();
  String _specialization = 'Obstetrics & Gynecology (OB/GYN)';
  final _hospitalController = TextEditingController();
  final _experienceController = TextEditingController(text: '8');

  // Step 5: Consents
  bool _termsAgreed = true;
  bool _hipaaConsent = true;
  bool _aiTwinTrainingOptIn = true;

  String? _validationError;

  final List<String> _stepTitles = const [
    'ROLE',
    'PERSONAL',
    'CREDENTIALS',
    'HEALTH INFO',
    'CONSENT',
  ];

  final List<String> _lifeStageOptions = const [
    'Early Childhood (0–5)',
    'Pre-Puberty (6–10)',
    'Puberty (11–13)',
    'Adolescent (14–17)',
    'Young Adult (18–24)',
    'Reproductive Age (25–39)',
    'Pregnancy (40 Weeks)',
    'Postpartum (4th Trimester)',
    'Perimenopause (40–48)',
    'Menopause (49–59)',
    'Older Adult (60+)',
  ];

  final List<String> _specializationOptions = const [
    'Obstetrics & Gynecology (OB/GYN)',
    'Reproductive Endocrinology',
    'Maternal-Fetal Medicine',
    'General Practitioner (Women Health)',
    'Pediatrics & Adolescent Medicine',
    'Endocrinology & Metabolism',
  ];

  final List<String> _bloodGroups = const ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  @override
  void dispose() {
    _fullNameController.dispose();
    _dobController.dispose();
    _mobileController.dispose();
    _emailController.dispose();
    _cityController.dispose();
    _usernameController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _heightController.dispose();
    _weightController.dispose();
    _emergencyNameController.dispose();
    _emergencyPhoneController.dispose();
    _dependentNameController.dispose();
    _dependentDobController.dispose();
    _licenseController.dispose();
    _hospitalController.dispose();
    _experienceController.dispose();
    super.dispose();
  }

  bool _validateStep(int step) {
    setState(() => _validationError = null);

    if (step == 1) {
      if (_accountType.isEmpty) {
        setState(() => _validationError = 'Please select a profile role to proceed.');
        return false;
      }
    } else if (step == 2) {
      if (_fullNameController.text.trim().length < 2) {
        setState(() => _validationError = 'Please enter your Full Name (min 2 characters).');
        return false;
      }
      final email = _emailController.text.trim();
      if (email.isEmpty || !email.contains('@') || !email.contains('.')) {
        setState(() => _validationError = 'Please enter a valid email address.');
        return false;
      }
    } else if (step == 3) {
      if (_usernameController.text.trim().length < 3) {
        setState(() => _validationError = 'Username must be at least 3 characters.');
        return false;
      }
      if (_passwordController.text.length < 6) {
        setState(() => _validationError = 'Password must be at least 6 characters long.');
        return false;
      }
      if (_passwordController.text != _confirmPasswordController.text) {
        setState(() => _validationError = 'Passwords do not match.');
        return false;
      }
    } else if (step == 4) {
      if (_accountType == 'Doctor' && _licenseController.text.trim().isEmpty) {
        setState(() => _validationError = 'Please provide your Medical License Number (e.g., MD-8821).');
        return false;
      }
      if (_accountType == 'Caregiver' && _dependentNameController.text.trim().isEmpty) {
        setState(() => _validationError = 'Please provide dependent name.');
        return false;
      }
    } else if (step == 5) {
      if (!_termsAgreed || !_hipaaConsent) {
        setState(() => _validationError = 'Please accept the Terms of Service and HIPAA Privacy Agreement.');
        return false;
      }
    }
    return true;
  }

  void _nextStep() {
    if (_validateStep(_currentStep)) {
      if (_currentStep < 5) {
        setState(() {
          _currentStep++;
          _validationError = null;
        });
      } else {
        _submitRegistration();
      }
    }
  }

  void _prevStep() {
    if (_currentStep > 1) {
      setState(() {
        _currentStep--;
        _validationError = null;
      });
    }
  }

  Future<void> _pickDate(TextEditingController controller) async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(1998, 1, 1),
      firstDate: DateTime(1920),
      lastDate: now,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppTheme.primaryPurple,
              onPrimary: Colors.white,
              onSurface: AppTheme.textDark,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        controller.text = "${picked.year.toString().padLeft(4, '0')}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
      });
    }
  }

  Future<void> _submitRegistration() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);

    final payload = {
      'accountType': _accountType,
      'fullName': _fullNameController.text.trim(),
      'dob': _dobController.text,
      'gender': _gender,
      'mobileNumber': _mobileController.text.trim(),
      'email': _emailController.text.trim(),
      'city': _cityController.text.trim(),
      'username': _usernameController.text.trim(),
      'password': _passwordController.text,
      'bloodGroup': _bloodGroup,
      'heightCm': _heightController.text,
      'weightKg': _weightController.text,
      'lifeStage': _lifeStage,
      'emergencyContactName': _emergencyNameController.text.trim(),
      'emergencyContactPhone': _emergencyPhoneController.text.trim(),
      'caregiverRelationship': _caregiverRelationship,
      'dependentName': _dependentNameController.text.trim(),
      'dependentDob': _dependentDobController.text,
      'dependentBloodGroup': _dependentBloodGroup,
      'caregiverScopes': _caregiverScopes,
      'licenseNumber': _licenseController.text.trim(),
      'specialization': _specialization,
      'hospitalClinic': _hospitalController.text.trim(),
      'yearsOfExperience': _experienceController.text,
      'termsAgreed': _termsAgreed,
      'hipaaConsent': _hipaaConsent,
      'aiTwinTrainingOptIn': _aiTwinTrainingOptIn,
    };

    final success = await auth.register(payload);

    if (!mounted) return;

    if (success && auth.currentUser != null) {
      Widget target = const UserDashboardScreen();
      if (_accountType == 'Caregiver') target = const CaregiverDashboardScreen();
      if (_accountType == 'Doctor') target = const DoctorDashboardScreen();

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => target),
        (route) => false,
      );
    } else if (auth.errorMessage != null) {
      setState(() => _validationError = auth.errorMessage);
    }
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
          onPressed: () {
            if (_currentStep > 1) {
              _prevStep();
            } else {
              Navigator.pop(context);
            }
          },
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
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
            },
            child: Text(
              'Login',
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        physics: const BouncingScrollPhysics(),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 540),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Stepper Header (Matching Web App Stepper)
                _buildStepperHeader(),

                const SizedBox(height: 20),

                // Main Form Card
                Container(
                  padding: const EdgeInsets.all(24.0),
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
                      // Step Title Header
                      _buildStepHeader(),

                      const SizedBox(height: 18),

                      // Validation Error Alert Banner
                      if (_validationError != null)
                        Container(
                          margin: const EdgeInsets.only(bottom: 20),
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

                      // Active Step Content
                      if (_currentStep == 1) _buildStep1Role(),
                      if (_currentStep == 2) _buildStep2Personal(),
                      if (_currentStep == 3) _buildStep3Credentials(),
                      if (_currentStep == 4) _buildStep4RoleSpecific(),
                      if (_currentStep == 5) _buildStep5Consent(),

                      const SizedBox(height: 28),

                      // Step Navigation Buttons
                      Row(
                        children: [
                          if (_currentStep > 1)
                            Expanded(
                              flex: 4,
                              child: OutlinedButton(
                                onPressed: _prevStep,
                                style: OutlinedButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  side: const BorderSide(color: AppTheme.borderPurple),
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                                ),
                                child: Text(
                                  'Back',
                                  style: GoogleFonts.plusJakartaSans(
                                    color: AppTheme.textDark,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ),
                          if (_currentStep > 1) const SizedBox(width: 12),
                          Expanded(
                            flex: 6,
                            child: ElevatedButton(
                              onPressed: auth.isLoading ? null : _nextStep,
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
                                          _currentStep == 5 ? 'Create Account' : 'Continue',
                                          style: GoogleFonts.plusJakartaSans(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 14,
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Icon(
                                          _currentStep == 5 ? Icons.check_circle_outline_rounded : Icons.arrow_forward_rounded,
                                          size: 16,
                                        ),
                                      ],
                                    ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Already have an account footer
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Already have an account? ',
                        style: GoogleFonts.plusJakartaSans(fontSize: 13, color: AppTheme.textMuted),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(builder: (_) => const LoginScreen()),
                          );
                        },
                        child: Text(
                          'Login',
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
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ==========================================
  // STEPPER HEADER
  // ==========================================
  Widget _buildStepperHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 10),
      child: Column(
        children: [
          Row(
            children: List.generate(5, (index) {
              final stepNum = index + 1;
              final isCompleted = _currentStep > stepNum;
              final isActive = _currentStep == stepNum;

              return Expanded(
                child: Row(
                  children: [
                    InkWell(
                      onTap: () {
                        if (stepNum < _currentStep) {
                          setState(() {
                            _currentStep = stepNum;
                            _validationError = null;
                          });
                        } else if (stepNum > _currentStep) {
                          if (_validateStep(_currentStep)) {
                            setState(() {
                              _currentStep = stepNum;
                              _validationError = null;
                            });
                          }
                        }
                      },
                      borderRadius: BorderRadius.circular(18),
                      child: Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isCompleted || isActive ? AppTheme.primaryPurple : Colors.white,
                          border: Border.all(
                            color: isCompleted || isActive ? AppTheme.primaryPurple : AppTheme.borderPurple,
                            width: 2,
                          ),
                          boxShadow: isActive
                              ? [
                                  BoxShadow(
                                    color: AppTheme.primaryPurple.withValues(alpha: 0.35),
                                    blurRadius: 10,
                                    offset: const Offset(0, 3),
                                  ),
                                ]
                              : null,
                        ),
                        child: Center(
                          child: isCompleted
                              ? const Icon(Icons.check_rounded, size: 16, color: Colors.white)
                              : Text(
                                  '$stepNum',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: isActive ? Colors.white : AppTheme.textMuted,
                                  ),
                                ),
                        ),
                      ),
                    ),
                    if (index < 4)
                      Expanded(
                        child: Container(
                          height: 3,
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          decoration: BoxDecoration(
                            color: _currentStep > stepNum ? AppTheme.primaryPurple : AppTheme.borderPurple,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                  ],
                ),
              );
            }),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(5, (index) {
              final isActive = _currentStep == index + 1;
              return Text(
                _stepTitles[index],
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 9,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.5,
                  color: isActive ? AppTheme.primaryPurple : AppTheme.textMuted,
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildStepHeader() {
    String badge = 'STEP $_currentStep OF 5';
    String title = '';
    String subtitle = '';

    switch (_currentStep) {
      case 1:
        title = 'Account Type (Required)';
        subtitle = 'Select the primary profile role for your FemSphere workspace access:';
        break;
      case 2:
        title = 'Personal Information';
        subtitle = 'Enter your legal identity details for medical record compliance.';
        break;
      case 3:
        title = 'Account Credentials';
        subtitle = 'Secure your biometric vault with login credentials.';
        break;
      case 4:
        title = _accountType == 'Doctor'
            ? 'Clinical Credentials'
            : _accountType == 'Caregiver'
                ? 'Dependent & Care Details'
                : 'Health & Vital Baseline';
        subtitle = 'Customize your personalized AI Health Twin parameters.';
        break;
      case 5:
        title = 'Rules, Regulations & Consent';
        subtitle = 'Review healthcare compliance and biometric telemetry terms.';
        break;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: const Color(0xFFF5F3FF),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppTheme.borderPurple),
          ),
          child: Text(
            badge,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.8,
              color: AppTheme.primaryPurple,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          title,
          style: GoogleFonts.playfairDisplay(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: AppTheme.textDark,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          subtitle,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12,
            color: AppTheme.textMuted,
            height: 1.4,
          ),
        ),
        const SizedBox(height: 8),
        const Divider(color: AppTheme.borderPurple),
      ],
    );
  }

  // ==========================================
  // STEP 1: ROLE SELECTION
  // ==========================================
  Widget _buildStep1Role() {
    return Column(
      children: [
        _buildRoleCard(
          role: 'Myself',
          badge: 'Default',
          title: 'Myself',
          desc: 'Track your personal Digital Health Twin, cycles, vitals, sleep, and AI health insights for yourself.',
          icon: Icons.person_rounded,
          color: AppTheme.primaryPurple,
        ),
        const SizedBox(height: 12),
        _buildRoleCard(
          role: 'Caregiver',
          badge: null,
          title: 'Caregiver',
          desc: 'Support a partner, child, sister, or elder with medication & growth tracking.',
          icon: Icons.family_restroom_rounded,
          color: AppTheme.accentPink,
        ),
        const SizedBox(height: 12),
        _buildRoleCard(
          role: 'Doctor',
          badge: null,
          title: 'Doctor',
          desc: 'Consult patients online, review AI health reports, and manage appointments.',
          icon: Icons.medical_services_rounded,
          color: AppTheme.secondaryTeal,
        ),
      ],
    );
  }

  Widget _buildRoleCard({
    required String role,
    required String? badge,
    required String title,
    required String desc,
    required IconData icon,
    required Color color,
  }) {
    final isSelected = _accountType == role;

    return InkWell(
      onTap: () => setState(() => _accountType = role),
      borderRadius: BorderRadius.circular(22),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFF5F3FF) : Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: isSelected ? AppTheme.primaryPurple : AppTheme.borderPurple,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppTheme.primaryPurple.withValues(alpha: 0.1),
                    blurRadius: 14,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: isSelected ? AppTheme.primaryPurple : AppTheme.borderPurple,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: isSelected ? Colors.white : AppTheme.primaryPurple, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        title,
                        style: GoogleFonts.plusJakartaSans(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                          color: AppTheme.textDark,
                        ),
                      ),
                      if (badge != null) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppTheme.borderPurple,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            badge,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.primaryPurple,
                            ),
                          ),
                        ),
                      ],
                      const Spacer(),
                      if (isSelected)
                        const Icon(Icons.check_circle_rounded, color: AppTheme.primaryPurple, size: 20),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    desc,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      color: const Color(0xFF64595E),
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // STEP 2: PERSONAL INFORMATION
  // ==========================================
  Widget _buildStep2Personal() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTextFieldLabel('FULL NAME (REQUIRED)'),
        _buildCustomInput(
          controller: _fullNameController,
          hint: 'Elena Vance',
          icon: Icons.person_outline_rounded,
        ),
        const SizedBox(height: 14),

        _buildTextFieldLabel('DATE OF BIRTH'),
        InkWell(
          onTap: () => _pickDate(_dobController),
          borderRadius: BorderRadius.circular(16),
          child: IgnorePointer(
            child: _buildCustomInput(
              controller: _dobController,
              hint: 'YYYY-MM-DD',
              icon: Icons.calendar_today_rounded,
            ),
          ),
        ),
        const SizedBox(height: 14),

        _buildTextFieldLabel('GENDER'),
        Row(
          children: ['Female', 'Male', 'Other'].map((g) {
            final isSel = _gender == g;
            return Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _gender = g),
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: isSel ? const Color(0xFFF5F3FF) : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSel ? AppTheme.primaryPurple : AppTheme.borderPurple,
                      width: isSel ? 1.5 : 1,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      g,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                        color: isSel ? AppTheme.primaryPurple : AppTheme.textDark,
                      ),
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 14),

        _buildTextFieldLabel('MOBILE NUMBER'),
        _buildCustomInput(
          controller: _mobileController,
          hint: '+1 (555) 234-5678',
          icon: Icons.phone_outlined,
          keyboardType: TextInputType.phone,
        ),
        const SizedBox(height: 14),

        _buildTextFieldLabel('EMAIL ADDRESS (REQUIRED)'),
        _buildCustomInput(
          controller: _emailController,
          hint: 'elena@femsphere.health',
          icon: Icons.mail_outline_rounded,
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 14),

        _buildTextFieldLabel('CITY'),
        _buildCustomInput(
          controller: _cityController,
          hint: 'San Francisco, CA',
          icon: Icons.location_on_outlined,
        ),
      ],
    );
  }

  // ==========================================
  // STEP 3: ACCOUNT CREDENTIALS
  // ==========================================
  Widget _buildStep3Credentials() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildTextFieldLabel('USERNAME (REQUIRED)'),
        _buildCustomInput(
          controller: _usernameController,
          hint: 'elena_vance',
          icon: Icons.alternate_email_rounded,
        ),
        const SizedBox(height: 14),

        _buildTextFieldLabel('PASSWORD (MIN. 6 CHARACTERS)'),
        _buildCustomInput(
          controller: _passwordController,
          hint: '••••••••••••',
          icon: Icons.lock_outline_rounded,
          obscureText: _obscurePassword,
          suffixIcon: IconButton(
            icon: Icon(_obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined, color: AppTheme.textMuted, size: 20),
            onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
          ),
        ),
        const SizedBox(height: 14),

        _buildTextFieldLabel('CONFIRM PASSWORD'),
        _buildCustomInput(
          controller: _confirmPasswordController,
          hint: '••••••••••••',
          icon: Icons.lock_outline_rounded,
          obscureText: _obscureConfirmPassword,
          suffixIcon: IconButton(
            icon: Icon(_obscureConfirmPassword ? Icons.visibility_outlined : Icons.visibility_off_outlined, color: AppTheme.textMuted, size: 20),
            onPressed: () => setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
          ),
        ),
        const SizedBox(height: 12),

        // Password hint box
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFF5F3FF),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.borderPurple),
          ),
          child: Row(
            children: [
              const Icon(Icons.security_rounded, size: 16, color: AppTheme.primaryPurple),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Passwords are encrypted using Argon2-grade hash tokens and never stored in plaintext.',
                  style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppTheme.textMuted, height: 1.3),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ==========================================
  // STEP 4: ROLE SPECIFIC INFORMATION
  // ==========================================
  Widget _buildStep4RoleSpecific() {
    if (_accountType == 'Doctor') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildTextFieldLabel('MEDICAL LICENSE NUMBER (REQUIRED)'),
          _buildCustomInput(
            controller: _licenseController,
            hint: 'MD-882194',
            icon: Icons.badge_outlined,
          ),
          const SizedBox(height: 14),

          _buildTextFieldLabel('SPECIALIZATION'),
          _buildDropdown(
            value: _specialization,
            items: _specializationOptions,
            onChanged: (val) => setState(() => _specialization = val!),
          ),
          const SizedBox(height: 14),

          _buildTextFieldLabel('HOSPITAL / CLINIC AFFILIATION'),
          _buildCustomInput(
            controller: _hospitalController,
            hint: 'St. Jude Women & Maternal Hospital',
            icon: Icons.local_hospital_outlined,
          ),
          const SizedBox(height: 14),

          _buildTextFieldLabel('YEARS OF CLINICAL PRACTICE'),
          _buildCustomInput(
            controller: _experienceController,
            hint: '8',
            icon: Icons.timeline_rounded,
            keyboardType: TextInputType.number,
          ),
        ],
      );
    }

    if (_accountType == 'Caregiver') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildTextFieldLabel('RELATIONSHIP TO DEPENDENT'),
          _buildDropdown(
            value: _caregiverRelationship,
            items: const ['Child (Daughter)', 'Parent (Mother)', 'Spouse / Partner', 'Sister', 'Elderly Relative', 'Other Dependent'],
            onChanged: (val) => setState(() => _caregiverRelationship = val!),
          ),
          const SizedBox(height: 14),

          _buildTextFieldLabel('DEPENDENT FULL NAME (REQUIRED)'),
          _buildCustomInput(
            controller: _dependentNameController,
            hint: 'Maya Vance',
            icon: Icons.child_care_rounded,
          ),
          const SizedBox(height: 14),

          _buildTextFieldLabel('DEPENDENT DATE OF BIRTH'),
          InkWell(
            onTap: () => _pickDate(_dependentDobController),
            borderRadius: BorderRadius.circular(16),
            child: IgnorePointer(
              child: _buildCustomInput(
                controller: _dependentDobController,
                hint: 'YYYY-MM-DD',
                icon: Icons.calendar_today_rounded,
              ),
            ),
          ),
          const SizedBox(height: 14),

          _buildTextFieldLabel('DEPENDENT BLOOD GROUP'),
          _buildDropdown(
            value: _dependentBloodGroup,
            items: _bloodGroups,
            onChanged: (val) => setState(() => _dependentBloodGroup = val!),
          ),
          const SizedBox(height: 14),

          _buildTextFieldLabel('PRIMARY CAREGIVER SCOPES'),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              'Pediatric Care',
              'Medication Schedule',
              'Telemetry Monitoring',
              'Elderly Mobility',
              'Vaccine Radar',
            ].map((scope) {
              final isSel = _caregiverScopes.contains(scope);
              return FilterChip(
                label: Text(scope, style: TextStyle(fontSize: 11, color: isSel ? Colors.white : AppTheme.textDark)),
                selected: isSel,
                selectedColor: AppTheme.primaryPurple,
                backgroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(color: isSel ? AppTheme.primaryPurple : AppTheme.borderPurple),
                ),
                onSelected: (val) {
                  setState(() {
                    if (val) {
                      _caregiverScopes.add(scope);
                    } else {
                      _caregiverScopes.remove(scope);
                    }
                  });
                },
              );
            }).toList(),
          ),
        ],
      );
    }

    // Default: Myself (Female User)
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTextFieldLabel('BLOOD GROUP'),
                  _buildDropdown(
                    value: _bloodGroup,
                    items: _bloodGroups,
                    onChanged: (val) => setState(() => _bloodGroup = val!),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTextFieldLabel('HEIGHT (CM)'),
                  _buildCustomInput(
                    controller: _heightController,
                    hint: '165',
                    icon: Icons.height_rounded,
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTextFieldLabel('WEIGHT (KG)'),
                  _buildCustomInput(
                    controller: _weightController,
                    hint: '58',
                    icon: Icons.monitor_weight_outlined,
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        _buildTextFieldLabel('ADAPTIVE LIFE STAGE'),
        _buildDropdown(
          value: _lifeStage,
          items: _lifeStageOptions,
          onChanged: (val) => setState(() => _lifeStage = val!),
        ),
        const SizedBox(height: 14),

        _buildTextFieldLabel('EMERGENCY CONTACT NAME'),
        _buildCustomInput(
          controller: _emergencyNameController,
          hint: 'Claire Vance (Mother)',
          icon: Icons.contact_phone_outlined,
        ),
        const SizedBox(height: 14),

        _buildTextFieldLabel('EMERGENCY CONTACT PHONE'),
        _buildCustomInput(
          controller: _emergencyPhoneController,
          hint: '+1 (555) 998-1234',
          icon: Icons.phone_in_talk_outlined,
          keyboardType: TextInputType.phone,
        ),
      ],
    );
  }

  // ==========================================
  // STEP 5: CONSENT & RULES
  // ==========================================
  Widget _buildStep5Consent() {
    return Column(
      children: [
        _buildConsentTile(
          value: _termsAgreed,
          title: 'Terms of Healthcare Service',
          desc: 'I agree to the FemSphere Platform Terms of Care, Acceptable Use, and Clinical Data Governance.',
          onChanged: (val) => setState(() => _termsAgreed = val ?? false),
        ),
        const SizedBox(height: 12),
        _buildConsentTile(
          value: _hipaaConsent,
          title: 'HIPAA & Medical Privacy Consent',
          desc: 'I consent to the encrypted storage and role-based sharing of my telemetry with licensed clinicians.',
          onChanged: (val) => setState(() => _hipaaConsent = val ?? false),
        ),
        const SizedBox(height: 12),
        _buildConsentTile(
          value: _aiTwinTrainingOptIn,
          title: 'AI Digital Health Twin Proactive Care',
          desc: 'Enable real-time predictive cycle forecasting, anomaly detection, and wearable synchronization.',
          onChanged: (val) => setState(() => _aiTwinTrainingOptIn = val ?? false),
        ),
      ],
    );
  }

  Widget _buildConsentTile({
    required bool value,
    required String title,
    required String desc,
    required ValueChanged<bool?> onChanged,
  }) {
    return InkWell(
      onTap: () => onChanged(!value),
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: value ? const Color(0xFFF5F3FF) : Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: value ? AppTheme.primaryPurple : AppTheme.borderPurple,
            width: value ? 1.5 : 1,
          ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 24,
              height: 24,
              child: Checkbox(
                value: value,
                activeColor: AppTheme.primaryPurple,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                onChanged: onChanged,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.plusJakartaSans(
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                      color: AppTheme.textDark,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    desc,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      color: AppTheme.textMuted,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // FORM FIELD UTILITIES
  // ==========================================
  Widget _buildTextFieldLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(
        label,
        style: GoogleFonts.plusJakartaSans(
          fontSize: 10,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.8,
          color: const Color(0xFF4A4145),
        ),
      ),
    );
  }

  Widget _buildCustomInput({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    bool obscureText = false,
    Widget? suffixIcon,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return TextField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      style: GoogleFonts.plusJakartaSans(fontSize: 13, color: AppTheme.textDark),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.plusJakartaSans(color: Colors.grey.shade400, fontSize: 13),
        prefixIcon: Icon(icon, color: AppTheme.textMuted, size: 18),
        suffixIcon: suffixIcon,
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
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
    );
  }

  Widget _buildDropdown({
    required String value,
    required List<String> items,
    required ValueChanged<String?> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderPurple),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: items.contains(value) ? value : items.first,
          isExpanded: true,
          icon: const Icon(Icons.keyboard_arrow_down_rounded, color: AppTheme.textMuted),
          style: GoogleFonts.plusJakartaSans(fontSize: 13, color: AppTheme.textDark),
          items: items.map((e) => DropdownMenuItem(value: e, child: Text(e, overflow: TextOverflow.ellipsis))).toList(),
          onChanged: onChanged,
        ),
      ),
    );
  }
}
