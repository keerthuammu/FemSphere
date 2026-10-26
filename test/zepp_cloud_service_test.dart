import 'package:flutter_test/flutter_test.dart';
import 'package:encrypt/encrypt.dart';
import 'package:http/http.dart' as http;

void main() {
  test('Zepp Cloud encryption and 303 response test', () async {
    final key = Key.fromUtf8('xeNtBVqzDc6tuNTh');
    final iv = IV.fromUtf8('MAAAYAAAAAAAAABg');
    final encrypter = Encrypter(AES(key, mode: AESMode.cbc));

    final query = 'emailOrPhone=test%40example.com&state=REDIRECTION&client_id=HuaMi&password=testpassword123&redirect_uri=https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fhm-registration%2Fsuccesssignin.html&region=us-west-2&country_code=US&token=access&token=refresh';
    final encrypted = encrypter.encrypt(query, iv: iv);

    final request = http.Request('POST', Uri.parse('https://api-user-us2.zepp.com/v2/registrations/tokens'))
      ..followRedirects = false
      ..headers.addAll({
        'app_name': 'com.huami.midong',
        'appname': 'com.huami.midong',
        'cv': '151689_9.12.5',
        'v': '2.0',
        'appplatform': 'android_phone',
        'vb': '202509151347',
        'vn': '9.12.5',
        'user-agent': 'Zepp/9.12.5 (Pixel 4; Android 12; Density/2.75)',
        'x-hm-ekv': '1',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      })
      ..bodyBytes = encrypted.bytes;

    final streamedResponse = await request.send();
    expect(streamedResponse.statusCode, 303);
    final location = streamedResponse.headers['location'];
    expect(location, isNotNull);
    expect(location, contains('successsignin.html'));
    print('✅ Zepp 303 Location received in Dart: $location');
  });
}
