import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../services/api_service.dart';

class AdminUsersScreen extends StatefulWidget {
  const AdminUsersScreen({super.key});

  @override
  State<AdminUsersScreen> createState() => _AdminUsersScreenState();
}

class _AdminUsersScreenState extends State<AdminUsersScreen> {
  List<Map<String, dynamic>> _users = [];
  bool _isLoading = true;
  String? _errorMessage;
  String _selectedRole = 'All';
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  Future<void> _loadUsers() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final raw = await ApiService.getAdminUsers();
      final List<Map<String, dynamic>> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add({
            'id': item['id'] is int ? item['id'] : int.tryParse(item['id'].toString()) ?? 0,
            'fullName': item['full_name'] ?? item['fullName'] ?? item['username'] ?? 'User',
            'email': item['email'] ?? '',
            'role': item['role'] ?? 'User (Female)',
            'status': item['status'] ?? 'Active',
            'joinedDate': item['created_at'] != null ? item['created_at'].toString().split('T')[0] : '2026-09-01',
          });
        }
      }
      setState(() {
        _users = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load users: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _toggleUserStatus(int id) async {
    final index = _users.indexWhere((u) => u['id'] == id);
    if (index == -1) return;
    final current = _users[index]['status'];
    final newStatus = current == 'Active' ? 'Suspended' : 'Active';

    try {
      await ApiService.updateUserStatus(id, newStatus);
      setState(() {
        _users[index]['status'] = newStatus;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('User status updated to $newStatus')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update status: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  Future<void> _deleteUser(int id) async {
    try {
      await ApiService.deleteAdminUser(id);
      setState(() => _users.removeWhere((u) => u['id'] == id));
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('User deleted successfully.')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete user: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final roles = ['All', 'User (Female)', 'Doctor', 'Caregiver'];
    final filtered = _users.where((u) {
      final roleStr = u['role'].toString();
      final matchesRole = _selectedRole == 'All' || roleStr.contains(_selectedRole) || (_selectedRole == 'User (Female)' && roleStr == 'Myself');
      final matchesSearch = u['fullName'].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
          u['email'].toString().toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('👥 User Governance & Roles'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadUsers),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search users by name or email...',
                prefixIcon: const Icon(Icons.search, color: Color(0xFF6366F1)),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
              onChanged: (val) => setState(() => _searchQuery = val),
            ),
          ),
          SizedBox(
            height: 48,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              scrollDirection: Axis.horizontal,
              itemCount: roles.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, idx) {
                final r = roles[idx];
                final isSel = _selectedRole == r;
                return ChoiceChip(
                  label: Text(r, style: TextStyle(fontSize: 12, color: isSel ? Colors.white : AppTheme.textDark)),
                  selected: isSel,
                  selectedColor: const Color(0xFF6366F1),
                  onSelected: (sel) {
                    if (sel) setState(() => _selectedRole = r);
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
                              ElevatedButton(onPressed: _loadUsers, child: const Text('Retry')),
                            ],
                          ),
                        ),
                      )
                    : filtered.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.person_off_outlined, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                                const SizedBox(height: 16),
                                const Text('No users match this filter', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                                const SizedBox(height: 6),
                                const Text('Registered user accounts will be listed here.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadUsers,
                            child: ListView.separated(
                              padding: const EdgeInsets.all(16),
                              itemCount: filtered.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 12),
                              itemBuilder: (context, index) {
                                final u = filtered[index];
                                final isActive = u['status'] == 'Active';

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
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Row(
                                            children: [
                                              CircleAvatar(
                                                radius: 18,
                                                backgroundColor: const Color(0xFFEDE9FE),
                                                child: Text(
                                                  u['fullName'].toString().isNotEmpty ? u['fullName'][0].toUpperCase() : 'U',
                                                  style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF6366F1)),
                                                ),
                                              ),
                                              const SizedBox(width: 12),
                                              Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(u['fullName'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark)),
                                                  Text(u['email'], style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                                ],
                                              ),
                                            ],
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: isActive ? const Color(0xFFCCFBF1) : const Color(0xFFFEE2E2),
                                              borderRadius: BorderRadius.circular(10),
                                            ),
                                            child: Text(
                                              u['status'],
                                              style: TextStyle(
                                                color: isActive ? AppTheme.secondaryTeal : Colors.red,
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const Divider(height: 20),
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFFEDE9FE),
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(u['role'], style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF6366F1))),
                                          ),
                                          const Spacer(),
                                          Text('Joined: ${u['joinedDate']}', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                          const SizedBox(width: 8),
                                          TextButton(
                                            onPressed: () => _toggleUserStatus(u['id']),
                                            child: Text(
                                              isActive ? 'Suspend' : 'Activate',
                                              style: TextStyle(color: isActive ? Colors.red : AppTheme.secondaryTeal, fontWeight: FontWeight.bold, fontSize: 12),
                                            ),
                                          ),
                                          IconButton(
                                            icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 18),
                                            onPressed: () => _deleteUser(u['id']),
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
