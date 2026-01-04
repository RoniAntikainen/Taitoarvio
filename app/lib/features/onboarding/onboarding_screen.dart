import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/settings/app_settings.dart';
import '../../core/settings/settings_controller.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  AppRole _role = AppRole.coach;
  final _nameCtrl = TextEditingController();
  String _discipline = 'Paritanssi';

  @override
  void dispose() {
    _nameCtrl.dispose();
    super.dispose();
  }

  bool get _canSave => _nameCtrl.text.trim().isNotEmpty;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Aloitus')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Kuka olet?', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          RadioListTile(
            title: const Text('Valmentaja'),
            value: AppRole.coach,
            groupValue: _role,
            onChanged: (v) => setState(() => _role = v!),
          ),
          RadioListTile(
            title: const Text('Oppilas'),
            value: AppRole.student,
            groupValue: _role,
            onChanged: (v) => setState(() => _role = v!),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _nameCtrl,
            decoration: InputDecoration(
              labelText: _role == AppRole.coach ? 'Nimesi (valmentaja)' : 'Nimesi (oppilas)',
              border: const OutlineInputBorder(),
            ),
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            value: _discipline,
            decoration: const InputDecoration(
              labelText: 'Laji',
              border: OutlineInputBorder(),
            ),
            items: const [
              DropdownMenuItem(value: 'Paritanssi', child: Text('Paritanssi')),
              DropdownMenuItem(value: 'Soolotanssi', child: Text('Soolotanssi')),
              DropdownMenuItem(value: 'Muu', child: Text('Muu')),
            ],
            onChanged: (v) => setState(() => _discipline = v ?? _discipline),
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _canSave
                ? () async {
                    await ref.read(settingsProvider.notifier).completeOnboarding(
                          role: _role,
                          userName: _nameCtrl.text.trim(),
                          discipline: _discipline,
                        );
                  }
                : null,
            child: const Text('Jatka'),
          ),
        ],
      ),
    );
  }
}
