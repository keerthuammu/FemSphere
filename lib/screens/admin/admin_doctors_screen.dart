import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../services/api_service.dart';

class AdminDoctorsScreen extends StatefulWidget {
  const AdminDoctorsScreen({super.key});

  @override
  State<AdminDoctorsScreen> createState() => _AdminDoctorsScreenState();
}

class _AdminDoctorsScreenState extends State<AdminDoctorsScreen> {
  List<Map<String, dynamic>> _doctors = [];
  bool _isLoading = true;
  String? _errorMessage;
  String _selectedStatus = 'All';

  @override
  void initState() {
    super.initState();
    _loadDoctors();
  }

  Future<void> _loadDoctors() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final raw = await ApiService.getDoctors();
      final List<Map<String, dynamic>> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add({
            'id': item['id'] is int ? item['id'] : int.tryParse(item['id'].toString()) ?? 0,
            'fullName': item['full_name'] ?? item['fullName'] ?? item['username'] ?? 'Doctor',
            'email': item['email'] ?? '',
            'specialty': item['specialization'] ?? 'Obstetrics & Gynecology',
            'license': item['license_number'] ?? 'MD-PENDING',
            'hospital': item['hospital_clinic'] ?? 'FemSphere Health Network',
            'approvalStatus': item['approval_status'] ?? 'Approved',
            'submittedDate': item['created_at'] != null ? item['created_at'].toString().split('T')[0] : '2026-09-01',
          });
        }
      }
      setState(() {
        _doctors = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load doctors: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _updateDoctorStatus(int id, String status) async {
    try {
      await ApiService.approveDoctor(id);
      setState(() {
        final index = _doctors.indexWhere((d) => d['id'] == id);
        if (index != -1) {
          _doctors[index]['approvalStatus'] = status;
        }
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Physician license status updated to: $status!'),
            backgroundColor: status == 'Approved' ? AppTheme.secondaryTeal : Colors.red,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error approving doctor: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedStatus == 'All'
        ? _doctors
        : _doctors.where((d) => d['approvalStatus'] == _selectedStatus).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('🩺 Physician Credentials Verification'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadDoctors),
        ],
      ),
      body: Column(
        children: [
          SizedBox(
            height: 48,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              scrollDirection: Axis.horizontal,
              itemCount: 3,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, idx) {
                final statuses = ['All', 'Pending', 'Approved'];
                final s = statuses[idx];
                final isSel = _selectedStatus == s;
                return ChoiceChip(
                  label: Text(s, style: TextStyle(fontSize: 12, color: isSel ? Colors.white : AppTheme.textDark)),
                  selected: isSel,
                  selectedColor: const Color(0xFF6366F1),
                  onSelected: (sel) {
                    if (sel) setState(() => _selectedStatus = s);
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
                              ElevatedButton(onPressed: _loadDoctors, child: const Text('Retry')),
                            ],
                          ),
                        ),
                      )
                    : filtered.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.medical_information_outlined, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                                const SizedBox(height: 16),
                                const Text('No doctors match this filter', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                                const SizedBox(height: 6),
                                const Text('Registered doctor accounts will be displayed here.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadDoctors,
                            child: ListView.separated(
                              padding: const EdgeInsets.all(16),
                              itemCount: filtered.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 14),
                              itemBuilder: (context, index) {
                                final doc = filtered[index];
                                final isPending = doc['approvalStatus'] == 'Pending';

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
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(doc['fullName'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                                                const SizedBox(height: 2),
                                                Text(doc['specialty'], style: const TextStyle(fontSize: 12, color: Color(0xFF6366F1), fontWeight: FontWeight.w600)),
                                              ],
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                            decoration: BoxDecoration(
                                              color: isPending ? const Color(0xFFFEF3C7) : const Color(0xFFCCFBF1),
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              doc['approvalStatus'],
                                              style: TextStyle(
                                                color: isPending ? Colors.amber.shade900 : AppTheme.secondaryTeal,
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const Divider(height: 20),
                                      Text('Hospital: ${doc['hospital']}', style: const TextStyle(fontSize: 12, color: AppTheme.textDark)),
                                      const SizedBox(height: 4),
                                      Text('Medical License: ${doc['license']}', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                      if (isPending) ...[
                                        const SizedBox(height: 14),
                                        Row(
                                          children: [
                                            Expanded(
                                              child: ElevatedButton(
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: AppTheme.secondaryTeal,
                                                  foregroundColor: Colors.white,
                                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                                ),
                                                onPressed: () => _updateDoctorStatus(doc['id'], 'Approved'),
                                                child: const Text('Approve License', style: TextStyle(fontWeight: FontWeight.bold)),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
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
