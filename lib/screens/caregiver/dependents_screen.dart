import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/dependent_model.dart';
import '../../services/api_service.dart';

class DependentsScreen extends StatefulWidget {
  final ValueChanged<DependentModel>? onSelectDependent;

  const DependentsScreen({super.key, this.onSelectDependent});

  @override
  State<DependentsScreen> createState() => _DependentsScreenState();
}

class _DependentsScreenState extends State<DependentsScreen> {
  List<DependentModel> _dependents = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadDependents();
  }

  Future<void> _loadDependents() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final raw = await ApiService.getDependents();
      final List<DependentModel> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add(DependentModel.fromJson(item));
        }
      }
      setState(() {
        _dependents = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load dependents: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteDependent(int id) async {
    try {
      await ApiService.deleteDependent(id);
      setState(() {
        _dependents.removeWhere((d) => d.id == id);
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Dependent deleted successfully.')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete dependent: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  void _openAddDependentModal() {
    final nameController = TextEditingController();
    final dobController = TextEditingController(text: '2022-06-15');
    String selectedRelationship = 'Child / Daughter';
    String selectedBloodGroup = 'A+';
    final notesController = TextEditingController();

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
                        const Text(
                          '👶 Add Care Dependent',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                        ),
                        IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: nameController,
                      decoration: const InputDecoration(labelText: 'Full Name *', border: OutlineInputBorder()),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: selectedRelationship,
                      decoration: const InputDecoration(labelText: 'Relationship *', border: OutlineInputBorder()),
                      items: const [
                        DropdownMenuItem(value: 'Child / Daughter', child: Text('Child / Daughter')),
                        DropdownMenuItem(value: 'Child / Son', child: Text('Child / Son')),
                        DropdownMenuItem(value: 'Mother', child: Text('Mother')),
                        DropdownMenuItem(value: 'Father', child: Text('Father')),
                        DropdownMenuItem(value: 'Elder Relative', child: Text('Elder Relative')),
                        DropdownMenuItem(value: 'Spouse', child: Text('Spouse')),
                        DropdownMenuItem(value: 'Other', child: Text('Other')),
                      ],
                      onChanged: (val) {
                        if (val != null) setModalState(() => selectedRelationship = val);
                      },
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: dobController,
                      decoration: const InputDecoration(labelText: 'Date of Birth (YYYY-MM-DD) *', border: OutlineInputBorder()),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: selectedBloodGroup,
                      decoration: const InputDecoration(labelText: 'Blood Group', border: OutlineInputBorder()),
                      items: const ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
                          .map((bg) => DropdownMenuItem(value: bg, child: Text(bg)))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) setModalState(() => selectedBloodGroup = val);
                      },
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: notesController,
                      maxLines: 2,
                      decoration: const InputDecoration(labelText: 'Medical Notes & Allergies', border: OutlineInputBorder()),
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
                        onPressed: () async {
                          if (nameController.text.trim().isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Please enter dependent name.')),
                            );
                            return;
                          }

                          final payload = {
                            'fullName': nameController.text.trim(),
                            'relationship': selectedRelationship,
                            'dob': dobController.text.trim(),
                            'bloodGroup': selectedBloodGroup,
                            'medicalNotes': notesController.text.trim(),
                          };

                          try {
                            await ApiService.addDependent(payload);
                            if (mounted) {
                              Navigator.pop(ctx);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Dependent saved successfully!'), backgroundColor: AppTheme.secondaryTeal),
                              );
                              _loadDependents();
                            }
                          } catch (e) {
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Error adding dependent: $e'), backgroundColor: Colors.red),
                              );
                            }
                          }
                        },
                        child: const Text('Save Dependent Profile', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
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
        title: const Text('👶 Managed Dependents'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadDependents),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primaryPurple,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.person_add),
        label: const Text('Add Dependent'),
        onPressed: _openAddDependentModal,
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
                        ElevatedButton(onPressed: _loadDependents, child: const Text('Retry')),
                      ],
                    ),
                  ),
                )
              : _dependents.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.family_restroom, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                          const SizedBox(height: 16),
                          const Text('No dependents linked yet', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                          const SizedBox(height: 6),
                          const Text('Tap "Add Dependent" to manage children or elder relatives.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadDependents,
                      child: ListView.separated(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                        itemCount: _dependents.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 14),
                        itemBuilder: (context, index) {
                          final dep = _dependents[index];
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
                                  children: [
                                    CircleAvatar(
                                      radius: 24,
                                      backgroundColor: AppTheme.primaryPurple.withValues(alpha: 0.12),
                                      child: Text(
                                        dep.fullName.isNotEmpty ? dep.fullName[0].toUpperCase() : 'D',
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.primaryPurple),
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(dep.fullName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                                          Text('${dep.relationship} • DOB: ${dep.dob}', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                                        ],
                                      ),
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                                      onPressed: () => _deleteDependent(dep.id),
                                    ),
                                  ],
                                ),
                                const Divider(height: 24),
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFCCFBF1),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text('Blood: ${dep.bloodGroup}', style: const TextStyle(fontSize: 11, color: AppTheme.secondaryTeal, fontWeight: FontWeight.bold)),
                                    ),
                                    const SizedBox(width: 10),
                                    if (dep.chronicConditions != null && dep.chronicConditions!.isNotEmpty)
                                      Expanded(
                                        child: Text(
                                          'Notes: ${dep.chronicConditions}',
                                          style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                  ],
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
