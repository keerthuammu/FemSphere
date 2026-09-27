import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../data/models/smartwatch_device_model.dart';

class DeviceStatusCard extends StatelessWidget {
  final SmartwatchDeviceModel? device;
  final SmartwatchConnectionStatus status;
  final int? batteryLevel;
  final DateTime? lastSyncTime;
  final VoidCallback onScanTap;
  final VoidCallback? onDisconnectTap;

  const DeviceStatusCard({
    super.key,
    required this.device,
    required this.status,
    this.batteryLevel,
    this.lastSyncTime,
    required this.onScanTap,
    this.onDisconnectTap,
  });

  String _formatTime(DateTime? dt) {
    if (dt == null) return 'Never';
    final hour = dt.hour > 12 ? dt.hour - 12 : (dt.hour == 0 ? 12 : dt.hour);
    final period = dt.hour >= 12 ? 'PM' : 'AM';
    final minute = dt.minute.toString().padLeft(2, '0');
    return '$hour:$minute $period';
  }

  Color _getStatusColor() {
    switch (status) {
      case SmartwatchConnectionStatus.connected:
      case SmartwatchConnectionStatus.synced:
        return AppColors.success;
      case SmartwatchConnectionStatus.connecting:
      case SmartwatchConnectionStatus.syncing:
        return AppColors.primary;
      case SmartwatchConnectionStatus.error:
        return AppColors.error;
      case SmartwatchConnectionStatus.unsupported:
        return AppColors.warning;
      case SmartwatchConnectionStatus.notConnected:
      case SmartwatchConnectionStatus.disconnected:
        return AppColors.textMuted;
    }
  }

  String _getStatusText() {
    switch (status) {
      case SmartwatchConnectionStatus.connected:
        return '🟢 Connected';
      case SmartwatchConnectionStatus.synced:
        return '✓ Synced';
      case SmartwatchConnectionStatus.connecting:
        return '🔄 Connecting...';
      case SmartwatchConnectionStatus.syncing:
        return '🔄 Syncing...';
      case SmartwatchConnectionStatus.error:
        return '⚠ Error';
      case SmartwatchConnectionStatus.unsupported:
        return '⚠ Unsupported';
      case SmartwatchConnectionStatus.disconnected:
        return '🔴 Disconnected';
      case SmartwatchConnectionStatus.notConnected:
        return '⚪ Not Connected';
    }
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor();
    final hasDevice = device != null && device!.deviceIdentifier.isNotEmpty;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.watch_outlined,
                    color: AppColors.primary,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        device?.deviceName ?? (hasDevice ? 'Connected Smartwatch' : 'Connect Your Smartwatch'),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: statusColor.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              _getStatusText(),
                              style: TextStyle(
                                color: statusColor,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          if (batteryLevel != null) ...[
                            const SizedBox(width: 8),
                            Icon(Icons.battery_5_bar, size: 16, color: Colors.green.shade700),
                            Text(
                              '$batteryLevel%',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Colors.green.shade800,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(color: AppColors.borderLight, height: 1),
            const SizedBox(height: 14),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Last Sync',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      _formatTime(lastSyncTime ?? device?.lastSyncedAt),
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    if (hasDevice && onDisconnectTap != null) ...[
                      TextButton(
                        onPressed: onDisconnectTap,
                        style: TextButton.styleFrom(
                          foregroundColor: AppColors.error,
                        ),
                        child: const Text('Disconnect'),
                      ),
                      const SizedBox(width: 8),
                    ],
                    OutlinedButton.icon(
                      onPressed: onScanTap,
                      icon: const Icon(Icons.bluetooth_searching, size: 16),
                      label: Text(hasDevice ? 'Change' : 'Pair Watch'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
