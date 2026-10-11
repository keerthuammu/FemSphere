import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import '../../core/app_theme.dart';
import '../../models/medical_record_model.dart';
import '../../services/api_service.dart';

class MedicalRecordsScreen extends StatefulWidget {
  const MedicalRecordsScreen({super.key});

  @override
  State<MedicalRecordsScreen> createState() => _MedicalRecordsScreenState();
}

class _MedicalRecordsScreenState extends State<MedicalRecordsScreen> {
  List<MedicalRecordModel> _records = [];
  bool _isLoading = true;
  String? _errorMessage;
  String _selectedCategory = 'All';
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

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
    _loadRecords();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
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
      if (mounted) {
        setState(() {
          _records = list;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to load records: $e';
          _isLoading = false;
        });
      }
    }
  }

  List<MedicalRecordModel> get _filteredRecords {
    return _records.where((record) {
      final matchesCategory = _selectedCategory == 'All' || record.category == _selectedCategory;
      final matchesSearch = _searchQuery.isEmpty ||
          record.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          record.doctorOrLab.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (record.summary?.toLowerCase().contains(_searchQuery.toLowerCase()) ?? false);
      return matchesCategory && matchesSearch;
    }).toList();
  }

  Future<void> _pickAndUploadDocument() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg'],
        withData: true,
      );

      if (result != null && result.files.isNotEmpty) {
        final file = result.files.first;
        if (!mounted) return;
        _showUploadConfirmDialog(
          fileName: file.name,
          filePath: file.path,
          fileBytes: file.bytes,
        );
      }
    } catch (_) {
      // Fallback: Show manual metadata input dialog
      if (mounted) {
        _showManualUploadDialog();
      }
    }
  }

  void _showUploadConfirmDialog({
    required String fileName,
    String? filePath,
    List<int>? fileBytes,
  }) {
    final titleController = TextEditingController(text: fileName.replaceAll(RegExp(r'\.[^/.]+$'), ''));
    String chosenCategory = 'Lab Results';
    final descController = TextEditingController();
    bool isUploading = false;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          return AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: const Row(
              children: [
                Icon(Icons.upload_file, color: AppTheme.primaryPurple),
                SizedBox(width: 8),
                Text('Upload to Health Vault', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Selected File: $fileName', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                  const SizedBox(height: 16),
                  TextField(
                    controller: titleController,
                    decoration: const InputDecoration(
                      labelText: 'Report Title',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.title),
                    ),
                  ),
                  const SizedBox(height: 14),
                  DropdownButtonFormField<String>(
                    value: chosenCategory,
                    decoration: const InputDecoration(
                      labelText: 'Category',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.category),
                    ),
                    items: ['Lab Results', 'Prescriptions', 'Scans & Imaging', 'Clinical Summaries']
                        .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                        .toList(),
                    onChanged: (val) {
                      if (val != null) setDialogState(() => chosenCategory = val);
                    },
                  ),
                  const SizedBox(height: 14),
                  TextField(
                    controller: descController,
                    maxLines: 2,
                    decoration: const InputDecoration(
                      labelText: 'Notes / Description (Optional)',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.notes),
                    ),
                  ),
                  if (isUploading) ...[
                    const SizedBox(height: 20),
                    const Center(child: CircularProgressIndicator()),
                  ],
                ],
              ),
            ),
            actions: [
              TextButton(
                onPressed: isUploading ? null : () => Navigator.pop(ctx),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: isUploading
                    ? null
                    : () async {
                        setDialogState(() => isUploading = true);
                        try {
                          await ApiService.uploadMedicalRecordMultipart(
                            title: titleController.text.trim().isEmpty ? fileName : titleController.text.trim(),
                            category: chosenCategory,
                            description: descController.text.trim(),
                            filePath: filePath,
                            fileBytes: fileBytes,
                            fileName: fileName,
                          );
                          if (ctx.mounted) Navigator.pop(ctx);
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Document successfully uploaded and scanned with Gemini OCR!'),
                                backgroundColor: Color(0xFF10B981),
                              ),
                            );
                            _loadRecords();
                          }
                        } catch (e) {
                          setDialogState(() => isUploading = false);
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Upload failed: $e')),
                            );
                          }
                        }
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryPurple,
                  foregroundColor: Colors.white,
                ),
                child: const Text('Upload & Scan'),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showManualUploadDialog() {
    final titleController = TextEditingController(text: 'Metabolic Comprehensive Panel');
    String chosenCategory = 'Lab Results';
    final descController = TextEditingController(text: 'Routine annual preventive health diagnostics');
    bool isUploading = false;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          return AlertDialog(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: const Text('New Medical Record', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: titleController,
                    decoration: const InputDecoration(labelText: 'Title', border: OutlineInputBorder()),
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: chosenCategory,
                    decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
                    items: ['Lab Results', 'Prescriptions', 'Scans & Imaging', 'Clinical Summaries']
                        .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                        .toList(),
                    onChanged: (val) {
                      if (val != null) setDialogState(() => chosenCategory = val);
                    },
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: descController,
                    decoration: const InputDecoration(labelText: 'Description', border: OutlineInputBorder()),
                  ),
                  if (isUploading) ...[
                    const SizedBox(height: 16),
                    const Center(child: CircularProgressIndicator()),
                  ],
                ],
              ),
            ),
            actions: [
              TextButton(onPressed: isUploading ? null : () => Navigator.pop(ctx), child: const Text('Cancel')),
              ElevatedButton(
                onPressed: isUploading
                    ? null
                    : () async {
                        setDialogState(() => isUploading = true);
                        try {
                          await ApiService.uploadMedicalRecord({
                            'title': titleController.text.trim(),
                            'category': chosenCategory,
                            'description': descController.text.trim(),
                            'file_name': '${titleController.text.trim().replaceAll(' ', '_')}.pdf',
                            'file_type': 'PDF',
                          });
                          if (ctx.mounted) Navigator.pop(ctx);
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Medical record saved and biomarkers processed!'),
                                backgroundColor: Color(0xFF10B981),
                              ),
                            );
                            _loadRecords();
                          }
                        } catch (e) {
                          setDialogState(() => isUploading = false);
                        }
                      },
                child: const Text('Save Record'),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showRecordDetailsModal(MedicalRecordModel record) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        final scan = record.scanResults;
        final biomarkers = (scan != null && scan['keyBiomarkers'] is List)
            ? scan['keyBiomarkers'] as List
            : <dynamic>[];

        return Container(
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 48,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryPurple.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Icon(
                      record.fileType == 'PDF' ? Icons.picture_as_pdf : Icons.image,
                      color: AppTheme.primaryPurple,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          record.title,
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${record.category} • ${record.date} • ${record.fileSize}',
                          style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, color: Colors.red),
                    onPressed: () async {
                      final confirmed = await showDialog<bool>(
                        context: context,
                        builder: (dCtx) => AlertDialog(
                          title: const Text('Delete Record'),
                          content: const Text('Are you sure you want to remove this medical document?'),
                          actions: [
                            TextButton(onPressed: () => Navigator.pop(dCtx, false), child: const Text('Cancel')),
                            ElevatedButton(
                              onPressed: () => Navigator.pop(dCtx, true),
                              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                              child: const Text('Delete'),
                            ),
                          ],
                        ),
                      );

                      if (confirmed == true) {
                        try {
                          await ApiService.deleteMedicalRecord(record.id);
                          if (ctx.mounted) Navigator.pop(ctx);
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Record removed')),
                            );
                            _loadRecords();
                          }
                        } catch (_) {}
                      }
                    },
                  ),
                ],
              ),
              const Divider(height: 28),
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Clinician & Lab Origin
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF9FAFB),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.local_hospital_outlined, color: AppTheme.secondaryTeal, size: 22),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                scan?['doctorName'] ?? record.doctorOrLab,
                                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFF10B981).withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                scan?['riskLevel'] ?? 'Verified',
                                style: const TextStyle(color: Color(0xFF047857), fontWeight: FontWeight.bold, fontSize: 11),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 18),

                      // AI Clinical Summary
                      if (scan?['aiSummary'] != null || record.summary != null) ...[
                        const Text('🤖 AI Twin Clinical Summary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                AppTheme.primaryPurple.withValues(alpha: 0.08),
                                const Color(0xFFEC4899).withValues(alpha: 0.05),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppTheme.borderPurple),
                          ),
                          child: Text(
                            scan?['aiSummary'] ?? record.summary!,
                            style: const TextStyle(fontSize: 13, color: AppTheme.textDark, height: 1.4),
                          ),
                        ),
                        const SizedBox(height: 18),
                      ],

                      // Extracted Key Biomarkers
                      const Text('🔬 Extracted Biomarkers', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      const SizedBox(height: 8),
                      if (biomarkers.isEmpty)
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF9FAFB),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Text('No structured lab parameters found in this document.', style: TextStyle(color: AppTheme.textMuted)),
                        )
                      else
                        ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: biomarkers.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 8),
                          itemBuilder: (context, idx) {
                            final b = biomarkers[idx];
                            final status = (b['status'] ?? 'Normal').toString();
                            final isOptimal = status.toLowerCase() == 'optimal' || status.toLowerCase() == 'normal';
                            return Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.grey.shade200),
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(b['name'] ?? 'Parameter', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                                        if (b['range'] != null)
                                          Text('Ref: ${b['range']}', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                      ],
                                    ),
                                  ),
                                  Text(
                                    b['value'] ?? '',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark),
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: isOptimal ? const Color(0xFFDEF7EC) : const Color(0xFFFDE8E8),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      status,
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: isOptimal ? const Color(0xFF03543F) : const Color(0xFF9B1C1C),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),

                      if (scan?['recommendations'] != null) ...[
                        const SizedBox(height: 18),
                        const Text('💡 Clinical Next Steps', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: const Color(0xFFBFDBFE)),
                          ),
                          child: Text(
                            scan!['recommendations'].toString(),
                            style: const TextStyle(fontSize: 12, color: Color(0xFF1E40AF)),
                          ),
                        ),
                      ],
                    ],
                  ),
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
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('📁 Encrypted Health Vault'),
        backgroundColor: Colors.white,
        elevation: 0.5,
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline, color: AppTheme.primaryPurple),
            tooltip: 'Upload Document',
            onPressed: _pickAndUploadDocument,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _pickAndUploadDocument,
        backgroundColor: AppTheme.primaryPurple,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.upload_file),
        label: const Text('Upload Document'),
      ),
      body: RefreshIndicator(
        onRefresh: _loadRecords,
        child: Column(
          children: [
            // Search Bar & Stats Header
            Container(
              color: Colors.white,
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
              child: Column(
                children: [
                  TextField(
                    controller: _searchController,
                    onChanged: (val) => setState(() => _searchQuery = val),
                    decoration: InputDecoration(
                      hintText: 'Search lab panels, doctors, biomarkers...',
                      hintStyle: const TextStyle(fontSize: 13, color: AppTheme.textMuted),
                      prefixIcon: const Icon(Icons.search, size: 20),
                      suffixIcon: _searchQuery.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, size: 18),
                              onPressed: () {
                                _searchController.clear();
                                setState(() => _searchQuery = '');
                              },
                            )
                          : null,
                      filled: true,
                      fillColor: const Color(0xFFF3F4F6),
                      contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 36,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: _categories.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (context, idx) {
                        final cat = _categories[idx];
                        final isSelected = _selectedCategory == cat;
                        return ChoiceChip(
                          label: Text(cat),
                          selected: isSelected,
                          onSelected: (selected) {
                            if (selected) setState(() => _selectedCategory = cat);
                          },
                          selectedColor: AppTheme.primaryPurple,
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : AppTheme.textDark,
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                          backgroundColor: const Color(0xFFF3F4F6),
                          side: BorderSide.none,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),

            // Content List
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _errorMessage != null
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
                              const SizedBox(height: 12),
                              ElevatedButton(onPressed: _loadRecords, child: const Text('Retry')),
                            ],
                          ),
                        )
                      : _filteredRecords.isEmpty
                          ? Center(
                              child: SingleChildScrollView(
                                physics: const AlwaysScrollableScrollPhysics(),
                                child: Padding(
                                  padding: const EdgeInsets.all(32),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(Icons.folder_open, size: 64, color: Colors.grey.shade400),
                                      const SizedBox(height: 16),
                                      const Text(
                                        'No Medical Records Found',
                                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                                      ),
                                      const SizedBox(height: 6),
                                      const Text(
                                        'Upload diagnostic reports, prescriptions, or imaging scans to track biomarkers with AI.',
                                        textAlign: TextAlign.center,
                                        style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                                      ),
                                      const SizedBox(height: 16),
                                      ElevatedButton.icon(
                                        onPressed: _pickAndUploadDocument,
                                        icon: const Icon(Icons.upload_file),
                                        label: const Text('Upload First Report'),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: AppTheme.primaryPurple,
                                          foregroundColor: Colors.white,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            )
                          : ListView.separated(
                              padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                              itemCount: _filteredRecords.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 12),
                              itemBuilder: (context, idx) {
                                final record = _filteredRecords[idx];
                                return GestureDetector(
                                  onTap: () => _showRecordDetailsModal(record),
                                  child: Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(color: AppTheme.borderPurple),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withValues(alpha: 0.02),
                                          blurRadius: 8,
                                          offset: const Offset(0, 2),
                                        ),
                                      ],
                                    ),
                                    child: Row(
                                      children: [
                                        Container(
                                          width: 48,
                                          height: 48,
                                          decoration: BoxDecoration(
                                            color: AppTheme.primaryPurple.withValues(alpha: 0.1),
                                            borderRadius: BorderRadius.circular(14),
                                          ),
                                          child: Icon(
                                            record.fileType == 'PDF' ? Icons.picture_as_pdf : Icons.image,
                                            color: AppTheme.primaryPurple,
                                          ),
                                        ),
                                        const SizedBox(width: 14),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Row(
                                                children: [
                                                  Expanded(
                                                    child: Text(
                                                      record.title,
                                                      maxLines: 1,
                                                      overflow: TextOverflow.ellipsis,
                                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark),
                                                    ),
                                                  ),
                                                  if (record.scanResults != null)
                                                    Container(
                                                      margin: const EdgeInsets.only(left: 6),
                                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                      decoration: BoxDecoration(
                                                        color: const Color(0xFF10B981).withValues(alpha: 0.15),
                                                        borderRadius: BorderRadius.circular(6),
                                                      ),
                                                      child: const Text('AI Scanned', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF047857))),
                                                    ),
                                                ],
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                '${record.category} • ${record.doctorOrLab}',
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                                style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                                              ),
                                              const SizedBox(height: 2),
                                              Text(
                                                '${record.date} • ${record.fileSize}',
                                                style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                                              ),
                                            ],
                                          ),
                                        ),
                                        const Icon(Icons.chevron_right, color: AppTheme.textMuted),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
            ),
          ],
        ),
      ),
    );
  }
}
