import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../services/api_service.dart';

class AdminCaregiversScreen extends StatefulWidget {
  const AdminCaregiversScreen({super.key});

  @override
  State<AdminCaregiversScreen> createState() => _AdminCaregiversScreenState();
}

class _AdminCaregiversScreenState extends State<AdminCaregiversScreen> {
  List<Map<String, dynamic>> _caregivers = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadCaregivers();
  }

  Future<void> _loadCaregivers() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final raw = await ApiService.getAdminCaregivers();
      final List<Map<String, dynamic>> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add({
            'id': item['id'] is int ? item['id'] : int.tryParse(item['id'].toString()) ?? 0,
            'fullName': item['full_name'] ?? item['fullName'] ?? item['username'] ?? 'Caregiver',
            'email': item['email'] ?? '',
            'dependentsCount': item['dependents_count'] ?? (item['dependents'] is List ? (item['dependents'] as List).length : 0),
            'relationship': item['caregiver_type'] ?? item['relationship'] ?? 'Family Caregiver',
          });
        }
      }
      setState(() {
        _caregivers = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load caregivers: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('👨‍👩‍👧 Caregiver & Family Networks'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadCaregivers),
        ],
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
                        ElevatedButton(onPressed: _loadCaregivers, child: const Text('Retry')),
                      ],
                    ),
                  ),
                )
              : _caregivers.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.family_restroom_outlined, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                          const SizedBox(height: 16),
                          const Text('No caregivers registered yet', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                          const SizedBox(height: 6),
                          const Text('Registered caregiver accounts will appear here.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadCaregivers,
                      child: ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: _caregivers.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 14),
                        itemBuilder: (context, index) {
                          final cg = _caregivers[index];
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
                                    Row(
                                      children: [
                                        const CircleAvatar(
                                          radius: 18,
                                          backgroundColor: Color(0xFFFCE7F3),
                                          child: Icon(Icons.family_restroom, color: Color(0xFFEC4899), size: 18),
                                        ),
                                        const SizedBox(width: 12),
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(cg['fullName'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textDark)),
                                            Text(cg['email'] as String, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                          ],
                                        ),
                                      ],
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFCCFBF1),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: const Text('Verified Caregiver', style: TextStyle(color: AppTheme.secondaryTeal, fontSize: 11, fontWeight: FontWeight.bold)),
                                    ),
                                  ],
                                ),
                                const Divider(height: 20),
                                Row(
                                  children: [
                                    Text('Role: ${cg['relationship']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.textDark)),
                                    const Spacer(),
                                    Text('Linked Dependents: ${cg['dependentsCount']}', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
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
