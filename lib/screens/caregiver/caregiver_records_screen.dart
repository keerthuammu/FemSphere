import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/medical_record_model.dart';
import '../../services/api_service.dart';

class CaregiverRecordsScreen extends StatefulWidget {
  final String dependentName;

  const CaregiverRecordsScreen({super.key, this.dependentName = 'Dependent'});

  @override
  State<CaregiverRecordsScreen> createState() => _CaregiverRecordsScreenState();
}

class _CaregiverRecordsScreenState extends State<CaregiverRecordsScreen> {
  List<MedicalRecordModel> _records = [];
  bool _isLoading = true;
  String? _errorMessage;
  String _selectedCategory = 'All';

  @override
  void initState() {
    super.initState();
    _loadRecords();
  }

  Future<void> _loadRecords() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final raw = await ApiService.getMedicalRecords();
      final List<MedicalRecordModel> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add(MedicalRecordModel.fromJson(item));
        }
      }
      setState(() {
        _records = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load records: $e';
        _isLoading = false;
      });
    }
  }

  void _openUploadModal() {
    final titleController = TextEditingController();
    String category = 'Lab Results';
    final facilityController = TextEditingController(text: 'Care Clinic');

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
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        '📤 Upload Dependent Record',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                      ),
                      IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: titleController,
                    decoration: const InputDecoration(
                      labelText: 'Document Title (e.g. Annual Blood Panel)',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: category,
                    decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
                    items: const ['Lab Results', 'Prescriptions', 'Scans & Imaging', 'Clinical Summaries', 'Immunization']
                        .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                        .toList(),
                    onChanged: (val) {
                      if (val != null) setModalState(() => category = val);
                    },
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: facilityController,
                    decoration: const InputDecoration(labelText: 'Issuing Clinic or Lab', border: OutlineInputBorder()),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.cloud_upload),
                      label: const Text('Save Record to Vault', style: TextStyle(fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryPurple,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: () async {
                        if (titleController.text.trim().isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Please enter a title.')),
                          );
                          return;
                        }

                        final payload = {
                          'title': titleController.text.trim(),
                          'category': category,
                          'facility': facilityController.text.trim(),
                          'dependent': widget.dependentName,
                          'dependentName': widget.dependentName,
                        };

                        try {
                          await ApiService.uploadMedicalRecord(payload);
                          if (mounted) {
                            Navigator.pop(ctx);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Record uploaded to encrypted vault!'), backgroundColor: AppTheme.secondaryTeal),
                            );
                            _loadRecords();
                          }
                        } catch (e) {
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Error uploading record: $e'), backgroundColor: Colors.red),
                            );
                          }
                        }
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final categories = ['All', 'Lab Results', 'Prescriptions', 'Scans & Imaging', 'Clinical Summaries', 'Immunization'];
    final filtered = _selectedCategory == 'All'
        ? _records
        : _records.where((r) => r.category.toLowerCase() == _selectedCategory.toLowerCase()).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: Text('📁 ${widget.dependentName} Vault'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadRecords),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primaryPurple,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.file_upload_outlined),
        label: const Text('Upload Record'),
        onPressed: _openUploadModal,
      ),
      body: Column(
        children: [
          SizedBox(
            height: 48,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              scrollDirection: Axis.horizontal,
              itemCount: categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, idx) {
                final cat = categories[idx];
                final isSel = _selectedCategory == cat;
                return ChoiceChip(
                  label: Text(cat, style: TextStyle(fontSize: 12, color: isSel ? Colors.white : AppTheme.textDark)),
                  selected: isSel,
                  selectedColor: AppTheme.primaryPurple,
                  onSelected: (sel) {
                    if (sel) setState(() => _selectedCategory = cat);
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
                              ElevatedButton(onPressed: _loadRecords, child: const Text('Retry')),
                            ],
                          ),
                        ),
                      )
                    : filtered.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.folder_open, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                                const SizedBox(height: 16),
                                const Text('No medical records in this category', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                                const SizedBox(height: 6),
                                const Text('Tap "Upload Record" to archive test reports or prescriptions.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadRecords,
                            child: ListView.separated(
                              padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
                              itemCount: filtered.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 12),
                              itemBuilder: (context, index) {
                                final rec = filtered[index];
                                return Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(18),
                                    border: Border.all(color: AppTheme.borderPurple),
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                          color: AppTheme.primaryPurple.withValues(alpha: 0.1),
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: const Icon(Icons.description, color: AppTheme.primaryPurple, size: 22),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(rec.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark)),
                                            Text('${rec.doctorOrLab} • ${rec.date}', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                          ],
                                        ),
                                      ),
                                      IconButton(
                                        icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                                        onPressed: () async {
                                          try {
                                            await ApiService.deleteMedicalRecord(rec.id);
                                            setState(() => _records.removeWhere((r) => r.id == rec.id));
                                          } catch (e) {
                                            if (mounted) {
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(content: Text('Failed to delete: $e'), backgroundColor: Colors.red),
                                              );
                                            }
                                          }
                                        },
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
