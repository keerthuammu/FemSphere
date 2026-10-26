import 'dart:typed_data';
import 'package:pointycastle/api.dart';
import 'package:pointycastle/block/aes.dart';
import 'package:pointycastle/block/modes/ecb.dart';

/// AES-128-ECB cipher for Huami / Amazfit BLE authentication using PointyCastle.
class HuamiAes {
  /// Encrypt a single 16-byte block with a 16-byte key using AES-128-ECB NoPadding
  static Uint8List encryptBlock(Uint8List block, Uint8List key) {
    assert(block.length == 16, 'Block must be 16 bytes');
    assert(key.length == 16, 'Key must be 16 bytes');

    final cipher = ECBBlockCipher(AESEngine());
    cipher.init(true, KeyParameter(key));
    final out = Uint8List(16);
    cipher.processBlock(block, 0, out, 0);
    return out;
  }
}
