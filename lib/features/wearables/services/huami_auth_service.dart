import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/huami_aes.dart';

/// Huami / Amazfit Cryptographic BLE Authentication Service (Gadgetbridge-compatible)
/// Enables direct BLE communication with Amazfit Bip U Pro, GTR, GTS, Band devices WITHOUT the Zepp app.
class HuamiAuthService {
  static const String authServiceUuid = '0000fee1-0000-1000-8000-00805f9b34fb';
  static const String authCharUuid = '00000009-0000-3512-2118-0009af100700';

  static const String prefKeyPrefix = 'huami_auth_key_';

  /// Save 16-byte (32 hex char) Auth Key for a specific watch MAC
  static Future<void> saveAuthKey(String remoteId, String hexKey) async {
    final cleanKey = hexKey.trim().replaceAll('0x', '').replaceAll(':', '').replaceAll(' ', '').toLowerCase();
    if (cleanKey.length != 32) {
      throw ArgumentError('Auth Key must be exactly 32 hex characters (16 bytes).');
    }
    final prefs = await SharedPreferences.getInstance();
    final lowerId = remoteId.toLowerCase();
    await prefs.setString('$prefKeyPrefix$lowerId', cleanKey);
    await prefs.setString('$prefKeyPrefix${lowerId.replaceAll(':', '').replaceAll('-', '')}', cleanKey);
    await prefs.setString('${prefKeyPrefix}latest', cleanKey);
    debugPrint('🔑 Huami Auth Key saved for device $remoteId: $cleanKey');
  }

  /// Retrieve saved Auth Key for a device
  static Future<String?> getSavedAuthKey(String remoteId) async {
    final prefs = await SharedPreferences.getInstance();
    final lowerId = remoteId.toLowerCase();
    return prefs.getString('$prefKeyPrefix$lowerId') ??
        prefs.getString('$prefKeyPrefix${lowerId.replaceAll(':', '').replaceAll('-', '')}') ??
        prefs.getString('${prefKeyPrefix}latest');
  }

  /// Convert 32-hex string into 16-byte Uint8List
  static Uint8List hexToBytes(String hex) {
    final clean = hex.trim().replaceAll('0x', '').replaceAll(':', '').replaceAll(' ', '');
    final result = Uint8List(clean.length ~/ 2);
    for (int i = 0; i < clean.length; i += 2) {
      result[i ~/ 2] = int.parse(clean.substring(i, i + 2), radix: 16);
    }
    return result;
  }

  /// Perform the 3-step Huami AES-128 handshake over Bluetooth LE
  static Future<bool> performHandshake({
    required BluetoothDevice device,
    required List<BluetoothService> services,
    String? providedHexKey,
  }) async {
    try {
      final keyHex = providedHexKey ?? await getSavedAuthKey(device.remoteId.str);
      if (keyHex == null || keyHex.length != 32) {
        debugPrint('ℹ️ No 16-byte Huami Auth Key found for ${device.remoteId.str}. Protected GATT characteristics will require auth key or Match Watch.');
        return false;
      }

      final keyBytes = hexToBytes(keyHex);

      // Locate Auth Characteristic (00000009 under fee1)
      BluetoothCharacteristic? authChar;
      for (final s in services) {
        final sUuid = s.uuid.toString().toLowerCase();
        if (sUuid.contains('fee1') || sUuid.contains('fee0')) {
          for (final c in s.characteristics) {
            if (c.uuid.toString().toLowerCase().contains('0009')) {
              authChar = c;
              break;
            }
          }
        }
        if (authChar != null) break;
      }

      if (authChar == null) {
        debugPrint('⚠️ Huami Auth Characteristic 00000009 not found on device.');
        return false;
      }

      debugPrint('🔐 Starting Huami BLE Authentication Handshake on ${device.platformName}...');

      final completer = Completer<bool>();
      StreamSubscription? sub;
      int flagUsed = 0x08;

      Future<void> writeSafe(List<int> bytes) async {
        final useWithoutResponse = authChar!.properties.writeWithoutResponse || !authChar.properties.write;
        await authChar.write(bytes, withoutResponse: useWithoutResponse);
      }

      // Listen to Auth Notifications
      sub = authChar.onValueReceived.listen((data) async {
        if (data.isEmpty) return;

        debugPrint('📡 Huami Auth Rx: $data');

        // Response 1: After Request Challenge [0x10, 0x02, 0x01/0x81, ...16 bytes nonce...]
        if (data.length >= 19 && data[0] == 0x10 && data[1] == 0x02 && (data[2] == 0x01 || data[2] == 0x81)) {
          final nonce = Uint8List.fromList(data.sublist(3, 19));
          debugPrint('🎲 Received 16-byte Nonce from watch. Encrypting with AES-128-ECB...');

          final encryptedNonce = HuamiAes.encryptBlock(nonce, keyBytes);

          // Step 3: Send encrypted nonce [0x03, flag, ...encryptedNonce...]
          final reply = Uint8List(18);
          reply[0] = 0x03;
          reply[1] = flagUsed;
          reply.setRange(2, 18, encryptedNonce);

          debugPrint('📤 Sending AES-128 encrypted challenge response to watch...');
          await writeSafe(reply);
        }
        // Response 2: Authentication Success [0x10, 0x03, 0x01]
        else if (data.length >= 3 && data[0] == 0x10 && data[1] == 0x03 && data[2] == 0x01) {
          debugPrint('✅ Huami BLE Authentication SUCCESS! Device unlocked.');
          if (!completer.isCompleted) completer.complete(true);
        }
        // Response 3: Authentication Failed
        else if (data.length >= 3 && data[0] == 0x10 && data[1] == 0x03 && data[2] != 0x01) {
          debugPrint('❌ Huami BLE Authentication note (Code: ${data[2]}).');
          if (flagUsed == 0x08) {
            // Try fallback flag 0x00
            flagUsed = 0x00;
            debugPrint('🔄 Retrying challenge with legacy flag 0x00...');
            await writeSafe([0x02, 0x00]);
          } else {
            if (!completer.isCompleted) completer.complete(false);
          }
        }
      });

      // Enable notifications on Auth Characteristic
      await authChar.setNotifyValue(true);

      // Step 2: Request random challenge nonce [0x02, flag]
      debugPrint('📤 Requesting random challenge nonce from watch with flag 0x08...');
      await writeSafe([0x02, 0x08]);

      // Wait up to 6 seconds for complete handshake
      final success = await completer.future.timeout(
        const Duration(seconds: 6),
        onTimeout: () {
          debugPrint('⏱️ Huami Auth Handshake timed out.');
          return false;
        },
      );

      await sub.cancel();
      return success;
    } catch (e) {
      debugPrint('Error during Huami BLE Auth Handshake: $e');
      return false;
    }
  }
}
