import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/notification_model.dart';
import '../../services/api_service.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<NotificationModel> _notifications = [];
  bool _isLoading = true;
  String? _errorMessage;
  String _selectedCategory = 'All';

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final raw = await ApiService.getNotifications();
      final List<NotificationModel> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add(NotificationModel.fromJson(item));
        }
      }
      setState(() {
        _notifications = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load notifications: $e';
        _isLoading = false;
      });
    }
  }

  void _markAllAsRead() {
    setState(() {
      _notifications = _notifications.map((n) => n.copyWith(isRead: true)).toList();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('All notifications marked as read!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final categories = ['All', 'Period Alert', 'Medication', 'Appointment', 'AI Health Twin'];
    final filtered = _selectedCategory == 'All'
        ? _notifications
        : _notifications.where((n) => n.category.toLowerCase() == _selectedCategory.toLowerCase()).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('🔔 Notifications'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadNotifications),
          if (_notifications.isNotEmpty)
            TextButton(
              onPressed: _markAllAsRead,
              child: const Text('Mark all read', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
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
                              ElevatedButton(onPressed: _loadNotifications, child: const Text('Retry')),
                            ],
                          ),
                        ),
                      )
                    : filtered.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.notifications_none_outlined, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                                const SizedBox(height: 16),
                                const Text('No new notifications', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                                const SizedBox(height: 6),
                                const Text('Upcoming appointment and cycle alerts will appear here.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadNotifications,
                            child: ListView.separated(
                              padding: const EdgeInsets.all(16),
                              itemCount: filtered.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 12),
                              itemBuilder: (context, index) {
                                final n = filtered[index];
                                return Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: n.isRead ? Colors.white : const Color(0xFFFAF5FF),
                                    borderRadius: BorderRadius.circular(18),
                                    border: Border.all(
                                      color: n.isRead ? AppTheme.borderPurple : AppTheme.primaryPurple.withValues(alpha: 0.3),
                                    ),
                                  ),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                          color: AppTheme.primaryPurple.withValues(alpha: 0.1),
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: const Icon(Icons.notifications, color: AppTheme.primaryPurple, size: 20),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(n.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textDark)),
                                            const SizedBox(height: 4),
                                            Text(n.message, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                                            const SizedBox(height: 6),
                                            Text(n.timestamp, style: const TextStyle(fontSize: 10, color: AppTheme.textMuted)),
                                          ],
                                        ),
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
