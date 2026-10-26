import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/local_sync_queue.dart';
import '../services/wearable_sync_service.dart';

/// Screen displaying the audit log of all wearable synchronizations
/// with records uploaded, sync status, and offline queue status.
class WearableSyncHistoryScreen extends StatefulWidget {
  const WearableSyncHistoryScreen({super.key});

  @override
  State<WearableSyncHistoryScreen> createState() => _WearableSyncHistoryScreenState();
}

class _WearableSyncHistoryScreenState extends State<WearableSyncHistoryScreen> {
  final WearableSyncService _syncService = WearableSyncService();
  final LocalSyncQueue _queue = LocalSyncQueue();

  List<Map<String, dynamic>> _history = [];
  int _pendingBatches = 0;
  bool _isLoading = true;
  bool _isFlushing = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final history = await _syncService.getSyncHistory(limit: 30);
    final pending = await _queue.getPendingBatchCount();
    if (mounted) {
      setState(() {
        _history = history;
        _pendingBatches = pending;
        _isLoading = false;
      });
    }
  }

  Future<void> _flushPendingQueue() async {
    setState(() => _isFlushing = true);
    final flushedCount = await _queue.flushQueue();
    await _loadData();
    if (mounted) {
      setState(() => _isFlushing = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            flushedCount > 0
                ? 'Flushed $flushedCount pending records to cloud!'
                : 'No pending records could be flushed.',
          ),
          backgroundColor: flushedCount > 0 ? Colors.green : Colors.grey.shade800,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Wearable Sync History'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Offline Queue Banner
                  if (_pendingBatches > 0)
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.amber.shade50,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.amber.shade300),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.cloud_off_outlined, color: Colors.amber.shade800),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '$_pendingBatches Offline Batches Queued',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.amber.shade900,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Awaiting automatic flush or click below.',
                                  style: TextStyle(fontSize: 12, color: Colors.amber.shade800),
                                ),
                              ],
                            ),
                          ),
                          ElevatedButton(
                            onPressed: _isFlushing ? null : _flushPendingQueue,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.amber.shade700,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            child: _isFlushing
                                ? const SizedBox(
                                    width: 16,
                                    height: 16,
                                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                  )
                                : const Text('Flush Now', style: TextStyle(fontSize: 12)),
                          ),
                        ],
                      ),
                    ),

                  const Text(
                    'Cloud Synchronization Log',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),

                  if (_history.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(32),
                      alignment: Alignment.center,
                      child: Column(
                        children: [
                          Icon(Icons.history, size: 48, color: Colors.grey.shade400),
                          const SizedBox(height: 12),
                          const Text(
                            'No synchronization jobs recorded yet.',
                            style: TextStyle(color: Colors.grey),
                          ),
                        ],
                      ),
                    )
                  else
                    ..._history.map(_buildHistoryCard),
                ],
              ),
            ),
    );
  }

  Widget _buildHistoryCard(Map<String, dynamic> item) {
    final status = (item['sync_status'] ?? 'UNKNOWN').toString().toUpperCase();
    final isSuccess = status == 'SUCCESS';
    final isPartial = status == 'PARTIAL';
    final provider = item['provider'] ?? 'WEARABLE';
    final deviceModel = item['device_model'] ?? item['device_name'] ?? 'Smartwatch';
    final recordsUploaded = item['records_uploaded'] ?? 0;
    final recordsFailed = item['records_failed'] ?? 0;

    String dateStr = 'Unknown Time';
    if (item['started_at'] != null) {
      try {
        final dt = DateTime.parse(item['started_at']).toLocal();
        dateStr = DateFormat('MMM d, y • h:mm a').format(dt);
      } catch (_) {}
    }

    final Color statusColor = isSuccess
        ? Colors.green
        : isPartial
            ? Colors.orange
            : Colors.red;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  status,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: statusColor,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  provider,
                  style: TextStyle(fontSize: 11, color: Colors.grey.shade700, fontWeight: FontWeight.w600),
                ),
              ),
              const Spacer(),
              Text(
                dateStr,
                style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              const Icon(Icons.watch_outlined, size: 16, color: Colors.grey),
              const SizedBox(width: 6),
              Text(
                deviceModel,
                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Text(
                '✅ $recordsUploaded records synced',
                style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
              ),
              if (recordsFailed > 0) ...[
                const SizedBox(width: 12),
                Text(
                  '⚠️ $recordsFailed failed',
                  style: const TextStyle(fontSize: 12, color: Colors.red),
                ),
              ],
            ],
          ),
          if (item['error_message'] != null && item['error_message'].toString().isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              'Error: ${item['error_message']}',
              style: const TextStyle(fontSize: 11, color: Colors.red),
            ),
          ],
        ],
      ),
    );
  }
}
