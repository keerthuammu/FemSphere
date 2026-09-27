import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/consultation_model.dart';
import '../../services/api_service.dart';

class DoctorConsultationsScreen extends StatefulWidget {
  const DoctorConsultationsScreen({super.key});

  @override
  State<DoctorConsultationsScreen> createState() => _DoctorConsultationsScreenState();
}

class _DoctorConsultationsScreenState extends State<DoctorConsultationsScreen> {
  List<ConsultationModel> _consultations = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadConsultations();
  }

  Future<void> _loadConsultations() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final raw = await ApiService.getDoctorConsultations();
      final List<ConsultationModel> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add(ConsultationModel.fromJson(item));
        }
      }
      setState(() {
        _consultations = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load consultation notes: $e';
        _isLoading = false;
      });
    }
  }

  void _openPrescriptionComposer() {
    final patientController = TextEditingController();
    final diagnosisController = TextEditingController();
    final medController = TextEditingController();
    final dosageController = TextEditingController();
    final freqController = TextEditingController(text: 'Once Daily');
    final daysController = TextEditingController(text: '30');
    final notesController = TextEditingController();

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
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('💊 Write Digital Rx & Consult Notes', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                    IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: patientController,
                  decoration: const InputDecoration(labelText: 'Patient Name', border: OutlineInputBorder()),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: diagnosisController,
                  decoration: const InputDecoration(labelText: 'Clinical Diagnosis', border: OutlineInputBorder()),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: TextField(
                        controller: medController,
                        decoration: const InputDecoration(labelText: 'Medication Name', border: OutlineInputBorder()),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: dosageController,
                        decoration: const InputDecoration(labelText: 'Dosage (e.g. 200mg)', border: OutlineInputBorder()),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: freqController,
                        decoration: const InputDecoration(labelText: 'Frequency', border: OutlineInputBorder()),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: daysController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(labelText: 'Duration (Days)', border: OutlineInputBorder()),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: notesController,
                  maxLines: 3,
                  decoration: const InputDecoration(labelText: 'Clinical Advice & Regimen Notes', border: OutlineInputBorder()),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.secondaryTeal,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: () async {
                      if (diagnosisController.text.trim().isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Please enter a clinical diagnosis.')),
                        );
                        return;
                      }

                      final notePayload = {
                        'patientName': patientController.text.trim(),
                        'diagnosis': diagnosisController.text.trim(),
                        'chiefComplaint': diagnosisController.text.trim(),
                        'advice': notesController.text.trim().isNotEmpty ? notesController.text.trim() : 'Prescribed medical regimen.',
                        'medications': [
                          if (medController.text.trim().isNotEmpty)
                            {
                              'name': medController.text.trim(),
                              'dosage': dosageController.text.trim(),
                              'frequency': freqController.text.trim(),
                              'duration': '${daysController.text.trim()} Days',
                              'instructions': 'As directed by physician'
                            }
                        ]
                      };

                      try {
                        await ApiService.createConsultationNote(notePayload);
                        if (mounted) {
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Digital prescription saved to patient record!'), backgroundColor: AppTheme.secondaryTeal),
                          );
                          _loadConsultations();
                        }
                      } catch (e) {
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Error saving consultation: $e'), backgroundColor: Colors.red),
                          );
                        }
                      }
                    },
                    child: const Text('Save & Issue Digital Prescription', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('📝 Consultations & Digital Rx'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadConsultations),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.secondaryTeal,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('New Prescription'),
        onPressed: _openPrescriptionComposer,
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
                        ElevatedButton(onPressed: _loadConsultations, child: const Text('Retry')),
                      ],
                    ),
                  ),
                )
              : _consultations.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.receipt_long_outlined, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                          const SizedBox(height: 16),
                          const Text('No consultation records found', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                          const SizedBox(height: 6),
                          const Text('Tap "New Prescription" to write a clinical consultation note.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadConsultations,
                      child: ListView.separated(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                        itemCount: _consultations.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 14),
                        itemBuilder: (context, index) {
                          final c = _consultations[index];
                          return Container(
                            padding: const EdgeInsets.all(18),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppTheme.borderPurple),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(c.patientName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFCCFBF1),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(c.date, style: const TextStyle(fontSize: 11, color: AppTheme.secondaryTeal, fontWeight: FontWeight.bold)),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text('Dx: ${c.clinicalDiagnosis}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.secondaryTeal)),
                                const SizedBox(height: 6),
                                Text('Chief Complaint: ${c.chiefComplaint}', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                                if (c.prescriptions.isNotEmpty) ...[
                                  const Divider(height: 20),
                                  const Text('PRESCRIBED MEDICATIONS', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted, letterSpacing: 0.5)),
                                  const SizedBox(height: 8),
                                  ...c.prescriptions.map((rx) => Padding(
                                        padding: const EdgeInsets.symmetric(vertical: 2),
                                        child: Row(
                                          children: [
                                            const Icon(Icons.circle, size: 6, color: AppTheme.secondaryTeal),
                                            const SizedBox(width: 8),
                                            Text('${rx.medication} ${rx.dosage}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textDark)),
                                            const Spacer(),
                                            Text('${rx.frequency} • ${rx.durationDays}d', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                          ],
                                        ),
                                      )),
                                ],
                                const Divider(height: 20),
                                Text(c.clinicalNotes, style: const TextStyle(fontSize: 12, color: AppTheme.textDark, height: 1.4)),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
