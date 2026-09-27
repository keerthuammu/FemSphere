import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';
import '../../wearables/core/device_brand.dart';
import '../services/bluetooth_service.dart';
import 'smartwatch_screen.dart';

class DeviceScanScreen extends ConsumerStatefulWidget {
  const DeviceScanScreen({super.key});

  @override
  ConsumerState<DeviceScanScreen> createState() => _DeviceScanScreenState();
}

class _DeviceScanScreenState extends ConsumerState<DeviceScanScreen> {
  final WatchBluetoothService _ble = WatchBluetoothService();
  List<DiscoveredSmartwatch> _devices = [];
  bool _isScanning = false;
  String? _connectingId;

  @override
  void initState() {
    super.initState();
    _startScan();
  }

  void _startScan() {
    setState(() {
      _isScanning = true;
      _devices = [];
    });

    _ble.scanDevices().listen(
      (list) {
        if (mounted) {
          setState(() {
            _devices = list;
          });
        }
      },
      onDone: () {
        if (mounted) {
          setState(() {
            _isScanning = false;
          });
        }
      },
      onError: (err) {
        if (mounted) {
          setState(() {
            _isScanning = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Bluetooth scan error: $err'),
              backgroundColor: AppColors.error,
            ),
          );
        }
      },
    );
  }

  Future<void> _connectDevice(DiscoveredSmartwatch discovered) async {
    setState(() {
      _connectingId = discovered.id;
    });

    final smartwatchService = ref.read(smartwatchServiceProvider);
    final success = await smartwatchService.connect(discovered.device);

    if (!mounted) return;
    setState(() {
      _connectingId = null;
    });

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Connected to ${discovered.name}!'),
          backgroundColor: AppColors.success,
        ),
      );
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Could not connect to ${discovered.name}. Ensure watch is nearby and unpaired from other apps.'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Discover Any Smartwatch & Wearable'),
        actions: [
          IconButton(
            icon: Icon(_isScanning ? Icons.stop : Icons.refresh),
            onPressed: _isScanning ? null : _startScan,
          ),
        ],
      ),
      body: Column(
        children: [
          // Banner
          Container(
            padding: const EdgeInsets.all(16),
            color: AppColors.primaryLight,
            child: Row(
              children: [
                const Icon(Icons.bluetooth_searching, color: AppColors.primary, size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Searching for Smartwatches & Wearables...',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryDark,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        _isScanning
                            ? 'Keep your watch awake and within Bluetooth range.'
                            : 'Scanning complete. Tap a device to pair.',
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                if (_isScanning)
                  const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                  ),
              ],
            ),
          ),

          // Device list
          Expanded(
            child: _devices.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.watch,
                            size: 48,
                            color: AppColors.textMuted.withValues(alpha: 0.5),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            _isScanning ? 'Scanning for nearby smartwatches & trackers...' : 'No smartwatches detected',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Ensure Bluetooth is enabled and your smartwatch or fitness band is powered on and within range.',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                          ),
                          if (!_isScanning) ...[
                            const SizedBox(height: 16),
                            ElevatedButton.icon(
                              onPressed: _startScan,
                              icon: const Icon(Icons.refresh, size: 18),
                              label: const Text('Scan Again'),
                            ),
                          ],
                        ],
                      ),
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _devices.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final item = _devices[index];
                      final isConnectingThis = _connectingId == item.id;
                      final brand = DeviceBrand.detectFromName(item.name);

                      return Card(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 1,
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          leading: CircleAvatar(
                            backgroundColor: brand.brandColor.withValues(alpha: 0.15),
                            child: Icon(
                              brand.iconData,
                              color: brand.brandColor,
                            ),
                          ),
                          title: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  item.name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: brand.brandColor.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  brand.displayName,
                                  style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: brand.brandColor),
                                ),
                              ),
                            ],
                          ),
                          subtitle: Text(
                            'ID: ${item.id} • Signal: ${item.rssi} dBm',
                            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                          ),
                          trailing: isConnectingThis
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                                )
                              : ElevatedButton(
                                  onPressed: () => _connectDevice(item),
                                  style: ElevatedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                    textStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                                  ),
                                  child: const Text('Pair'),
                                ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
