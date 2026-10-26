import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'wearable_sync_service.dart';

/// Offline-first resilient queue for wearable health telemetry synchronization.
/// Prevents data loss during network dropouts by buffering locally in persistent storage.
class LocalSyncQueue {
  static const String _queueKey = 'femsphere_wearable_sync_queue_v1';
  final WearableSyncService _syncService;

  LocalSyncQueue({WearableSyncService? syncService})
      : _syncService = syncService ?? WearableSyncService();

  /// Enqueue an array of normalized health records for synchronization
  Future<void> enqueueBatch({
    required String provider,
    required String brand,
    required String deviceModel,
    required String deviceName,
    required String deviceIdentifier,
    required List<Map<String, dynamic>> records,
    int? batteryLevel,
    Map<String, dynamic>? capabilities,
  }) async {
    if (records.isEmpty) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      final existingRaw = prefs.getStringList(_queueKey) ?? [];

      final batchItem = {
        'id': 'batch_${DateTime.now().millisecondsSinceEpoch}',
        'provider': provider,
        'brand': brand,
        'device_model': deviceModel,
        'device_name': deviceName,
        'device_identifier': deviceIdentifier,
        'battery_level': batteryLevel,
        'capabilities': capabilities ?? {},
        'records': records,
        'created_at': DateTime.now().toIso8601String(),
        'attempts': 0,
      };

      existingRaw.add(jsonEncode(batchItem));
      await prefs.setStringList(_queueKey, existingRaw);
      debugPrint('📦 Enqueued ${records.length} records into LocalSyncQueue. Queue depth: ${existingRaw.length}');
    } catch (e) {
      debugPrint('Error enqueuing batch: $e');
    }
  }

  /// Returns total number of batches currently awaiting flush
  Future<int> getPendingBatchCount() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final existingRaw = prefs.getStringList(_queueKey) ?? [];
      return existingRaw.length;
    } catch (_) {
      return 0;
    }
  }

  /// Attempt to flush all queued batches to the FemSphere backend.
  /// Successfully ingested batches are evicted; failed ones remain with incremented attempts.
  Future<int> flushQueue() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final existingRaw = prefs.getStringList(_queueKey) ?? [];
      if (existingRaw.isEmpty) return 0;

      final remaining = <String>[];
      int flushedCount = 0;

      for (final raw in existingRaw) {
        try {
          final item = jsonDecode(raw) as Map<String, dynamic>;
          final records = List<Map<String, dynamic>>.from(item['records'] ?? []);

          final res = await _syncService.syncBatchRecords(
            provider: item['provider'] ?? 'HEALTH_CONNECT',
            brand: item['brand'] ?? 'AMAZFIT',
            deviceModel: item['device_model'] ?? 'Unknown Model',
            deviceName: item['device_name'] ?? 'Smartwatch',
            deviceIdentifier: item['device_identifier'] ?? 'DEFAULT_DEVICE',
            batteryLevel: item['battery_level'],
            capabilities: item['capabilities'],
            records: records,
          );

          if (res != null && res['success'] == true) {
            flushedCount += records.length;
            debugPrint('✅ Flushed batch ${item['id']} (${records.length} records)');
          } else {
            // Keep in queue and increment attempts
            item['attempts'] = ((item['attempts'] as int?) ?? 0) + 1;
            remaining.add(jsonEncode(item));
          }
        } catch (itemErr) {
          debugPrint('Error flushing queue batch item: $itemErr');
          remaining.add(raw);
        }
      }

      await prefs.setStringList(_queueKey, remaining);
      return flushedCount;
    } catch (e) {
      debugPrint('Error flushing sync queue: $e');
      return 0;
    }
  }

  /// Clear the local queue (e.g., on logout or reset)
  Future<void> clearQueue() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_queueKey);
  }
}
