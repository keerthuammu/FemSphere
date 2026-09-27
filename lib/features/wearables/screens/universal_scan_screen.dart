import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import '../../../core/app_theme.dart';
import '../core/device_brand.dart';
import '../core/wearable_manager.dart';
import '../services/wearable_sync_service.dart';
import '../widgets/brand_badge.dart';

class UniversalScanScreen extends StatefulWidget {
  const UniversalScanScreen({super.key});

  @override
  State<UniversalScanScreen> createState() => _UniversalScanScreenState();
}

class _UniversalScanScreenState extends State<UniversalScanScreen> {
  final WearableManager _manager = WearableManager();
  final WearableSyncService _syncService = WearableSyncService();

  DeviceBrand? _selectedBrandFilter;
  List<ScanResult> _scanResults = [];
  List<BluetoothDevice> _phoneBluetoothDevices = [];
  bool _isScanning = false;
  String? _connectingId;
  StreamSubscription? _scanSub;

  @override
  void initState() {
    super.initState();
    _startScan();
  }

  @override
  void dispose() {
    _stopScan();
    super.dispose();
  }

  Future<void> _startScan() async {
    setState(() {
      _scanResults = [];
      _phoneBluetoothDevices = [];
      _isScanning = true;
    });

    try {
      final isSupported = await FlutterBluePlus.isSupported;
      if (!isSupported) {
        setState(() => _isScanning = false);
        return;
      }

      // 1. Immediately query devices already connected to phone Bluetooth OS
      final List<BluetoothDevice> phoneDevs = [];
      try {
        final sys = await FlutterBluePlus.systemDevices([]);
        for (final d in sys) {
          if (!phoneDevs.any((x) => x.remoteId == d.remoteId)) {
            phoneDevs.add(d);
          }
        }
      } catch (e) {
        debugPrint('systemDevices query: $e');
      }

      // 2. Query devices bonded in phone Bluetooth settings
      try {
        final bonded = await FlutterBluePlus.bondedDevices;
        for (final d in bonded) {
          if (!phoneDevs.any((x) => x.remoteId == d.remoteId)) {
            phoneDevs.add(d);
          }
        }
      } catch (e) {
        debugPrint('bondedDevices query: $e');
      }

      if (mounted) {
        setState(() {
          _phoneBluetoothDevices = phoneDevs;
        });
      }

      await FlutterBluePlus.startScan(
        timeout: const Duration(seconds: 15),
      );

      _scanSub = FlutterBluePlus.scanResults.listen((results) {
        if (mounted) {
          setState(() {
            _scanResults = results.where((r) => r.device.platformName.isNotEmpty).toList();
          });
        }
      });
    } catch (_) {
      if (mounted) setState(() => _isScanning = false);
    }
  }

  Future<void> _stopScan() async {
    _scanSub?.cancel();
    try {
      if (FlutterBluePlus.isScanningNow) {
        await FlutterBluePlus.stopScan();
      }
    } catch (_) {}
    if (mounted) setState(() => _isScanning = false);
  }

