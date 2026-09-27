import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/patient_model.dart';
import '../../services/api_service.dart';
import 'doctor_consultations_screen.dart';
import 'doctor_records_screen.dart';

class DoctorPatientsScreen extends StatefulWidget {
  const DoctorPatientsScreen({super.key});

  @override
  State<DoctorPatientsScreen> createState() => _DoctorPatientsScreenState();
}

class _DoctorPatientsScreenState extends State<DoctorPatientsScreen> {
  List<PatientModel> _patients = [];
  bool _isLoading = true;
  String? _errorMessage;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadPatients();
  }

  Future<void> _loadPatients() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final raw = await ApiService.getDoctorPatients();
      final List<PatientModel> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add(PatientModel.fromJson(item));
        }
      }
      setState(() {
        _patients = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load patients: $e';
        _isLoading = false;
      });
    }
  }

  void _showPatientDetails(PatientModel patient) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 24,
            right: 24,
            top: 24,
            bottom: MediaQuery.of(context).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: const Color(0xFFCCFBF1),
                        child: Text(
                          patient.fullName.isNotEmpty ? patient.fullName[0].toUpperCase() : 'P',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.secondaryTeal),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(patient.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.textDark)),
                          Text('Age: ${patient.age} • Blood: ${patient.bloodGroup}', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                        ],
                      ),
                    ],
                  ),
                  IconButton(onPressed: () => Navigator.pop(ctx), icon: const Icon(Icons.close)),
                ],
              ),
              const Divider(height: 32),
              const Text('CLINICAL BASELINE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textMuted, letterSpacing: 0.8)),
              const SizedBox(height: 12),
              _detailRow(Icons.cake, 'Life Stage', patient.lifeStage),
              _detailRow(Icons.email, 'Email', patient.email),
              _detailRow(Icons.healing, 'Primary Concern', patient.primaryConcern),
              _detailRow(Icons.shield_outlined, 'Risk Tier', patient.riskCategory),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.folder_shared, size: 16),
                      label: const Text('View Vault Records', style: TextStyle(fontSize: 12)),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.primaryPurple,
                        side: const BorderSide(color: AppTheme.borderPurple),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      onPressed: () {
                        Navigator.pop(ctx);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const DoctorRecordsScreen()));
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.note_add, size: 16),
                      label: const Text('Prescribe Note', style: TextStyle(fontSize: 12)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryPurple,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      onPressed: () {
                        Navigator.pop(ctx);
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const DoctorConsultationsScreen()));
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _detailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, size: 16, color: AppTheme.secondaryTeal),
          const SizedBox(width: 8),
          Text('$label: ', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textDark)),
          Expanded(child: Text(value, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted), overflow: TextOverflow.ellipsis)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _patients.where((p) {
      final q = _searchQuery.toLowerCase();
      return p.fullName.toLowerCase().contains(q) ||
          p.primaryConcern.toLowerCase().contains(q) ||
          p.email.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('👥 Attending Patient Roster'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadPatients),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search patients by name or concern...',
                prefixIcon: const Icon(Icons.search, color: AppTheme.textMuted),
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppTheme.borderPurple)),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppTheme.borderPurple)),
              ),
              onChanged: (val) => setState(() => _searchQuery = val),
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryPurple))
                : _errorMessage != null
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.error_outline, size: 48, color: Colors.grey),
                              const SizedBox(height: 12),
                              Text(_errorMessage!, textAlign: TextAlign.center, style: const TextStyle(color: AppTheme.textMuted)),
                              const SizedBox(height: 16),
                              ElevatedButton(onPressed: _loadPatients, child: const Text('Retry')),
                            ],
                          ),
                        ),
                      )
                    : filtered.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.people_outline, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                                const SizedBox(height: 16),
                                Text(
                                  _patients.isEmpty ? 'No patients currently booked' : 'No patients match your search',
                                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark),
                                ),
                                const SizedBox(height: 6),
                                const Text('Patients with active bookings will appear here.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadPatients,
                            child: ListView.separated(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              itemCount: filtered.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 12),
                              itemBuilder: (context, index) {
                                final p = filtered[index];
                                return InkWell(
                                  onTap: () => _showPatientDetails(p),
                                  borderRadius: BorderRadius.circular(20),
                                  child: Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(color: AppTheme.borderPurple),
                                    ),
                                    child: Row(
                                      children: [
                                        CircleAvatar(
                                          radius: 24,
                                          backgroundColor: const Color(0xFFCCFBF1),
                                          child: Text(
                                            p.fullName.isNotEmpty ? p.fullName[0].toUpperCase() : 'P',
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.secondaryTeal),
                                          ),
                                        ),
                                        const SizedBox(width: 14),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(p.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark)),
                                              const SizedBox(height: 2),
                                              Text(p.primaryConcern, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted), maxLines: 1, overflow: TextOverflow.ellipsis),
                                              const SizedBox(height: 4),
                                              Row(
                                                children: [
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                    decoration: BoxDecoration(
                                                      color: AppTheme.primaryPurple.withValues(alpha: 0.1),
                                                      borderRadius: BorderRadius.circular(6),
                                                    ),
                                                    child: Text('Blood: ${p.bloodGroup}', style: const TextStyle(fontSize: 10, color: AppTheme.primaryPurple, fontWeight: FontWeight.bold)),
                                                  ),
                                                  const SizedBox(width: 8),
                                                  Text(p.lifeStage, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                        const Icon(Icons.chevron_right, color: AppTheme.borderPurple),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }
}
