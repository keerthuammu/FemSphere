import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../services/smartwatch_service.dart';
import '../widgets/device_status_card.dart';
import '../widgets/health_value_card.dart';
import '../widgets/sync_button.dart';

final smartwatchServiceProvider = ChangeNotifierProvider<SmartwatchService>((ref) {
  final service = SmartwatchService();
  service.initFromBackend();
  return service;
});

class SmartwatchScreen extends ConsumerStatefulWidget {
  const SmartwatchScreen({super.key});

  @override
  ConsumerState<SmartwatchScreen> createState() => _SmartwatchScreenState();
}

class _SmartwatchScreenState extends ConsumerState<SmartwatchScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(smartwatchServiceProvider).initFromBackend();
    });
  }

  Future<void> _handleSync() async {
    final service = ref.read(smartwatchServiceProvider);
    final success = await service.readAndSyncVitals();
    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✓ Smartwatch vitals synchronized to FemSphere.'),
          backgroundColor: AppColors.success,
          behavior: SnackBarBehavior.floating,
        ),
      );
    } else if (service.errorMessage != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(service.errorMessage!),
          backgroundColor: AppColors.error,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final service = ref.watch(smartwatchServiceProvider);
    final device = service.currentDevice;
    final healthData = service.latestHealthData;
    final liveHr = service.liveHeartRate;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Smartwatch'),
        actions: [
          IconButton(
            tooltip: 'Telemetry History',
            icon: const Icon(Icons.history),
            onPressed: () => context.push('/smartwatch/history'),
          ),
          IconButton(
            tooltip: 'Pair Device',
            icon: const Icon(Icons.bluetooth_searching),
            onPressed: () => context.push('/smartwatch/scan'),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await service.initFromBackend();
        },
        color: AppColors.primary,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Device Card
              DeviceStatusCard(
                device: device,
                status: service.status,
                batteryLevel: service.batteryLevel,
                lastSyncTime: device?.lastSyncedAt ?? healthData?.recordedAt,
                onScanTap: () => context.push('/smartwatch/scan'),
                onDisconnectTap: service.isConnected ? () => service.disconnect() : null,
              ),

              const SizedBox(height: 16),

              // 2. Sync Now Button
              SyncButton(
                isSyncing: service.isSyncing,
                onSync: _handleSync,
              ),

              const SizedBox(height: 24),

              // 3. Today's Health Section Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Today's Health",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.primaryLight,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Source: ${device?.deviceName ?? 'SMARTWATCH_BLE'}',
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // 4. Biometric Health Value Cards Grid
              GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                childAspectRatio: 1.25,
                children: [
                  // Heart Rate
                  HealthValueCard(
                    icon: Icons.favorite,
                    iconColor: AppColors.heartRate,
                    title: 'Heart Rate',
                    value: liveHr != null
                        ? '$liveHr'
                        : (healthData?.heartRate != null ? '${healthData!.heartRate}' : null),
                    unit: 'BPM',
                    subtitle: liveHr != null ? 'Live BLE Stream' : 'Standard 0x180D GATT',
                    isAvailable: liveHr != null || healthData?.heartRate != null,
                  ),

                  // Steps
                  HealthValueCard(
                    icon: Icons.directions_walk,
                    iconColor: AppColors.steps,
                    title: 'Steps',
                    value: healthData?.steps != null ? '${healthData!.steps}' : null,
                    unit: 'steps',
                    subtitle: 'Huami Accelerometer',
                    isAvailable: healthData?.steps != null,
                  ),

                  // Calories
                  HealthValueCard(
                    icon: Icons.local_fire_department,
                    iconColor: AppColors.weight,
                    title: 'Calories',
                    value: healthData?.calories != null ? '${healthData!.calories}' : null,
                    unit: 'kcal',
                    subtitle: 'Active Energy',
                    isAvailable: healthData?.calories != null,
                  ),

                  // Sleep
                  HealthValueCard(
                    icon: Icons.bedtime,
                    iconColor: AppColors.sleep,
                    title: 'Sleep',
                    value: healthData?.sleepDurationMinutes != null
                        ? (healthData!.sleepDurationMinutes! / 60.0).toStringAsFixed(1)
                        : null,
                    unit: 'hrs',
                    subtitle: 'Sleep Analysis',
                    isAvailable: healthData?.sleepDurationMinutes != null,
                  ),

                  // Distance
                  HealthValueCard(
                    icon: Icons.straighten,
                    iconColor: AppColors.water,
                    title: 'Distance',
                    value: healthData?.distanceMeters != null
                        ? (healthData!.distanceMeters! / 1000.0).toStringAsFixed(2)
                        : null,
                    unit: 'km',
                    subtitle: 'GPS + Stride',
                    isAvailable: healthData?.distanceMeters != null,
                  ),

                  // Activity / SpO2
                  HealthValueCard(
                    icon: Icons.sports_score,
                    iconColor: AppColors.cycle,
                    title: 'Activity',
                    value: healthData?.activityType ?? 'General',
                    subtitle: healthData?.spo2 != null ? 'SpO2: ${healthData!.spo2}%' : 'Workout Session',
                    isAvailable: true,
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // Technical Transparency Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surfaceMuted,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.info_outline, size: 20, color: AppColors.primary),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Universal Smartwatch Telemetry Integration',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Standard GATT heart rate (0x180D), battery (0x180F), and vital telemetry are supported across all smartwatch brands. Telemetry is synchronized to your biological twin and dashboard.',
                            style: TextStyle(
                              fontSize: 11,
                              color: AppColors.textSecondary,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