  Future<void> _connectBleDevice(BluetoothDevice device, DeviceBrand brand) async {
    setState(() => _connectingId = device.remoteId.str);
    try {
      await _stopScan();
      final adapter = _manager.createBleAdapter(device, forceBrand: brand);

      final connected = await adapter.connect();
      if (!connected) {
        throw Exception('Could not connect to ${device.platformName}. Ensure watch is awake and unlinked from other apps.');
      }

      // Register device on backend
      int? battery;
      try {
        battery = await adapter.readBattery();
      } catch (_) {}

      await _syncService.registerDevice(
        deviceIdentifier: adapter.id,
        deviceName: adapter.name,
        deviceModel: adapter.model,
        brand: adapter.brand.code,
        capabilities: adapter.capabilities,
        batteryLevel: battery,
      );

      _manager.setActiveDevice(adapter);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✓ ${adapter.name} connected to FemSphere!'),
            backgroundColor: const Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _connectingId = null);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Connection note: $e'),
            backgroundColor: Colors.redAccent,
            behavior: SnackBarBehavior.floating,
            action: SnackBarAction(
              label: 'Tips',
              textColor: Colors.white,
              onPressed: () => _showTroubleshootingDialog(context),
            ),
          ),
        );
      }
    }
  }

  Future<void> _pairCompanionDevice(DeviceBrand brand) async {
    setState(() => _connectingId = brand.code);
    try {
      final adapter = _manager.createCompanionAdapter(brand);
      await adapter.connect();

      await _syncService.registerDevice(
        deviceIdentifier: adapter.id,
        deviceName: adapter.name,
        deviceModel: adapter.model,
        brand: adapter.brand.code,
        capabilities: adapter.capabilities,
        batteryLevel: await adapter.readBattery(),
      );

      // Perform initial telemetry sync
      await adapter.syncToBackend();
      _manager.setActiveDevice(adapter);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${adapter.name} companion bridge enabled & synced!'),
            backgroundColor: const Color(0xFF10B981),
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _connectingId = null);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Companion pairing error: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  List<ScanResult> get _filteredResults {
    if (_selectedBrandFilter == null) return _scanResults;
    return _scanResults.where((r) {
      final detected = _manager.detectBrand(r.device.platformName, r.advertisementData.serviceUuids);
      return detected == _selectedBrandFilter;
    }).toList();
  }

  List<BluetoothDevice> get _filteredPhoneDevices {
    if (_selectedBrandFilter == null) return _phoneBluetoothDevices;
    return _phoneBluetoothDevices.where((d) {
      final detected = _manager.detectBrand(d.platformName, []);
      return detected == _selectedBrandFilter;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final phoneDevices = _filteredPhoneDevices;
    final scanDevices = _filteredResults;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Pair Wearable Device', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            tooltip: 'Connection Help',
            icon: const Icon(Icons.help_outline, color: AppTheme.primaryPurple),
            onPressed: () => _showTroubleshootingDialog(context),
          ),
          IconButton(
            tooltip: 'Refresh / Scan',
            icon: Icon(_isScanning ? Icons.stop : Icons.refresh, color: AppTheme.primaryPurple),
            onPressed: _isScanning ? _stopScan : _startScan,
          ),
        ],
      ),
      body: Column(
        children: [
          // 1. Brand Filter Tabs
          _buildBrandFilterBar(),

          // 2. Scan Status Strip
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: Colors.white,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    if (_isScanning)
                      const SizedBox(
                        width: 14,
                        height: 14,
                        child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.primaryPurple),
                      )
                    else
                      const Icon(Icons.bluetooth, size: 16, color: Colors.blueGrey),
                    const SizedBox(width: 8),
                    Text(
                      _isScanning ? 'Scanning for nearby wearables...' : 'Scan idle',
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade700, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
                Text(
                  '${phoneDevices.length + scanDevices.length} available',
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.primaryPurple),
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // 3. Companion Quick Pairing Card if companion brand is selected
          if (_isCompanionBrand(_selectedBrandFilter))
            _buildCompanionPairingPrompt(_selectedBrandFilter!),

          // 4. Combined Devices List
          Expanded(
            child: (phoneDevices.isEmpty && scanDevices.isEmpty)
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.bluetooth_searching, size: 48, color: Colors.grey.shade300),
                          const SizedBox(height: 12),
                          Text(
                            _isScanning ? 'Searching for smartwatches & trackers...' : 'No devices found',
                            style: TextStyle(color: Colors.grey.shade700, fontSize: 14, fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'If your watch is already connected to your phone Bluetooth, make sure it is not exclusively locked by another companion app.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.grey.shade500, fontSize: 11.5),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              OutlinedButton.icon(
                                onPressed: _startScan,
                                icon: const Icon(Icons.refresh, size: 16),
                                label: const Text('Rescan BLE'),
                              ),
                              const SizedBox(width: 10),
                              ElevatedButton.icon(
                                onPressed: () => _showTroubleshootingDialog(context),
                                icon: const Icon(Icons.help_outline, size: 16),
                                label: const Text('Troubleshooting Tips'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.primaryPurple,
                                  foregroundColor: Colors.white,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      // Section A: Devices already connected in Phone Bluetooth
                      if (phoneDevices.isNotEmpty) ...[
                        Row(
                          children: [
                            const Icon(Icons.phonelink_ring, size: 16, color: Color(0xFF10B981)),
                            const SizedBox(width: 6),
                            const Text(
                              'Paired in Phone Bluetooth (Ready to Connect)',
                              style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Colors.black87),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        ...phoneDevices.map((d) {
                          final detectedBrand = _manager.detectBrand(d.platformName, []);
                          final isConnecting = _connectingId == d.remoteId.str;

                          return Container(
                            margin: const EdgeInsets.only(bottom: 10),
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF0FDF4),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: const Color(0xFF86EFAC)),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: detectedBrand.brandColor.withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Icon(detectedBrand.iconData, color: detectedBrand.brandColor, size: 24),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        d.platformName.isNotEmpty ? d.platformName : 'Phone Connected Watch',
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                      ),
                                      const SizedBox(height: 3),
                                      Row(
                                        children: [
                                          BrandBadge(brand: detectedBrand, compact: true),
                                          const SizedBox(width: 6),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFF10B981).withValues(alpha: 0.15),
                                              borderRadius: BorderRadius.circular(4),
                                            ),
                                            child: const Text(
                                              '● Connected in OS',
                                              style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Color(0xFF047857)),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                ElevatedButton(
                                  onPressed: isConnecting ? null : () => _connectBleDevice(d, detectedBrand),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF10B981),
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  ),
                                  child: isConnecting
                                      ? const SizedBox(
                                          width: 14,
                                          height: 14,
                                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                        )
                                      : const Text('Connect to App', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                ),
                              ],
                            ),
                          );
                        }),
                        const SizedBox(height: 12),
                      ],

                      // Section B: Nearby Discovered BLE Advertising Devices
                      if (scanDevices.isNotEmpty) ...[
                        Row(
                          children: [
                            const Icon(Icons.sensors, size: 16, color: AppTheme.primaryPurple),
                            const SizedBox(width: 6),
                            const Text(
                              'Nearby BLE Wearables Detected',
                              style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Colors.black87),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        ...scanDevices.map((r) {
                          final detectedBrand = _manager.detectBrand(
                            r.device.platformName,
                            r.advertisementData.serviceUuids,
                          );
                          final isConnecting = _connectingId == r.device.remoteId.str;

                          return Container(
                            margin: const EdgeInsets.only(bottom: 10),
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: Colors.grey.withValues(alpha: 0.18)),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: detectedBrand.brandColor.withValues(alpha: 0.12),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Icon(detectedBrand.iconData, color: detectedBrand.brandColor, size: 24),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        r.device.platformName,
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                      ),
                                      const SizedBox(height: 3),
                                      Row(
                                        children: [
                                          BrandBadge(brand: detectedBrand, compact: true),
                                          const SizedBox(width: 6),
                                          Text(
                                            'RSSI: ${r.rssi} dBm',
                                            style: TextStyle(fontSize: 10, color: Colors.grey.shade500),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                ElevatedButton(
                                  onPressed: isConnecting ? null : () => _connectBleDevice(r.device, detectedBrand),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: detectedBrand.brandColor,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  ),
                                  child: isConnecting
                                      ? const SizedBox(
                                          width: 14,
                                          height: 14,
                                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                        )
                                      : const Text('Pair', style: TextStyle(fontSize: 12)),
                                ),
                              ],
                            ),
                          );
                        }),
                      ],

                      // Troubleshooting Guide Footer Banner
                      const SizedBox(height: 12),
                      InkWell(
                        onTap: () => _showTroubleshootingDialog(context),
                        borderRadius: BorderRadius.circular(14),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: const Color(0xFFBFDBFE)),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.info_outline, size: 18, color: Color(0xFF2563EB)),
                              SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Watch connected to Bluetooth but not app?',
                                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1E40AF)),
                                    ),
                                    Text(
                                      'Tap here to view solutions for exclusive lock & companion app conflicts.',
                                      style: TextStyle(fontSize: 10.5, color: Color(0xFF3B82F6)),
                                    ),
                                  ],
                                ),
                              ),
                              Icon(Icons.chevron_right, size: 18, color: Color(0xFF2563EB)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
          ),
        ],
      ),
    );
  }

  void _showTroubleshootingDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.bluetooth_connected, color: AppTheme.primaryPurple),
            SizedBox(width: 8),
            Expanded(
              child: Text(
                'Watch Connected in Bluetooth but Not in App?',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'If your watch shows as "Connected" in your phone\'s Bluetooth Settings, follow these 3 quick steps to link it to FemSphere:',
                style: TextStyle(fontSize: 12, color: Colors.black87, height: 1.4),
              ),
              const SizedBox(height: 12),
              _buildTroubleStep(
                num: '1',
                title: 'Tap "Connect to App" Above',
                desc: 'FemSphere detects devices already bonded to your phone OS. Look at the green "Paired in Phone Bluetooth" section at the top of the list and tap "Connect to App".',
              ),
              const SizedBox(height: 10),
              _buildTroubleStep(
                num: '2',
                title: 'Close Other Smartwatch Apps (Exclusive Lock)',
                desc: 'Many smartwatches (Amazfit/Zepp, boAt, NoiseFit, FitCloudPro, Galaxy Wearable) hold an exclusive Bluetooth lock. Force-close or disconnect from that app so FemSphere can read your vitals.',
              ),
              const SizedBox(height: 10),
              _buildTroubleStep(
                num: '3',
                title: 'Quick Bluetooth Toggle',
                desc: 'Turn phone Bluetooth OFF, wait 3 seconds, turn it back ON. Then reopen FemSphere and tap Rescan.',
              ),
            ],
          ),
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryPurple,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('Understood'),
          ),
        ],
      ),
    );
  }

  Widget _buildTroubleStep({required String num, required String title, required String desc}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CircleAvatar(
          radius: 11,
          backgroundColor: AppTheme.primaryPurple,
          child: Text(num, style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold)),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.black87)),
              const SizedBox(height: 2),
              Text(desc, style: TextStyle(fontSize: 11, color: Colors.grey.shade700, height: 1.3)),
            ],
          ),
        ),
      ],
    );
  }

  bool _isCompanionBrand(DeviceBrand? brand) {
    if (brand == null) return false;
    return brand == DeviceBrand.appleWatch ||
        brand == DeviceBrand.samsungGalaxy ||
        brand == DeviceBrand.googlePixel ||
        brand == DeviceBrand.garmin ||
        brand == DeviceBrand.fitbit;
  }

  Widget _buildCompanionPairingPrompt(DeviceBrand brand) {
    final isPairing = _connectingId == brand.code;
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: brand.brandColor.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: brand.brandColor.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(brand.iconData, color: brand.brandColor, size: 20),
              const SizedBox(width: 8),
              Text(
                '${brand.displayName} Bridge',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: brand.brandColor),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'Connect via companion ecosystem (Health Connect / HealthKit / Garmin Mobile SDK) to retrieve high-resolution telemetry including sleep stages and HRV.',
            style: TextStyle(fontSize: 11.5, color: Colors.grey.shade700),
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: isPairing ? null : () => _pairCompanionDevice(brand),
            icon: isPairing
                ? const SizedBox(
                    width: 14,
                    height: 14,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  )
                : const Icon(Icons.link, size: 16),
            label: Text('Enable ${brand.displayName} Companion Bridge', style: const TextStyle(fontSize: 12)),
            style: ElevatedButton.styleFrom(
              backgroundColor: brand.brandColor,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBrandFilterBar() {
    final brands = [null, ...DeviceBrand.values];
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Row(
          children: brands.map((b) {
            final isSelected = _selectedBrandFilter == b;
            final label = b == null ? 'All Brands' : b.displayName;
            final color = b == null ? AppTheme.primaryPurple : b.brandColor;

            return Padding(
              padding: const EdgeInsets.only(right: 6),
              child: FilterChip(
                selected: isSelected,
                label: Text(label, style: TextStyle(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
                selectedColor: color.withValues(alpha: 0.15),
                checkmarkColor: color,
                backgroundColor: Colors.grey.shade50,
                side: BorderSide(color: isSelected ? color : Colors.grey.shade300),
                onSelected: (val) {
                  setState(() {
                    _selectedBrandFilter = val ? b : null;
                  });
                },
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}
