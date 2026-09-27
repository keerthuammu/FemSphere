import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/medication_model.dart';
import '../../services/api_service.dart';

class MedicationsScreen extends StatefulWidget {
  final String dependentName;

  const MedicationsScreen({super.key, this.dependentName = 'Dependent'});

  @override
  State<MedicationsScreen> createState() => _MedicationsScreenState();
}

class _MedicationsScreenState extends State<MedicationsScreen> {
  List<MedicationModel> _medications = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadMedications();
  }

  Future<void> _loadMedications() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final raw = await ApiService.getMedications(1);
      final List<MedicationModel> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add(MedicationModel.fromJson(item));
        }
      }
      setState(() {
        _medications = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load medications: $e';
        _isLoading = false;
      });
    }
  }

  void _toggleMedicationTaken(int id) {
    setState(() {
      final index = _medications.indexWhere((m) => m.id == id);
      if (index != -1) {
        final current = _medications[index];
        final newStatus = !current.isTakenToday;
        _medications[index] = current.copyWith(
          isTakenToday: newStatus,
          lastTakenTimestamp: newStatus ? 'Today, ${TimeOfDay.now().format(context)}' : null,
        );
      }
    });
  }

  void _openAddMedicationModal() {
    final nameController = TextEditingController();
    final dosageController = TextEditingController();
    String frequency = 'Twice Daily';
    final timeController = TextEditingController(text: '8:00 AM & 8:00 PM');
    final instructionsController = TextEditingController(text: 'Take with meal and full glass of water.');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
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
                        const Text('💊 Add Prescription Schedule', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                        IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Medicine Name *', border: OutlineInputBorder())),
                    const SizedBox(height: 12),
                    TextField(controller: dosageController, decoration: const InputDecoration(labelText: 'Dosage (e.g. 500mg, 5ml) *', border: OutlineInputBorder())),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: frequency,
                      decoration: const InputDecoration(labelText: 'Frequency', border: OutlineInputBorder()),
                      items: const ['Once Daily', 'Twice Daily', 'Three Times Daily', 'Every 8 Hours', 'As Needed']
                          .map((f) => DropdownMenuItem(value: f, child: Text(f)))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) setModalState(() => frequency = val);
                      },
                    ),
                    const SizedBox(height: 12),
                    TextField(controller: timeController, decoration: const InputDecoration(labelText: 'Timing Reminder (e.g. 8:00 AM)', border: OutlineInputBorder())),
                    const SizedBox(height: 12),
                    TextField(controller: instructionsController, decoration: const InputDecoration(labelText: 'Administration Instructions', border: OutlineInputBorder())),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryPurple,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () {
                          if (nameController.text.trim().isEmpty) return;
                          final newMed = MedicationModel(
                            id: DateTime.now().millisecondsSinceEpoch,
                            name: nameController.text.trim(),
                            dosage: dosageController.text.trim(),
                            frequency: frequency,
                            timeOfDay: timeController.text.trim(),
                            instructions: instructionsController.text.trim(),
                            prescribedBy: 'Attending Physician',
                            startDate: DateTime.now().toString().split(' ')[0],
                          );
                          setState(() => _medications.add(newMed));
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Medication schedule saved!'), backgroundColor: AppTheme.secondaryTeal),
                          );
                        },
                        child: const Text('Add Medication Schedule', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: Text('💊 ${widget.dependentName} Prescriptions'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadMedications),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primaryPurple,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Add Medication'),
        onPressed: _openAddMedicationModal,
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
                        ElevatedButton(onPressed: _loadMedications, child: const Text('Retry')),
                      ],
                    ),
                  ),
                )
              : _medications.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.medication_outlined, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                          const SizedBox(height: 16),
                          const Text('No medications currently logged', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                          const SizedBox(height: 6),
                          const Text('Tap "Add Medication" to track prescription dosages.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadMedications,
                      child: ListView.separated(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                        itemCount: _medications.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final med = _medications[index];
                          return Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: med.isTakenToday ? AppTheme.secondaryTeal.withValues(alpha: 0.5) : AppTheme.borderPurple,
                                width: med.isTakenToday ? 1.5 : 1.0,
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(10),
                                      decoration: BoxDecoration(
                                        color: med.isTakenToday ? const Color(0xFFCCFBF1) : const Color(0xFFF3E8FF),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Icon(
                                        med.isTakenToday ? Icons.check_circle : Icons.medication,
                                        color: med.isTakenToday ? AppTheme.secondaryTeal : AppTheme.primaryPurple,
                                        size: 24,
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(med.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                                          Text('${med.dosage} • ${med.frequency}', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                                        ],
                                      ),
                                    ),
                                    Switch(
                                      value: med.isTakenToday,
                                      activeThumbColor: Colors.white,
                                      activeTrackColor: AppTheme.secondaryTeal,
                                      onChanged: (_) => _toggleMedicationTaken(med.id),
                                    ),
                                  ],
                                ),
                                const Divider(height: 20),
                                Row(
                                  children: [
                                    const Icon(Icons.schedule, size: 14, color: AppTheme.textMuted),
                                    const SizedBox(width: 4),
                                    Text(med.timeOfDay, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(med.instructions, style: const TextStyle(fontSize: 12, color: AppTheme.textDark)),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
