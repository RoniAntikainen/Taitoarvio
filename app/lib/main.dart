import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/settings/settings_controller.dart';
import 'features/onboarding/onboarding_screen.dart';
import 'shell.dart';

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settingsAsync = ref.watch(settingsProvider);

    return MaterialApp(
      title: 'Taitoarvio',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true),
      home: settingsAsync.when(
        loading: () => const Scaffold(body: Center(child: CircularProgressIndicator())),
        error: (e, _) => Scaffold(body: Center(child: Text('Init error: $e'))),
        data: (s) => s.isOnboarded ? const AppShell() : const OnboardingScreen(),
      ),
    );
  }
}
