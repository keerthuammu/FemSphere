import 'package:flutter/material.dart';
import '../../../core/app_theme.dart';
import '../../../services/health_connect_service.dart';

/// Step-by-step official integration wizard for Amazfit Bip U Pro (A2008) and Zepp OS watches.
/// Flow: Amazfit Watch -> Zepp App -> Android Health Connect -> FemSphere App -> Cloud Backend
class AmazfitSetupGuideScreen extends StatefulWidget {
  const AmazfitSetupGuideScreen({super.key});

  @override
  State<AmazfitSetupGuideScreen> createState() => _AmazfitSetupGuideScreenState();
}

class _AmazfitSetupGuideScreenState extends State<AmazfitSetupGuideScreen> {
  final HealthConnectService _healthConnectService = HealthConnectService();

  bool _isTesting = false;
  String? _syncMessage;
  bool _syncSuccess = false;

  Future<void> _testSync() async {
    setState(() {
      _isTesting = true;
      _syncMessage = null;
    });

    try {
      final snap = await _healthConnectService.syncHealthData(requestPermissionIfDenied: true);

      if (!mounted) return;

      if (snap.status == HealthSyncStatus.notInstalled) {
        setState(() {
          _syncSuccess = false;
          _syncMessage = '⚠️ ${snap.statusMessage}\nPlease install or update Health Connect from Google Play Store.';
        });
      } else if (snap.status == HealthSyncStatus.permissionRequired) {
        setState(() {
          _syncSuccess = false;
          _syncMessage = '⚠️ Health Connect read permissions are required to read Amazfit biometrics. Please grant permissions.';
        });
      } else if (snap.status == HealthSyncStatus.zeppPending) {
        setState(() {
          _syncSuccess = false;
          _syncMessage = 'ℹ️ Health Connect is connected, but Zepp has not synchronized any records yet.\n\n'
              '1. Open Zepp on this phone to sync your watch.\n'
              '2. Check Zepp > Profile > Add Accounts > Health Connect.\n'
              '3. Return here and tap Sync again.';
        });
      } else {
        final List<String> metrics = [];
        if (snap.steps != null && snap.steps! > 0) metrics.add('${snap.steps} steps');
        if (snap.heartRate != null) metrics.add('${snap.heartRate} bpm HR');
        if (snap.sleepMinutes != null && snap.sleepMinutes! > 0) {
          metrics.add('${snap.sleepMinutes! ~/ 60}h ${snap.sleepMinutes! % 60}m sleep');
        }
        if (snap.calories != null && snap.calories! > 0) metrics.add('${snap.calories} kcal');
        if (snap.spo2 != null) metrics.add('${snap.spo2}% SpO2');

        final summary = metrics.isNotEmpty ? ' (${metrics.join(', ')})' : '';

        setState(() {
          _syncSuccess = true;
          _syncMessage = snap.isBackendSynced
              ? '✅ Successfully fetched Amazfit data from Zepp via Health Connect and synchronized to FemSphere cloud$summary!'
              : '✅ Successfully read records from Health Connect$summary! Saved locally on device.';
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _syncSuccess = false;
          _syncMessage = 'Synchronization note: $e';
        });
      }
    } finally {
      if (mounted) {
        setState(() => _isTesting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Connect Amazfit Bip U Pro'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppTheme.primaryPurple.withValues(alpha: 0.12),
                    AppTheme.accentPink.withValues(alpha: 0.06),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.primaryPurple.withValues(alpha: 0.2)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: const BoxDecoration(
                      color: AppTheme.primaryPurple,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.watch_outlined, color: Colors.white, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Amazfit Bip U Pro (A2008)',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Zepp Health OS Bridge Integration',
                          style: TextStyle(fontSize: 13, color: Colors.grey.shade600),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text(
              'How to Pair & Sync in 3 Steps',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 14),

            _buildStepCard(
              stepNumber: '1',
              title: 'Pair Watch with Zepp App',
              description: 'Ensure your Amazfit Bip U Pro is paired and synced with the official Zepp app on your smartphone.',
              icon: Icons.smartphone,
            ),
            const SizedBox(height: 12),

            _buildStepCard(
              stepNumber: '2',
              title: 'Enable Health Hub Export in Zepp',
              description:
                  'Inside Zepp, go to Profile > Accounts / Third-party linking.\n'
                  '• On Android: Tap "Health Connect" & turn ON all permissions.\n'
                  '• On iOS: Tap "Apple Health" & allow Steps, Heart Rate, SpO2, Sleep.',
              icon: Icons.share,
            ),
            const SizedBox(height: 12),

            _buildStepCard(
              stepNumber: '3',
              title: 'FemSphere Reads & Streams to Web',
              description:
                  'FemSphere reads the biometrics from Health Connect and securely streams your heart rate, steps, SpO2, and sleep directly to your FemSphere Web Dashboard.',
              icon: Icons.cloud_sync_outlined,
            ),
            const SizedBox(height: 28),

            // Sync test feedback
            if (_syncMessage != null) ...[
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: _syncSuccess ? Colors.green.shade50 : Colors.amber.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: _syncSuccess ? Colors.green.shade300 : Colors.amber.shade300,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      _syncSuccess ? Icons.check_circle_outline : Icons.warning_amber_rounded,
                      color: _syncSuccess ? Colors.green.shade700 : Colors.amber.shade800,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        _syncMessage!,
                        style: TextStyle(
                          fontSize: 13,
                          color: _syncSuccess ? Colors.green.shade900 : Colors.amber.shade900,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Action Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                onPressed: _isTesting ? null : _testSync,
                icon: _isTesting
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Icon(Icons.refresh),
                label: Text(_isTesting ? 'Synchronizing Zepp Data...' : 'Sync Amazfit Health Data Now'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryPurple,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepCard({
    required String stepNumber,
    required String title,
    required String description,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: AppTheme.primaryPurple.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(8),
            ),
            alignment: Alignment.center,
            child: Text(
              stepNumber,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: AppTheme.primaryPurple,
                fontSize: 16,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(icon, size: 17, color: AppTheme.primaryPurple),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        title,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  description,
                  style: TextStyle(fontSize: 13, color: Colors.grey.shade600, height: 1.35),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
