import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/medical_record_model.dart';
import '../../services/api_service.dart';

class DoctorRecordsScreen extends StatefulWidget {
  const DoctorRecordsScreen({super.key});

  @override
  State<DoctorRecordsScreen> createState() => _DoctorRecordsScreenState();
}

class _DoctorRecordsScreenState extends State<DoctorRecordsScreen> {
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
      final raw = await ApiService.getDoctorSharedRecords();
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

  @override
  Widget build(BuildContext context) {
    final categories = ['All', 'Lab Results', 'Prescriptions', 'Scans & Imaging', 'Clinical Summaries'];
    final filtered = _selectedCategory == 'All'
        ? _records
        : _records.where((r) => r.category.toLowerCase() == _selectedCategory.toLowerCase()).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('📋 Patient Shared Records'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadRecords),
        ],
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
                  selectedColor: AppTheme.secondaryTeal,
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
                                const Text('No records found in this category', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                                const SizedBox(height: 6),
                                const Text('Shared documents from patients will appear here.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadRecords,
                            child: ListView.separated(
                              padding: const EdgeInsets.all(16),
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
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.all(10),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFFCCFBF1),
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: const Icon(Icons.description, color: AppTheme.secondaryTeal, size: 22),
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
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFFF3E8FF),
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: Text(rec.fileSize, style: const TextStyle(fontSize: 11, color: AppTheme.primaryPurple, fontWeight: FontWeight.bold)),
                                          ),
                                        ],
                                      ),
                                      if (rec.summary != null && rec.summary!.isNotEmpty) ...[
                                        const SizedBox(height: 10),
                                        Text(rec.summary!, style: const TextStyle(fontSize: 12, color: AppTheme.textDark)),
                                      ],
                                      const SizedBox(height: 12),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.end,
                                        children: [
                                          TextButton.icon(
                                            icon: const Icon(Icons.picture_as_pdf, size: 16),
                                            label: const Text('Open Diagnostic PDF', style: TextStyle(fontSize: 12)),
                                            onPressed: () {
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(content: Text('Viewing document: ${rec.title}')),
                                              );
                                            },
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
