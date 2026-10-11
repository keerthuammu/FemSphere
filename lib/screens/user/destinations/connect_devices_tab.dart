import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/app_theme.dart';
import '../../../features/wearables/core/device_brand.dart';
import '../../../features/wearables/core/wearable_capabilities.dart';
import '../../../features/wearables/core/wearable_manager.dart';
import '../../../features/wearables/screens/universal_scan_screen.dart';
import '../../../features/wearables/services/wearable_sync_service.dart';
import '../../../features/wearables/widgets/brand_badge.dart';

class ConnectDevicesTab extends StatefulWidget {
  final VoidCallback? onBack;

  const ConnectDevicesTab({super.key, this.onBack});

  @override
  State<ConnectDevicesTab> createState() => _ConnectDevicesTabState();
}

class _ConnectDevicesTabState extends State<ConnectDevicesTab> {
  final WearableManager _manager = WearableManager();
  final WearableSyncService _syncService = WearableSyncService();

  List<Map<String, dynamic>> _registeredDevices = [];
  Map<String, dynamic>? _selectedDevice;
  Map<String, dynamic>? _latestTelemetry;
  Map<String, dynamic>? _todaySummary;

  bool _isLoading = true;
  bool _isSyncing = false;
  String? _statusMessage;

  @override
  void initState() {
    super.initState();
    _loadDevicesAndTelemetry();
  }

