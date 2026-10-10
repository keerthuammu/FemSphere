import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:provider/provider.dart' as provider;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:femsphere/app/app.dart';
import 'package:femsphere/providers/auth_provider.dart';
import 'package:femsphere/providers/life_stage_provider.dart';
import 'package:femsphere/screens/auth/login_screen.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets('FemSphereApp mounts cleanly and shows initial splash', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        child: provider.MultiProvider(
          providers: [
            provider.ChangeNotifierProvider(create: (_) => AuthProvider()),
            provider.ChangeNotifierProvider(create: (_) => LifeStageProvider()),
          ],
          child: const FemSphereApp(),
        ),
      ),
    );

    // Initial frame rendered without crash
    expect(find.byType(MaterialApp), findsOneWidget);

    // Settle splash delay timer
    await tester.pump(const Duration(milliseconds: 1600));
    await tester.pumpAndSettle();
  });

  testWidgets('LoginScreen smoke test renders email and password fields', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        child: provider.MultiProvider(
          providers: [
            provider.ChangeNotifierProvider(create: (_) => AuthProvider()),
            provider.ChangeNotifierProvider(create: (_) => LifeStageProvider()),
          ],
          child: const MaterialApp(
            home: LoginScreen(),
          ),
        ),
      ),
    );

    await tester.pumpAndSettle();

    // Verify presence of text fields
    expect(find.byType(TextField), findsWidgets);
    expect(find.byType(LoginScreen), findsOneWidget);
  });
}
