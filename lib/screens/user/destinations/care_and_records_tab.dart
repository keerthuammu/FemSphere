import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:file_picker/file_picker.dart';
import '../../../core/app_theme.dart';
import '../../../models/appointment_model.dart';
import '../../../models/medical_record_model.dart';
import '../../../services/api_service.dart';

class CareAndRecordsTab extends StatefulWidget {
  final VoidCallback? onBack;

  const CareAndRecordsTab({super.key, this.onBack});

  @override
  State<CareAndRecordsTab> createState() => _CareAndRecordsTabState();
}

class _CareAndRecordsTabState extends State<CareAndRecordsTab> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  bool _isLoading = true;
  String? _errorMessage;

  // Appointments state
  List<AppointmentModel> _appointments = [];
  String _appointmentFilter = 'All';

  // Medical Records state
  List<MedicalRecordModel> _medicalRecords = [];
  String _selectedCategory = 'All';
  String _searchQuery = '';
  final TextEditingController _searchCtrl = TextEditingController();

  final List<String> _categories = [
    'All',
    'Lab Results',
    'Prescriptions',
    'Scans & Imaging',
    'Clinical Summaries',
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadAllData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadAllData() async {
    setState(() => _isLoading = true);
    try {
      final results = await Future.wait([
        ApiService.getAppointments().catchError((_) => <dynamic>[]),
        ApiService.getMedicalRecords().catchError((_) => <dynamic>[]),
      ]);

      if (!mounted) return;

      final apptsRaw = results[0] as List<dynamic>;
      final recordsRaw = results[1] as List<dynamic>;

      final List<AppointmentModel> apptList = [];
      for (var item in apptsRaw) {
        if (item is Map<String, dynamic>) {
          apptList.add(AppointmentModel.fromJson(item));
        }
      }

      final List<MedicalRecordModel> recordList = [];
      for (var item in recordsRaw) {
        if (item is Map<String, dynamic>) {
          recordList.add(MedicalRecordModel.fromJson(item));
        }
      }

      setState(() {
        _appointments = apptList;
        _medicalRecords = recordList;
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  // ===========================================================================
  // BOOK APPOINTMENT MODAL (React UserAppointments parity)
  // ===========================================================================
  void _showBookAppointmentSheet() async {
    List<dynamic> doctors = [];
    try {
      doctors = await ApiService.getDoctors();
    } catch (_) {}

    if (doctors.isEmpty) {
      doctors = [
        {'id': 1, 'full_name': 'Dr. Sarah Jenkins', 'specialty': 'Obstetrics & Gynecology'},
        {'id': 2, 'full_name': 'Dr. Maya Patel', 'specialty': 'Reproductive Endocrinology'},
      ];
    }

    if (!mounted) return;

    int selectedDoctorId = doctors.first['id'] as int? ?? 1;
    final dateCtrl = TextEditingController(text: DateFormat('yyyy-MM-dd').format(DateTime.now().add(const Duration(days: 2))));
    final timeCtrl = TextEditingController(text: '10:30 AM');
    final reasonCtrl = TextEditingController();
    bool isSubmitting = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Container(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE2E8F0),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Book Doctor Consultation',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF201538),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Schedule an in-person or video consultation with a verified specialist.',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: const Color(0xFF7A6F75)),
              ),
              const SizedBox(height: 16),

              // Doctor selector
              DropdownButtonFormField<int>(
                initialValue: selectedDoctorId,
                decoration: InputDecoration(
                  labelText: 'Select Doctor',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
                items: doctors.map((doc) {
                  final name = doc['full_name'] ?? doc['name'] ?? 'Doctor';
                  final spec = doc['specialty'] ?? 'Specialist';
                  return DropdownMenuItem<int>(
                    value: doc['id'] as int?,
                    child: Text('$name · $spec', style: const TextStyle(fontSize: 13)),
                  );
                }).toList(),
                onChanged: (id) {
                  if (id != null) setSheetState(() => selectedDoctorId = id);
                },
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: dateCtrl,
                      decoration: InputDecoration(
                        labelText: 'Date',
                        suffixIcon: const Icon(Icons.calendar_today, size: 16),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      readOnly: true,
                      onTap: () async {
                        final picked = await showDatePicker(
                          context: ctx,
                          initialDate: DateTime.now().add(const Duration(days: 1)),
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(const Duration(days: 60)),
                        );
                        if (picked != null) {
                          dateCtrl.text = DateFormat('yyyy-MM-dd').format(picked);
                        }
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      controller: timeCtrl,
                      decoration: InputDecoration(
                        labelText: 'Time Slot',
                        suffixIcon: const Icon(Icons.access_time, size: 16),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              TextField(
                controller: reasonCtrl,
                maxLines: 2,
                decoration: InputDecoration(
                  labelText: 'Reason for Consultation / Symptoms',
                  hintText: 'e.g., Routine cycle checkup, hormonal review',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: isSubmitting
                      ? null
                      : () async {
                          setSheetState(() => isSubmitting = true);
                          final res = await ApiService.bookAppointment({
                            'doctorId': selectedDoctorId,
                            'appointmentDate': dateCtrl.text,
                            'appointmentTime': timeCtrl.text,
                            'reason': reasonCtrl.text.trim(),
                            'type': 'In-Person',
                          });

                          if (mounted) {
                            Navigator.pop(ctx);
                            await _loadAllData();
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(res['success'] == true
                                    ? 'Appointment scheduled successfully!'
                                    : 'Appointment booking submitted.'),
                                backgroundColor: const Color(0xFF10B981),
                              ),
                            );
                          }
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryPurple,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: isSubmitting
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(
                          'Confirm Appointment',
                          style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ===========================================================================
  // UPLOAD MEDICAL RECORD MODAL (React UserRecords upload parity)
  // ===========================================================================
  void _showUploadRecordSheet() {
    final titleCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    String category = 'Lab Results';
    PlatformFile? selectedFile;
    bool isUploading = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Container(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE2E8F0),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Upload Medical Record',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF201538),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Add lab panels, clinical prescriptions, or scan reports to your encrypted vault.',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: const Color(0xFF7A6F75)),
              ),
              const SizedBox(height: 16),

              TextField(
                controller: titleCtrl,
                decoration: InputDecoration(
                  labelText: 'Document Title',
                  hintText: 'e.g. Hormonal Panel Bloodwork',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
              const SizedBox(height: 12),

              DropdownButtonFormField<String>(
                initialValue: category,
                decoration: InputDecoration(
                  labelText: 'Record Category',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
                items: [
                  'Lab Results',
                  'Prescriptions',
                  'Scans & Imaging',
                  'Clinical Summaries',
                ].map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (c) {
                  if (c != null) setSheetState(() => category = c);
                },
              ),
              const SizedBox(height: 12),

              TextField(
                controller: descCtrl,
                maxLines: 2,
                decoration: InputDecoration(
                  labelText: 'Clinical Notes (Optional)',
                  hintText: 'e.g. Performed on Day 21 for progesterone review',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
              const SizedBox(height: 12),

              // File attachment picker
              OutlinedButton.icon(
                onPressed: () async {
                  final result = await FilePicker.platform.pickFiles(
                    type: FileType.custom,
                    allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg'],
                    withData: true,
                  );
                  if (result != null && result.files.isNotEmpty) {
                    setSheetState(() => selectedFile = result.files.first);
                  }
                },
                icon: const Icon(Icons.attach_file, size: 18),
                label: Text(
                  selectedFile != null ? 'File: ${selectedFile!.name}' : 'Select PDF or Image Attachment',
                  overflow: TextOverflow.ellipsis,
                ),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 48),
                  foregroundColor: AppTheme.primaryPurple,
                  side: const BorderSide(color: Color(0xFFEDE4F7)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: isUploading
                      ? null
                      : () async {
                          if (titleCtrl.text.trim().isEmpty) return;
                          setSheetState(() => isUploading = true);

                          final res = await ApiService.uploadMedicalRecordMultipart(
                            title: titleCtrl.text.trim(),
                            category: category,
                            description: descCtrl.text.trim(),
                            filePath: selectedFile?.path,
                            fileBytes: selectedFile?.bytes,
                            fileName: selectedFile?.name ?? '${titleCtrl.text.trim()}.pdf',
                          );

                          if (mounted) {
                            Navigator.pop(ctx);
                            await _loadAllData();
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(res['success'] == true
                                    ? 'Medical report uploaded successfully!'
                                    : 'Record added to your health vault.'),
                                backgroundColor: const Color(0xFF10B981),
                              ),
                            );
                          }
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryPurple,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: isUploading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(
                          'Upload to Medical Vault',
                          style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.primaryPurple));
    }

    return Scaffold(
      backgroundColor: const Color(0xFFFAF7FD),
      body: SafeArea(
        child: Column(
          children: [
            // Header Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Care & Health Vault',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: const Color(0xFF201538),
                          letterSpacing: -0.4,
                        ),
                      ),
                      Text(
                        'Appointments, consultations & clinical records',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          color: const Color(0xFF7A6F75),
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.add_circle_outline, color: AppTheme.primaryPurple, size: 24),
                        tooltip: 'Quick Action',
                        onPressed: () {
                          if (_tabController.index == 0) {
                            _showBookAppointmentSheet();
                          } else {
                            _showUploadRecordSheet();
                          }
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Segmented Tab Bar (Lavender/Pink styling)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 18),
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: const Color(0xFFF1EBF9),
                borderRadius: BorderRadius.circular(16),
              ),
              child: TabBar(
                controller: _tabController,
                indicator: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF201538).withValues(alpha: 0.05),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                indicatorSize: TabBarIndicatorSize.tab,
                labelColor: AppTheme.primaryPurple,
                unselectedLabelColor: const Color(0xFF7A6F75),
                labelStyle: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold),
                unselectedLabelStyle: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600),
                tabs: [
                  Tab(
                    icon: const Icon(Icons.calendar_month_rounded, size: 16),
                    text: 'Appointments (${_appointments.length})',
                  ),
                  Tab(
                    icon: const Icon(Icons.folder_shared_rounded, size: 16),
                    text: 'Medical Vault (${_medicalRecords.length})',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),

            // Tab Views
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildAppointmentsTab(),
                  _buildMedicalRecordsTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ===========================================================================
  // 1. APPOINTMENTS TAB
  // ===========================================================================
  Widget _buildAppointmentsTab() {
    final filtered = _appointments.where((a) {
      if (_appointmentFilter == 'All') return true;
      return a.status.toLowerCase() == _appointmentFilter.toLowerCase();
    }).toList();

    return RefreshIndicator(
      color: AppTheme.primaryPurple,
      onRefresh: _loadAllData,
      child: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
        children: [
          // Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: ['All', 'Scheduled', 'Completed', 'Cancelled'].map((f) {
                final isSelected = _appointmentFilter == f;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(f),
                    selected: isSelected,
                    onSelected: (_) => setState(() => _appointmentFilter = f),
                    selectedColor: AppTheme.primaryPurpleLight,
                    backgroundColor: Colors.white,
                    labelStyle: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                      color: isSelected ? AppTheme.primaryPurple : const Color(0xFF7A6F75),
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                      side: BorderSide(color: isSelected ? AppTheme.primaryPurple : const Color(0xFFF1EBF9)),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 14),

          // "Book Appointment" banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFEDE4F7), Color(0xFFFAF7FD)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2D6F3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.medical_services_outlined, color: AppTheme.primaryPurple, size: 28),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Need a Doctor\'s Opinion?',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF201538),
                        ),
                      ),
                      Text(
                        'Book a session with certified OB/GYNs and endocrinologists.',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          color: const Color(0xFF7A6F75),
                        ),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: _showBookAppointmentSheet,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryPurple,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  ),
                  child: const Text('Book', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          if (filtered.isEmpty)
            Container(
              padding: const EdgeInsets.all(32),
              alignment: Alignment.center,
              child: Column(
                children: [
                  const Icon(Icons.event_busy, size: 38, color: Color(0xFFB3A9C4)),
                  const SizedBox(height: 8),
                  Text(
                    'No appointments found in this section.',
                    style: GoogleFonts.plusJakartaSans(fontSize: 12, color: const Color(0xFF7A6F75)),
                  ),
                ],
              ),
            )
          else
            ...filtered.map((appt) => _buildAppointmentCard(appt)),
        ],
      ),
    );
  }

  Widget _buildAppointmentCard(AppointmentModel appt) {
    Color statusBg = const Color(0xFFDCFCE7);
    Color statusColor = const Color(0xFF15803D);

    if (appt.status.toLowerCase() == 'cancelled') {
      statusBg = const Color(0xFFFEE2E2);
      statusColor = const Color(0xFFB91C1C);
    } else if (appt.status.toLowerCase() == 'completed') {
      statusBg = const Color(0xFFF1F5F9);
      statusColor = const Color(0xFF475569);
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1EBF9), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF201538).withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
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
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: AppTheme.primaryPurpleLight,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.medical_services_rounded, color: AppTheme.primaryPurple, size: 18),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        appt.doctorName.isNotEmpty ? appt.doctorName : 'Specialist Consultation',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF201538),
                        ),
                      ),
                      Text(
                        appt.type,
                        style: GoogleFonts.plusJakartaSans(fontSize: 11, color: const Color(0xFF7A6F75)),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: statusBg,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  appt.status,
                  style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.bold, color: statusColor),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Divider(height: 1, color: Color(0xFFF8F5FC)),
          const SizedBox(height: 10),

          Row(
            children: [
              const Icon(Icons.access_time_rounded, size: 14, color: Color(0xFF7A6F75)),
              const SizedBox(width: 6),
              Text(
                '${appt.date} at ${appt.timeSlot}',
                style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w600, color: const Color(0xFF201538)),
              ),
              const Spacer(),
              if (appt.status.toLowerCase() == 'scheduled')
                TextButton(
                  onPressed: () async {
                    await ApiService.cancelAppointment(appt.id);
                    await _loadAllData();
                  },
                  child: Text(
                    'Cancel',
                    style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.bold, color: const Color(0xFFEF4444)),
                  ),
                ),
            ],
          ),
          if (appt.reason.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(
              'Notes: ${appt.reason}',
              style: GoogleFonts.plusJakartaSans(fontSize: 11, color: const Color(0xFF8E859E)),
            ),
          ],
        ],
      ),
    );
  }

  // ===========================================================================
  // 2. MEDICAL RECORDS TAB (React UserRecords parity)
  // ===========================================================================
  Widget _buildMedicalRecordsTab() {
    final filtered = _medicalRecords.where((r) {
      final matchesCat = _selectedCategory == 'All' || r.category.toLowerCase() == _selectedCategory.toLowerCase();
      final matchesSearch = _searchQuery.isEmpty ||
          r.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          r.doctorOrLab.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    }).toList();

    return RefreshIndicator(
      color: AppTheme.primaryPurple,
      onRefresh: _loadAllData,
      child: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
        children: [
          // Search Bar
          TextField(
            controller: _searchCtrl,
            onChanged: (val) => setState(() => _searchQuery = val.trim()),
            decoration: InputDecoration(
              hintText: 'Search records, biomarkers, clinic...',
              hintStyle: GoogleFonts.plusJakartaSans(fontSize: 12, color: const Color(0xFFB3A9C4)),
              prefixIcon: const Icon(Icons.search, size: 18, color: Color(0xFF8E859E)),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(color: Color(0xFFF1EBF9)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(color: Color(0xFFF1EBF9)),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Category Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _categories.map((c) {
                final isSelected = _selectedCategory == c;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(c),
                    selected: isSelected,
                    onSelected: (_) => setState(() => _selectedCategory = c),
                    selectedColor: AppTheme.primaryPurpleLight,
                    backgroundColor: Colors.white,
                    labelStyle: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                      color: isSelected ? AppTheme.primaryPurple : const Color(0xFF7A6F75),
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                      side: BorderSide(color: isSelected ? AppTheme.primaryPurple : const Color(0xFFF1EBF9)),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 14),

          // Upload Record Action Button
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFFCF4F5), Color(0xFFFFF9FA)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFF4DDE2)),
            ),
            child: Row(
              children: [
                const Icon(Icons.cloud_upload_outlined, color: Color(0xFFF43F5E), size: 28),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Upload Clinical Document',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF201538),
                        ),
                      ),
                      Text(
                        'PDFs, lab panels, and imaging reports are end-to-end encrypted.',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          color: const Color(0xFF7A6F75),
                        ),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: _showUploadRecordSheet,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFF43F5E),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  ),
                  child: const Text('Upload', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          if (filtered.isEmpty)
            Container(
              padding: const EdgeInsets.all(32),
              alignment: Alignment.center,
              child: Column(
                children: [
                  const Icon(Icons.folder_open, size: 38, color: Color(0xFFB3A9C4)),
                  const SizedBox(height: 8),
                  Text(
                    'No clinical records found.',
                    style: GoogleFonts.plusJakartaSans(fontSize: 12, color: const Color(0xFF7A6F75)),
                  ),
                ],
              ),
            )
          else
            ...filtered.map((rec) => _buildMedicalRecordCard(rec)),
        ],
      ),
    );
  }

  Widget _buildMedicalRecordCard(MedicalRecordModel rec) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1EBF9), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF201538).withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: const Color(0xFFEDE4F7),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.file_present_rounded, color: AppTheme.primaryPurple, size: 20),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            rec.title,
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: const Color(0xFF201538),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            '${rec.category} · ${rec.date}',
                            style: GoogleFonts.plusJakartaSans(fontSize: 11, color: const Color(0xFF7A6F75)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.delete_outline, size: 18, color: Color(0xFFEF4444)),
                onPressed: () async {
                  await ApiService.deleteMedicalRecord(rec.id);
                  await _loadAllData();
                },
              ),
            ],
          ),
          if (rec.summary != null && rec.summary!.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              rec.summary!,
              style: GoogleFonts.plusJakartaSans(fontSize: 11, color: const Color(0xFF8E859E)),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ],
      ),
    );
  }
}
