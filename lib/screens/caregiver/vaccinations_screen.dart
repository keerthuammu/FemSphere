import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/vaccination_model.dart';
import '../../services/api_service.dart';

class VaccinationsScreen extends StatefulWidget {
  final String dependentName;

  const VaccinationsScreen({super.key, this.dependentName = 'Dependent'});

  @override
  State<VaccinationsScreen> createState() => _VaccinationsScreenState();
}

class _VaccinationsScreenState extends State<VaccinationsScreen> {
  List<VaccinationModel> _vaccinations = [];
  bool _isLoading = true;
  String? _errorMessage;
  String _selectedFilter = 'All';

  @override
  void initState() {
    super.initState();
    _loadVaccinations();
  }

  Future<void> _loadVaccinations() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final raw = await ApiService.getVaccinations(1);
      final List<VaccinationModel> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add(VaccinationModel.fromJson(item));
        }
      }
      setState(() {
        _vaccinations = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load vaccinations: $e';
        _isLoading = false;
      });
    }
  }

  void _openLogVaccineModal() {
    final nameController = TextEditingController();
    final diseaseController = TextEditingController();
    final ageController = TextEditingController(text: '4–6 Years');
    final clinicController = TextEditingController(text: 'Pediatric Clinic');
    final batchController = TextEditingController(text: 'VAC-2026-X9');

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
                  const Text('💉 Log Administered Vaccine', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                  IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                ],
              ),
              const SizedBox(height: 16),
              TextField(
                controller: nameController,
                decoration: const InputDecoration(labelText: 'Vaccine Name * (e.g. MMR Booster)', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: diseaseController,
                decoration: const InputDecoration(labelText: 'Target Disease Protection *', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: ageController,
                      decoration: const InputDecoration(labelText: 'Recommended Age', border: OutlineInputBorder()),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: batchController,
                      decoration: const InputDecoration(labelText: 'Batch / Lot #', border: OutlineInputBorder()),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              TextField(
                controller: clinicController,
                decoration: const InputDecoration(labelText: 'Administering Clinic / Hospital', border: OutlineInputBorder()),
              ),
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
                    final newVac = VaccinationModel(
                      id: DateTime.now().millisecondsSinceEpoch,
                      vaccineName: nameController.text.trim(),
                      targetDisease: diseaseController.text.trim(),
                      recommendedAge: ageController.text.trim(),
                      dueDate: DateTime.now().toString().split(' ')[0],
                      status: 'Completed',
                      administeredDate: DateTime.now().toString().split(' ')[0],
                      administeredBy: clinicController.text.trim(),
                      batchNumber: batchController.text.trim(),
                    );
                    setState(() => _vaccinations.add(newVac));
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Immunization record saved!'), backgroundColor: AppTheme.secondaryTeal),
                    );
                  },
                  child: const Text('Save Immunization Record', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedFilter == 'All'
        ? _vaccinations
        : _vaccinations.where((v) => v.status == _selectedFilter).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: Text('💉 ${widget.dependentName} Vaccines'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadVaccinations),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primaryPurple,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Log Vaccine'),
        onPressed: _openLogVaccineModal,
      ),
      body: Column(
        children: [
          SizedBox(
            height: 48,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              scrollDirection: Axis.horizontal,
              itemCount: 4,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, idx) {
                final filters = ['All', 'Due Soon', 'Completed', 'Upcoming'];
                final f = filters[idx];
                final isSel = _selectedFilter == f;
                return ChoiceChip(
                  label: Text(f, style: TextStyle(fontSize: 12, color: isSel ? Colors.white : AppTheme.textDark)),
                  selected: isSel,
                  selectedColor: AppTheme.primaryPurple,
                  onSelected: (sel) {
                    if (sel) setState(() => _selectedFilter = f);
                  },
                );
              },
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
                              const Icon(Icons.cloud_off, size: 48, color: Colors.grey),
                              const SizedBox(height: 12),
                              Text(_errorMessage!, textAlign: TextAlign.center, style: const TextStyle(color: AppTheme.textMuted)),
                              const SizedBox(height: 16),
                              ElevatedButton(onPressed: _loadVaccinations, child: const Text('Retry')),
                            ],
                          ),
                        ),
                      )
                    : filtered.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.vaccines_outlined, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                                const SizedBox(height: 16),
                                const Text('No immunization records found', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                                const SizedBox(height: 6),
                                const Text('Tap "Log Vaccine" to record administered doses.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadVaccinations,
                            child: ListView.separated(
                              padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
                              itemCount: filtered.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 12),
                              itemBuilder: (context, index) {
                                final v = filtered[index];
                                Color badgeColor = AppTheme.secondaryTeal;
                                if (v.status == 'Due Soon') badgeColor = Colors.orange;
                                if (v.status == 'Overdue') badgeColor = Colors.red;

                                return Container(
                                  padding: const EdgeInsets.all(16),
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
                                          Text(v.vaccineName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: badgeColor.withValues(alpha: 0.12),
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: Text(v.status, style: TextStyle(color: badgeColor, fontSize: 11, fontWeight: FontWeight.bold)),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(v.targetDisease, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                                      const Divider(height: 20),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text('Target Age: ${v.recommendedAge}', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                          Text(
                                            v.administeredDate != null ? 'Administered: ${v.administeredDate}' : 'Due: ${v.dueDate}',
                                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textDark),
                                          ),
                                        ],
                                      ),
                                    ],
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
