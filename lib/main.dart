import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:provider/provider.dart' as provider;
import 'providers/auth_provider.dart';
import 'providers/life_stage_provider.dart';
import 'app/app.dart';
export 'app/app.dart';

import 'services/health_connect_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);
  try {
    await HealthConnectService().init();
  } catch (_) {}
  runApp(
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
}
