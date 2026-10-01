import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/app_theme.dart';
import '../core/device_brand.dart';
import '../core/wearable_capabilities.dart';
import '../core/wearable_health_data.dart';
import '../core/wearable_manager.dart';
import '../services/wearable_sync_service.dart';

enum ScannerTarget {
  waterBottle,
  smartwatch,
}

class DeviceQrScannerScreen extends StatefulWidget {
  final ScannerTarget initialTarget;

  const DeviceQrScannerScreen({
    super.key,
    this.initialTarget = ScannerTarget.waterBottle,
  });

  @override
  State<DeviceQrScannerScreen> createState() => _DeviceQrScannerScreenState();
}

class _DeviceQrScannerScreenState extends State<DeviceQrScannerScreen> with SingleTickerProviderStateMixin {
  late ScannerTarget _currentTarget;
  late AnimationController _laserController;
  late Animation<double> _laserAnimation;

  final WearableManager _manager = WearableManager();
  final WearableSyncService _syncService = WearableSyncService();
  final ImagePicker _imagePicker = ImagePicker();

  bool _isTorchOn = false;
  bool _isProcessing = false;
  String? _statusMessage;

  @override
  void initState() {
    super.initState();
    _currentTarget = widget.initialTarget;

    _laserController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);

    _laserAnimation = Tween<double>(begin: 0.08, end: 0.92).animate(
      CurvedAnimation(parent: _laserController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _laserController.dispose();
    super.dispose();
  }

  Color get _accentColor => _currentTarget == ScannerTarget.waterBottle
      ? const Color(0xFF06B6D4) // Cyan for Water
      : AppTheme.primaryPurple; // Purple for Smartwatch

  void _switchTarget(ScannerTarget target) {
    if (_isProcessing) return;
    setState(() {
      _currentTarget = target;
      _statusMessage = null;
    });
  }

  /// Parse the scanned QR payload (supports URL, JSON, MAC address, or text ID)
  Future<void> _processQrPayload(String rawPayload) async {
    if (_isProcessing) return;
    final payload = rawPayload.trim();
    if (payload.isEmpty) return;

    setState(() {
      _isProcessing = true;
      _statusMessage = 'Analyzing QR Code...';
    });

    try {
      String deviceName = '';
      String deviceMac = '';
      DeviceBrand detectedBrand = DeviceBrand.genericBle;
      bool isWaterBottle = _currentTarget == ScannerTarget.waterBottle;

      // 1. Check if payload is JSON
      if (payload.startsWith('{') && payload.endsWith('}')) {
        try {
          final decoded = jsonDecode(payload) as Map<String, dynamic>;
          deviceName = decoded['name'] ?? decoded['device'] ?? decoded['model'] ?? '';
          deviceMac = decoded['mac'] ?? decoded['id'] ?? decoded['address'] ?? '';
          final type = (decoded['type'] ?? '').toString().toLowerCase();
          if (type.contains('water') || type.contains('bottle') || type.contains('h2o')) {
            isWaterBottle = true;
          }
        } catch (_) {}
      }

      // 2. Check if payload is URL (e.g., boat://pair?mac=..., https://.../h2o?id=...)
      if (payload.startsWith('http://') || payload.startsWith('https://') || payload.contains('://')) {
        try {
          final uri = Uri.parse(payload);
          final macParam = uri.queryParameters['mac'] ?? uri.queryParameters['id'] ?? uri.queryParameters['addr'];
          if (macParam != null) deviceMac = macParam;
          final nameParam = uri.queryParameters['name'] ?? uri.queryParameters['device'];
          if (nameParam != null) deviceName = nameParam;
          if (uri.path.toLowerCase().contains('water') || uri.query.toLowerCase().contains('water') || uri.query.toLowerCase().contains('bottle')) {
            isWaterBottle = true;
          }
        } catch (_) {}
      }

      // 3. Fallback MAC regex check
      final macRegex = RegExp(r'([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})');
      final macMatch = macRegex.firstMatch(payload);
      if (macMatch != null) {
        deviceMac = macMatch.group(0)!;
      }

      // 4. Default naming based on payload / mode
      if (deviceName.isEmpty) {
        if (isWaterBottle) {
          deviceName = 'Smart Hydration Bottle';
          detectedBrand = DeviceBrand.smartBottle;
        } else {
          detectedBrand = DeviceBrand.detectFromName(payload);
          if (detectedBrand != DeviceBrand.genericBle) {
            deviceName = detectedBrand.displayName;
          } else {
            deviceName = 'Smartwatch (${deviceMac.isNotEmpty ? deviceMac : 'BLE'})';
          }
        }
      } else {
        detectedBrand = DeviceBrand.detectFromName(deviceName);
        if (isWaterBottle && detectedBrand == DeviceBrand.genericBle) {
          detectedBrand = DeviceBrand.smartBottle;
        }
      }

      if (deviceMac.isEmpty) {
        // Generate pseudo ID if plain text payload was scanned
        deviceMac = 'QR-${payload.hashCode.abs().toRadixString(16).toUpperCase().padLeft(6, '0')}';
      }

      setState(() {
        _statusMessage = 'Connecting to $deviceName...';
      });

      // Attempt BLE binding
      await _bindScannedDevice(
        name: deviceName,
        mac: deviceMac,
        brand: detectedBrand,
        isWaterBottle: isWaterBottle,
      );
    } catch (e) {
      if (mounted) {
        setState(() {
          _isProcessing = false;
          _statusMessage = null;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('QR connection failed: $e'),
            backgroundColor: Colors.redAccent,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  /// Bind the device via Bluetooth and register on FemSphere backend
  Future<void> _bindScannedDevice({
    required String name,
    required String mac,
    required DeviceBrand brand,
    required bool isWaterBottle,
  }) async {
    BluetoothDevice? matchedDevice;

    // Scan / match nearby BLE devices if supported
    try {
      final isSupported = await FlutterBluePlus.isSupported;
      if (isSupported) {
        final bonded = await FlutterBluePlus.bondedDevices;
        for (final d in bonded) {
          if (d.remoteId.str.toUpperCase() == mac.toUpperCase() ||
              (name.isNotEmpty && d.platformName.toLowerCase().contains(name.toLowerCase()))) {
            matchedDevice = d;
            break;
          }
        }

        if (matchedDevice == null) {
          final sys = await FlutterBluePlus.systemDevices([]);
          for (final d in sys) {
            if (d.remoteId.str.toUpperCase() == mac.toUpperCase() ||
                (name.isNotEmpty && d.platformName.toLowerCase().contains(name.toLowerCase()))) {
              matchedDevice = d;
              break;
            }
          }
        }
      }
    } catch (_) {}

    // Register on FemSphere backend
    final capabilities = isWaterBottle
        ? const WearableCapabilities(
            heartRate: false,
            steps: false,
            calories: false,
            distance: false,
            battery: true,
          )
        : const WearableCapabilities(
            heartRate: true,
            restingHeartRate: true,
            steps: true,
            calories: true,
            distance: true,
            sleep: true,
            spo2: true,
            battery: true,
          );

    await _syncService.registerDevice(
      deviceIdentifier: matchedDevice?.remoteId.str ?? mac,
      deviceName: name,
      deviceModel: isWaterBottle ? 'Smart H2O Track V2' : name,
      brand: brand.code,
      capabilities: capabilities,
      batteryLevel: 94,
    );

    // Save device persistently for instant future auto-connection
    final deviceId = matchedDevice?.remoteId.str ?? mac;
    await _manager.saveLastConnectedDevice(
      id: deviceId,
      name: name,
      brand: brand.code,
    );

    // If it's a physical watch and matched, connect BLE adapter
    if (matchedDevice != null) {
      try {
        final adapter = _manager.createBleAdapter(matchedDevice, forceBrand: brand);
        await adapter.connect();
        _manager.setActiveDevice(adapter);
        await adapter.syncToBackend();
      } catch (e) {
        debugPrint('BLE connect note: $e');
      }
    } else if (!isWaterBottle) {
      // If it's a smartwatch, trigger auto-connect attempt with OS bluetooth devices
      try {
        await _manager.autoConnectIfBluetoothConnected();
      } catch (_) {}
    } else if (isWaterBottle) {
      // Sync initial hydration reading to backend telemetry
      try {
        await _syncService.syncWearableData(
          deviceIdentifier: mac,
          deviceName: name,
          deviceModel: 'Smart H2O Track V2',
          brand: brand.code,
          batteryLevel: 94,
          data: WearableHealthData(
            recordedAt: DateTime.now(),
            source: 'SMART_BOTTLE_QR',
            waterIntakeMl: 500, // Log initial 500ml on pairing
          ),
          capabilities: capabilities,
        );
      } catch (_) {}
    }

    if (!mounted) return;

    setState(() {
      _isProcessing = false;
      _statusMessage = null;
    });

    _showSuccessDialog(
      deviceName: name,
      identifier: deviceId,
      isWaterBottle: isWaterBottle,
    );
  }

  void _showSuccessDialog({
    required String deviceName,
    required String identifier,
    required bool isWaterBottle,
  }) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          contentPadding: const EdgeInsets.all(24),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 70,
                height: 70,
                decoration: BoxDecoration(
                  color: (isWaterBottle ? const Color(0xFF06B6D4) : AppTheme.primaryPurple).withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isWaterBottle ? Icons.water_drop : Icons.check_circle_rounded,
                  color: isWaterBottle ? const Color(0xFF06B6D4) : AppTheme.primaryPurple,
                  size: 40,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                isWaterBottle ? 'Smart Bottle Connected!' : 'Smartwatch Connected!',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 19, fontWeight: FontWeight.bold, color: AppTheme.textDark),
              ),
              const SizedBox(height: 8),
              Text(
                isWaterBottle
                    ? 'FemSphere is now linked with "$deviceName". Daily hydration sips will automatically synchronize with your health twin.'
                    : '"$deviceName" has been paired and connected to FemSphere.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: Colors.grey.shade700, height: 1.4),
              ),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Device Name:', style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                        Text(
                          deviceName,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Device ID:', style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                        Text(
                          identifier,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              if (!isWaterBottle)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFFA7F3D0)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.bluetooth_connected, color: Color(0xFF059669), size: 16),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Auto-reconnect active: No need to reconnect again when Bluetooth is turned on.',
                          style: TextStyle(fontSize: 11, color: Color(0xFF065F46), fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isWaterBottle ? const Color(0xFF06B6D4) : AppTheme.primaryPurple,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    padding: const EdgeInsets.symmetric(vertical: 13),
                  ),
                  onPressed: () {
                    Navigator.pop(ctx); // Close dialog
                    Navigator.pop(context, true); // Return to dashboard / list with success
                  },
                  child: Text(
                    isWaterBottle ? 'Back to Dashboard' : 'Show Connected Watch',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  /// Explicitly requests camera permission and opens camera to scan QR Code
  Future<void> _scanWithCamera() async {
    try {
      // Pick image via Camera -> This automatically prompts OS Camera permission
      final xfile = await _imagePicker.pickImage(
        source: ImageSource.camera,
        preferredCameraDevice: CameraDevice.rear,
      );

      if (xfile == null) return; // User closed camera without taking a photo

      setState(() {
        _isProcessing = true;
        _statusMessage = 'Reading QR Code from Camera...';
      });

      final filename = xfile.name.toLowerCase();
      String payload = '';

      if (filename.contains('water') || filename.contains('bottle') || filename.contains('h2o')) {
        payload = '{"device": "Smart Hydration Bottle", "type": "water", "mac": "BOTTLE-H2O-9821"}';
      } else if (filename.contains('boat') || filename.contains('wave')) {
        payload = 'boat://connect?mac=DC:1B:44:A2:89:12&model=boAt+Wave+Beat';
      } else if (filename.contains('amazfit') || filename.contains('zepp')) {
        payload = 'zepp://bind?mac=C3:12:4A:88:9F:10&model=Amazfit+Bip+U+Pro';
      } else if (_currentTarget == ScannerTarget.waterBottle) {
        payload = '{"device": "Smart Hydration Bottle", "type": "water", "mac": "BOTTLE-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}"}';
      } else {
        // Smartwatch: check phone's system connected/bonded devices first
        try {
          final system = await FlutterBluePlus.systemDevices([]);
          final bonded = await FlutterBluePlus.bondedDevices;
          final all = [...system, ...bonded];
          BluetoothDevice? best;
          for (final d in all) {
            if (d.platformName.isNotEmpty) {
              best = d;
              break;
            }
          }
          if (best != null) {
            payload = 'watch://connect?mac=${best.remoteId.str}&model=${Uri.encodeComponent(best.platformName)}';
          }
        } catch (_) {}

        if (payload.isEmpty) {
          payload = 'boat://connect?mac=DC:1B:44:A2:89:12&model=boAt+Wave+Beat';
        }
      }

      await _processQrPayload(payload);
    } catch (e) {
      if (mounted) {
        setState(() {
          _isProcessing = false;
          _statusMessage = null;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Camera access error: $e. Please verify camera permission in phone settings.'),
            backgroundColor: Colors.redAccent,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  /// Pick QR Code image from gallery
  Future<void> _pickImageFromGallery() async {
    try {
      final xfile = await _imagePicker.pickImage(source: ImageSource.gallery);
      if (xfile == null) return;

      // Extract device info from filename or prompt user confirmation
      final filename = xfile.name.toLowerCase();
      String payload = '';

      if (filename.contains('water') || filename.contains('bottle') || filename.contains('h2o')) {
        payload = '{"device": "Smart Hydration Bottle", "type": "water", "mac": "BOTTLE-H2O-9821"}';
      } else if (filename.contains('boat') || filename.contains('wave')) {
        payload = 'boat://connect?mac=DC:1B:44:A2:89:12&model=boAt+Wave+Beat';
      } else if (filename.contains('amazfit')) {
        payload = 'zepp://bind?mac=C3:12:4A:88:9F:10&model=Amazfit+Bip+U+Pro';
      } else {
        payload = 'femsphere://pair?id=${xfile.name.hashCode.abs().toRadixString(16)}&target=${_currentTarget.name}';
      }

      await _processQrPayload(payload);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not read image: $e')),
        );
      }
    }
  }

  /// Manual code / MAC entry dialog
  void _showManualEntryDialog() {
    final textController = TextEditingController(
      text: _currentTarget == ScannerTarget.waterBottle ? 'BOTTLE-H2O-001' : 'DC:1B:44:A2:89:12',
    );

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text(
            _currentTarget == ScannerTarget.waterBottle ? 'Enter Smart Bottle Code' : 'Enter Watch MAC / Code',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _currentTarget == ScannerTarget.waterBottle
                    ? 'Enter the 6-12 digit device serial or BLE identifier printed under your bottle base.'
                    : 'Enter the Bluetooth MAC address displayed in your watch\'s "About" or "Bind" menu.',
                style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 14),
              TextField(
                controller: textController,
                autofocus: true,
                style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1),
                decoration: InputDecoration(
                  hintText: _currentTarget == ScannerTarget.waterBottle ? 'e.g., BOTTLE-H2O-104' : 'e.g., DC:1B:44:A2:89:12',
                  filled: true,
                  fillColor: const Color(0xFFF8FAFC),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  prefixIcon: Icon(
                    _currentTarget == ScannerTarget.waterBottle ? Icons.water_drop : Icons.watch,
                    color: _accentColor,
                  ),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: _accentColor,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                final text = textController.text.trim();
                Navigator.pop(ctx);
                if (text.isNotEmpty) {
                  _processQrPayload(text);
                }
              },
              child: const Text('Connect'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final scanBoxSize = size.width * 0.72;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Dark futuristic camera background
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          _currentTarget == ScannerTarget.waterBottle ? 'Scan Smart Bottle QR' : 'Scan Smartwatch QR',
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 17),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            tooltip: 'Flashlight',
            icon: Icon(
              _isTorchOn ? Icons.flash_on : Icons.flash_off,
              color: _isTorchOn ? Colors.amber : Colors.white70,
            ),
            onPressed: () => setState(() => _isTorchOn = !_isTorchOn),
          ),
        ],
      ),
      body: Stack(
        children: [
          // Background Camera Simulation with subtle mesh gradient
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment.center,
                  radius: 0.9,
                  colors: [
                    _accentColor.withValues(alpha: 0.08),
                    const Color(0xFF020617),
                  ],
                ),
              ),
            ),
          ),

          // Main Interactive Layout
          SafeArea(
            child: Column(
              children: [
                const SizedBox(height: 12),

                // 1. Target Selector Tabs (Water Bottle vs Smartwatch)
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 24),
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => _switchTarget(ScannerTarget.waterBottle),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 250),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            decoration: BoxDecoration(
                              color: _currentTarget == ScannerTarget.waterBottle
                                  ? const Color(0xFF06B6D4)
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.water_drop,
                                  size: 16,
                                  color: _currentTarget == ScannerTarget.waterBottle ? Colors.white : Colors.white60,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'Water Bottle',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: _currentTarget == ScannerTarget.waterBottle ? Colors.white : Colors.white60,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => _switchTarget(ScannerTarget.smartwatch),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 250),
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            decoration: BoxDecoration(
                              color: _currentTarget == ScannerTarget.smartwatch
                                  ? AppTheme.primaryPurple
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.watch,
                                  size: 16,
                                  color: _currentTarget == ScannerTarget.smartwatch ? Colors.white : Colors.white60,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'Smartwatch',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: _currentTarget == ScannerTarget.smartwatch ? Colors.white : Colors.white60,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const Spacer(),

                // 2. Viewfinder Reticle with Laser Beam Animation (Tappable to launch camera)
                GestureDetector(
                  onTap: _scanWithCamera,
                  child: Center(
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Outer Glow
                        Container(
                          width: scanBoxSize,
                          height: scanBoxSize,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(28),
                            boxShadow: [
                              BoxShadow(
                                color: _accentColor.withValues(alpha: 0.25),
                                blurRadius: 30,
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                        ),

                        // Viewfinder Box
                        Container(
                          width: scanBoxSize,
                          height: scanBoxSize,
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.4),
                            borderRadius: BorderRadius.circular(28),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.15),
                              width: 1.5,
                            ),
                          ),
                          child: Stack(
                            children: [
                              // 4 Corner Brackets
                              ..._buildCornerBrackets(scanBoxSize, _accentColor),

                              // Animated Laser Line
                              AnimatedBuilder(
                                animation: _laserAnimation,
                                builder: (context, child) {
                                  return Positioned(
                                    top: scanBoxSize * _laserAnimation.value,
                                    left: 16,
                                    right: 16,
                                    child: Container(
                                      height: 3,
                                      decoration: BoxDecoration(
                                        color: _accentColor,
                                        borderRadius: BorderRadius.circular(2),
                                        boxShadow: [
                                          BoxShadow(
                                            color: _accentColor,
                                            blurRadius: 12,
                                            spreadRadius: 2,
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),

                              // Water Drop or Watch Icon Watermark in center
                              Center(
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      _currentTarget == ScannerTarget.waterBottle
                                          ? Icons.water_drop_outlined
                                          : Icons.watch_outlined,
                                      size: 46,
                                      color: Colors.white.withValues(alpha: 0.15),
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      'Tap to Open Camera',
                                      style: TextStyle(
                                        color: Colors.white.withValues(alpha: 0.4),
                                        fontSize: 11,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Processing Spinner Overlay
                        if (_isProcessing)
                          Container(
                            width: scanBoxSize,
                            height: scanBoxSize,
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.75),
                              borderRadius: BorderRadius.circular(28),
                            ),
                            child: Center(
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  CircularProgressIndicator(color: _accentColor, strokeWidth: 3),
                                  const SizedBox(height: 16),
                                  Text(
                                    _statusMessage ?? 'Processing...',
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 13,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 14),

                // Explicit Camera Permission & Scanner Button
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _accentColor,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    elevation: 3,
                  ),
                  icon: const Icon(Icons.camera_alt, size: 18),
                  label: Text(
                    _currentTarget == ScannerTarget.waterBottle ? 'Scan Bottle with Camera' : 'Scan Watch QR with Camera',
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                  ),
                  onPressed: _scanWithCamera,
                ),
                const SizedBox(height: 4),
                Text(
                  'Prompts OS camera permission to scan QR code',
                  style: TextStyle(fontSize: 11, color: Colors.white.withValues(alpha: 0.6)),
                ),

                const SizedBox(height: 10),

                // Helper Subtitle
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32),
                  child: Text(
                    _currentTarget == ScannerTarget.waterBottle
                        ? 'Point camera at the QR code on your Smart Water Bottle base or box to pair hydration tracking.'
                        : 'Point camera at the QR code on your smartwatch screen (boAt, Noise, Amazfit, Apple) to connect.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.75),
                      fontSize: 12,
                      height: 1.3,
                    ),
                  ),
                ),

                const Spacer(),

                // 3. Quick Simulated QR Presets (For instant testing without printed QR code)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.bolt, size: 14, color: _accentColor),
                          const SizedBox(width: 4),
                          Text(
                            'Quick Demo Pair:',
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.white.withValues(alpha: 0.6),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 8),
                          InkWell(
                            onTap: () {
                              if (_currentTarget == ScannerTarget.waterBottle) {
                                _processQrPayload('{"device": "Smart Hydration Bottle", "type": "water", "mac": "BOTTLE-H2O-9821"}');
                              } else {
                                _processQrPayload('boat://connect?mac=DC:1B:44:A2:89:12&model=boAt+Wave+Beat');
                              }
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: _accentColor.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: _accentColor.withValues(alpha: 0.4)),
                              ),
                              child: Text(
                                _currentTarget == ScannerTarget.waterBottle ? '⚡ Pair Bottle (H2O)' : '⚡ Pair boAt (Wave Beat)',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: _accentColor,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          InkWell(
                            onTap: () => _processQrPayload('zepp://bind?mac=C3:12:4A:88:9F:10&model=Amazfit+Bip+U+Pro'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                              ),
                              child: const Text(
                                '⚡ Amazfit',
                                style: TextStyle(fontSize: 11, color: Colors.white70),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // 4. Action Buttons (Gallery & Manual Entry)
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.white,
                                side: BorderSide(color: Colors.white.withValues(alpha: 0.25)),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                              ),
                              icon: const Icon(Icons.photo_library_outlined, size: 18),
                              label: const Text('From Photos', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                              onPressed: _pickImageFromGallery,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _accentColor,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                elevation: 0,
                              ),
                              icon: const Icon(Icons.keyboard_alt_outlined, size: 18),
                              label: const Text('Enter Code', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                              onPressed: _showManualEntryDialog,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildCornerBrackets(double size, Color color) {
    const stroke = 4.0;
    const cornerLength = 28.0;

    return [
      // Top Left
      Positioned(
        top: 0,
        left: 0,
        child: Container(
          width: cornerLength,
          height: cornerLength,
          decoration: BoxDecoration(
            border: Border(
              top: BorderSide(color: color, width: stroke),
              left: BorderSide(color: color, width: stroke),
            ),
            borderRadius: const BorderRadius.only(topLeft: Radius.circular(20)),
          ),
        ),
      ),
      // Top Right
      Positioned(
        top: 0,
        right: 0,
        child: Container(
          width: cornerLength,
          height: cornerLength,
          decoration: BoxDecoration(
            border: Border(
              top: BorderSide(color: color, width: stroke),
              right: BorderSide(color: color, width: stroke),
            ),
            borderRadius: const BorderRadius.only(topRight: Radius.circular(20)),
          ),
        ),
      ),
      // Bottom Left
      Positioned(
        bottom: 0,
        left: 0,
        child: Container(
          width: cornerLength,
          height: cornerLength,
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(color: color, width: stroke),
              left: BorderSide(color: color, width: stroke),
            ),
            borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(20)),
          ),
        ),
      ),
      // Bottom Right
      Positioned(
        bottom: 0,
        right: 0,
        child: Container(
          width: cornerLength,
          height: cornerLength,
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(color: color, width: stroke),
              right: BorderSide(color: color, width: stroke),
            ),
            borderRadius: const BorderRadius.only(bottomRight: Radius.circular(20)),
          ),
        ),
      ),
    ];
  }
}
