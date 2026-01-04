import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../app.dart';
import 'quick_assessment_card.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final repo = ref.watch(assessmentRepoProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Etusivu'),
        actions: [
          IconButton(
            tooltip: 'Import .evalpack',
            icon: const Icon(Icons.file_upload_outlined),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Import löytyy Kirjasto-sivulta (toistaiseksi).'),
                ),
              );
            },
          ),
        ],
      ),
      body: FutureBuilder(
        future: repo.list(),
        builder: (context, snapshot) {
          final all = snapshot.data ?? const [];
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          final recent = all.take(5).toList();

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // ✅ Tämä on se “vaivaton yhden sivun arviointi”
              const QuickAssessmentCard(),
              const SizedBox(height: 16),

              Text(
                'Viimeisimmät',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 10),

              if (recent.isEmpty)
                const _EmptyCard(
                  text: 'Ei arviointeja vielä. Tee arviointi yllä tai importtaa evalpack kirjastosta.',
                )
              else
                ...recent.map(
                  (a) => Card(
                    child: ListTile(
                      title: Text(a.subjectName ?? 'Arviointi'),
                      subtitle: Text('Arvioija: ${a.evaluatorName ?? '-'}'),
                      trailing: IconButton(
                        icon: const Icon(Icons.share_outlined),
                        onPressed: () async {
                          final exporter = ref.read(exporterProvider);
                          await exporter.shareAssessment(a.id);
                        },
                      ),
                    ),
                  ),
                ),

              const SizedBox(height: 24),
              const _InfoCard(),
            ],
          );
        },
      ),
    );
  }
}

class _EmptyCard extends StatelessWidget {
  const _EmptyCard({required this.text});
  final String text;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text(text),
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  const _InfoCard();

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Text(
          'Etusivu = nopea arviointi + viimeisimmät. Kirjasto = koko lista + import. '
          'Seuraavaksi lisätään kansiot (oppilas/arvioija) ja haku.',
        ),
      ),
    );
  }
}