  Future<void> _loadDevicesAndTelemetry() async {
    setState(() => _isLoading = true);
    try {
      if (_manager.activeDevice == null) {
        await _manager.autoConnectIfBluetoothConnected();
      }
      if (_manager.activeDevice != null) {
        try {
          await _manager.activeDevice!.syncToBackend();
        } catch (_) {}
      }

      final devices = await _syncService.getRegisteredWearables();
      Map<String, dynamic>? active;
      if (devices.isNotEmpty) {
        active = devices.first;
      }

      final telemetry = await _syncService.getLatestTelemetry(
        deviceId: active != null ? active['id'] as int? : null,
      );

      if (mounted) {
        setState(() {
          _registeredDevices = devices;
          _selectedDevice = active;
          _latestTelemetry = telemetry['latest_reading'] as Map<String, dynamic>?;
          _todaySummary = telemetry['today_summary'] as Map<String, dynamic>?;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _handleManualSync() async {
    setState(() => _isSyncing = true);
    try {
      if (_manager.activeDevice != null) {
        await _manager.activeDevice!.syncToBackend();
      }
      await _loadDevicesAndTelemetry();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Device telemetry successfully synchronized!'),
            backgroundColor: Color(0xFF10B981),
            duration: Duration(seconds: 2),
          ),
        );
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to sync wearable data. Check connection.'),
            backgroundColor: Color(0xFFEF4444),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSyncing = false);
      }
    }
  }

  Future<void> _handleDisconnectDevice(dynamic deviceId) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Disconnect Device'),
        content: const Text('Are you sure you want to remove this wearable device from your account?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Disconnect', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      final success = await _syncService.deleteDevice(deviceId);
      if (success && mounted) {
        await _loadDevicesAndTelemetry();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Device removed successfully.')),
        );
      }
    }
  }

  // ===========================================================================
  // MANUAL ACTIVITY ENTRY MODAL (Prompt Section 2.C requirement)
  // ===========================================================================
  void _showManualEntrySheet() {
    final dateCtrl = TextEditingController(text: DateFormat('yyyy-MM-dd').format(DateTime.now()));
    final stepsCtrl = TextEditingController();
    final caloriesCtrl = TextEditingController();
    final hrCtrl = TextEditingController();
    final sleepCtrl = TextEditingController();
    final spo2Ctrl = TextEditingController();
    bool isSubmitting = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Container(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 44,
                    height: 4,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE2E8F0),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Manual Health & Activity Entry',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF201538),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, size: 20),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                Text(
                  'Enter your daily health metrics to record them against your account.',
                  style: GoogleFonts.plusJakartaSans(fontSize: 12, color: const Color(0xFF7A6F75)),
                ),
                const SizedBox(height: 18),

                // Date Picker field
                TextField(
                  controller: dateCtrl,
                  decoration: InputDecoration(
                    labelText: 'Date (YYYY-MM-DD)',
                    suffixIcon: const Icon(Icons.calendar_today, size: 18),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  readOnly: true,
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: ctx,
                      initialDate: DateTime.now(),
                      firstDate: DateTime(2020),
                      lastDate: DateTime.now(),
                    );
                    if (picked != null) {
                      dateCtrl.text = DateFormat('yyyy-MM-dd').format(picked);
                    }
                  },
                ),
                const SizedBox(height: 12),

                // Steps & Calories row
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: stepsCtrl,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Steps',
                          hintText: 'e.g. 8500',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: caloriesCtrl,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Calories (kcal)',
                          hintText: 'e.g. 450',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Heart rate & Sleep duration row
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: hrCtrl,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Heart Rate (bpm)',
                          hintText: 'e.g. 72',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: sleepCtrl,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Sleep (minutes)',
                          hintText: 'e.g. 480',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // SpO2 field
                TextField(
                  controller: spo2Ctrl,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'Blood Oxygen (SpO2 %)',
                    hintText: 'e.g. 98',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 20),

                // Submit Button
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: isSubmitting
                        ? null
                        : () async {
                            setSheetState(() => isSubmitting = true);
                            final steps = int.tryParse(stepsCtrl.text);
                            final cal = int.tryParse(caloriesCtrl.text);
                            final hr = int.tryParse(hrCtrl.text);
                            final sleep = int.tryParse(sleepCtrl.text);
                            final spo2 = int.tryParse(spo2Ctrl.text);

                            final success = await _syncService.syncManualTelemetry(
                              date: dateCtrl.text,
                              steps: steps,
                              calories: cal,
                              heartRate: hr,
                              sleepDurationMinutes: sleep,
                              spo2: spo2,
                            );

                            if (mounted) {
                              Navigator.pop(ctx);
                              if (success) {
                                await _loadDevicesAndTelemetry();
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Daily health metrics saved successfully!'),
                                    backgroundColor: Color(0xFF10B981),
                                  ),
                                );
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Failed to save manual health metrics.'),
                                    backgroundColor: Color(0xFFEF4444),
                                  ),
                                );
                              }
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryPurple,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: isSubmitting
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : Text(
                            'Save Health Record',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ===========================================================================
  // LINK COMPANION DEVICE SHEET (Apple Watch, Wear OS, Amazfit, Garmin)
  // ===========================================================================
  void _showCompanionLinkSheet() {
    DeviceBrand selectedBrand = DeviceBrand.appleWatch;
    final nameCtrl = TextEditingController(text: 'Apple Watch Series 9');
    bool isSubmitting = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Container(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE2E8F0),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Link Companion Watch',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF201538),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Bridge Apple Health, Samsung Health, or Google Health Connect telemetry into FemSphere.',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: const Color(0xFF7A6F75)),
              ),
              const SizedBox(height: 16),

              // Brand dropdown
              DropdownButtonFormField<DeviceBrand>(
                initialValue: selectedBrand,
                decoration: InputDecoration(
                  labelText: 'Smartwatch Brand / Platform',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
                items: [
                  DeviceBrand.appleWatch,
                  DeviceBrand.samsungGalaxy,
                  DeviceBrand.googlePixel,
                  DeviceBrand.garmin,
                  DeviceBrand.fitbit,
                  DeviceBrand.amazfit,
                  DeviceBrand.genericBle,
                ].map((b) => DropdownMenuItem(value: b, child: Text(b.displayName))).toList(),
                onChanged: (b) {
                  if (b != null) {
                    setSheetState(() {
                      selectedBrand = b;
                      nameCtrl.text = '${b.displayName} Companion';
                    });
                  }
                },
              ),
              const SizedBox(height: 12),

              TextField(
                controller: nameCtrl,
                decoration: InputDecoration(
                  labelText: 'Device Name',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: isSubmitting
                      ? null
                      : () async {
                          setSheetState(() => isSubmitting = true);
                          final id = 'COMPANION-${selectedBrand.name.toUpperCase()}-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';

                          final res = await _syncService.registerDevice(
                            deviceIdentifier: id,
                            deviceName: nameCtrl.text.trim(),
                            deviceModel: nameCtrl.text.trim(),
                            brand: selectedBrand.name.toUpperCase(),
                            capabilities: const WearableCapabilities(
                              heartRate: true,
                              steps: true,
                              calories: true,
                              sleep: true,
                              spo2: true,
                              realTimeStream: true,
                            ),
                            batteryLevel: 85,
                          );

                          if (mounted) {
                            Navigator.pop(ctx);
                            if (res != null) {
                              await _loadDevicesAndTelemetry();
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('${nameCtrl.text} linked successfully!'),
                                  backgroundColor: const Color(0xFF10B981),
                                ),
                              );
                            }
                          }
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryPurple,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: isSubmitting
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(
                          'Register Companion Device',
                          style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.primaryPurple));
    }

    return Scaffold(
      backgroundColor: const Color(0xFFFAF7FD),
      body: RefreshIndicator(
        color: AppTheme.primaryPurple,
        onRefresh: _loadDevicesAndTelemetry,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Text(
                'Connected Devices',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: const Color(0xFF201538),
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Pair smartwatches, view real-time sync telemetry, or log manual health data.',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  color: const Color(0xFF7A6F75),
                ),
              ),
              const SizedBox(height: 18),

              // Action Buttons Row (Connect Watch / Manual Entry)
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const UniversalScanScreen()),
                        );
                        _loadDevicesAndTelemetry();
                      },
                      icon: const Icon(Icons.bluetooth_searching, size: 16),
                      label: const Text('Pair BLE Watch'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryPurple,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        textStyle: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _showCompanionLinkSheet,
                      icon: const Icon(Icons.link, size: 16),
                      label: const Text('Companion'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.primaryPurple,
                        side: const BorderSide(color: Color(0xFFEDE4F7)),
                        backgroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        textStyle: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _showManualEntrySheet,
                      icon: const Icon(Icons.edit_note, size: 16),
                      label: const Text('Manual'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFFF43F5E),
                        side: const BorderSide(color: Color(0xFFF4DDE2)),
                        backgroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        textStyle: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Connected Devices Section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Registered Devices (${_registeredDevices.length})',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF201538),
                    ),
                  ),
                  if (_registeredDevices.isNotEmpty)
                    TextButton.icon(
                      onPressed: _isSyncing ? null : _handleManualSync,
                      icon: _isSyncing
                          ? const SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Icon(Icons.refresh, size: 14),
                      label: Text(_isSyncing ? 'Syncing...' : 'Sync Now'),
                      style: TextButton.styleFrom(
                        foregroundColor: AppTheme.primaryPurple,
                        textStyle: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 10),

              if (_registeredDevices.isEmpty)
                _buildNoDevicesCard()
              else
                ..._registeredDevices.map((dev) => _buildDeviceCard(dev)),

              const SizedBox(height: 20),

              // Daily Activity Telemetry from Device Section
              Text(
                'Live Activity Data (Connected Hardware)',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF201538),
                ),
              ),
              const SizedBox(height: 10),
              _buildLiveTelemetryCard(),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNoDevicesCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFF1EBF9)),
      ),
      child: Column(
        children: [
          const Icon(Icons.watch_off_outlined, size: 42, color: Color(0xFFB3A9C4)),
          const SizedBox(height: 10),
          Text(
            'No Devices Connected',
            style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w700, color: const Color(0xFF201538)),
          ),
          const SizedBox(height: 4),
          Text(
            'Connect your smartwatch via Bluetooth, link a companion app, or manually enter daily activity.',
            textAlign: TextAlign.center,
            style: GoogleFonts.plusJakartaSans(fontSize: 12, color: const Color(0xFF7A6F75), height: 1.4),
          ),
        ],
      ),
    );
  }

  Widget _buildDeviceCard(Map<String, dynamic> dev) {
    final name = dev['device_name']?.toString() ?? 'Smartwatch';
    final model = dev['device_model']?.toString() ?? '';
    final brand = dev['brand']?.toString() ?? 'BLE';
    final status = dev['connection_status']?.toString() ?? 'CONNECTED';
    final lastSynced = dev['last_synced_at']?.toString() ?? dev['updated_at']?.toString();
    final battery = dev['battery_level'];
    final id = dev['id'];

    String syncTimeStr = 'Just now';
    if (lastSynced != null) {
      try {
        final dt = DateTime.parse(lastSynced);
        syncTimeStr = DateFormat('MMM d, h:mm a').format(dt);
      } catch (_) {}
    }

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFEDE4F7), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF201538).withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppTheme.primaryPurpleLight,
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.watch_rounded, color: AppTheme.primaryPurple, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      name,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF201538),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                      decoration: BoxDecoration(
                        color: status == 'CONNECTED' || status == 'SYNCED'
                            ? const Color(0xFFDCFCE7)
                            : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        status,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 9,
                          fontWeight: FontWeight.w700,
                          color: status == 'CONNECTED' || status == 'SYNCED'
                              ? const Color(0xFF15803D)
                              : const Color(0xFF64748B),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  'Brand: $brand · Last synced: $syncTimeStr',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    color: const Color(0xFF7A6F75),
                  ),
                ),
                if (battery != null) ...[
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      const Icon(Icons.battery_charging_full, size: 12, color: Color(0xFF10B981)),
                      const SizedBox(width: 4),
                      Text(
                        'Battery: $battery%',
                        style: GoogleFonts.plusJakartaSans(fontSize: 10, color: const Color(0xFF10B981)),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline, color: Color(0xFFEF4444), size: 20),
            onPressed: () => _handleDisconnectDevice(id),
          ),
        ],
      ),
    );
  }

  Widget _buildLiveTelemetryCard() {
    final steps = _todaySummary?['today_steps'] ?? _latestTelemetry?['steps'];
    final hr = _latestTelemetry?['heart_rate'] ?? _todaySummary?['avg_heart_rate'];
    final cal = _todaySummary?['today_calories'] ?? _latestTelemetry?['calories'];
    final sleepMins = _todaySummary?['today_sleep_minutes'] ?? _latestTelemetry?['sleep_duration_minutes'];
    final spo2 = _todaySummary?['latest_spo2'] ?? _latestTelemetry?['spo2'];

    final hasAnyData = steps != null || hr != null || cal != null || sleepMins != null || spo2 != null;

    if (!hasAnyData) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFF1EBF9)),
        ),
        child: Center(
          child: Text(
            'No active telemetry received today from connected devices.\nTap "Sync Now" or use "Manual" to record activity.',
            textAlign: TextAlign.center,
            style: GoogleFonts.plusJakartaSans(fontSize: 11, color: const Color(0xFF8E859E), height: 1.4),
          ),
        ),
      );
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFF1EBF9)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF201538).withValues(alpha: 0.03),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildMetricItem('Steps', steps != null ? NumberFormat('#,###').format(steps) : '—', Icons.directions_walk, const Color(0xFFF43F5E)),
              _buildMetricItem('Heart Rate', hr != null ? '$hr bpm' : '—', Icons.favorite, const Color(0xFFEF4444)),
              _buildMetricItem('Calories', cal != null ? '$cal kcal' : '—', Icons.local_fire_department, const Color(0xFFF59E0B)),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(height: 1, color: Color(0xFFF5F0FB)),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildMetricItem(
                'Sleep',
                sleepMins != null ? '${(sleepMins ~/ 60)}h ${sleepMins % 60}m' : '—',
                Icons.nightlight_round,
                const Color(0xFF9333EA),
              ),
              _buildMetricItem('Blood SpO2', spo2 != null ? '$spo2%' : '—', Icons.air, const Color(0xFF06B6D4)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricItem(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 14,
            fontWeight: FontWeight.w800,
            color: const Color(0xFF201538),
          ),
        ),
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 10,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF7A6F75),
          ),
        ),
      ],
    );
  }
}
