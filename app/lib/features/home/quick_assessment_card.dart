import 'dart:convert';

import 'package:drift/drift.dart' show Value, Insertable;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

import '../../app.dart';
import '../../core/settings/app_settings.dart';
import '../../core/settings/settings_controller.dart';
import '../../data/db/app_database.dart';

class QuickAssessmentCard extends ConsumerStatefulWidget {
  const QuickAssessmentCard({super.key});

  @override
  ConsumerState<QuickAssessmentCard> createState() => _QuickAssessmentCardState();
}

class _QuickAssessmentCardState extends ConsumerState<QuickAssessmentCard> {
  final _uuid = const Uuid();

  final _subjectCtrl = TextEditingController();
  int _scaleMin = 0;
  int _scaleMax = 5;

  String _area = 'Valssi';

  late List<_CriterionRow> _criteria = _buildCriteria('Paritanssi', _area);

  @override
  void dispose() {
    _subjectCtrl.dispose();
    super.dispose();
  }

  List<_CriterionRow> _buildCriteria(String discipline, String area) {
    // PLACEHOLDERS – vaihdat myöhemmin omiksi
    return [
      _CriterionRow(id: 'rhythm', title: 'Rytmi'),
      _CriterionRow(id: 'timing', title: 'Ajoitus'),
      _CriterionRow(id: 'posture', title: 'Ryhti'),
      _CriterionRow(id: 'frame', title: 'Kehys'),
    ];
  }

  bool get _canSubmit => _subjectCtrl.text.trim().isNotEmpty;

  Future<String> _saveAssessment({
    required AppSettings settings,
  }) async {
    final db = ref.read(dbProvider);

    final now = DateTime.now().millisecondsSinceEpoch;
    final rubricId = _uuid.v4();
    final assessmentId = _uuid.v4();

    final evaluator = settings.userName.trim();
    final subject = _subjectCtrl.text.trim();

    final folderKey = (settings.role == AppRole.coach) ? subject : evaluator;
    final scaleJson = jsonEncode({'min': _scaleMin, 'max': _scaleMax});

    final rubricSchema = jsonEncode({
      'id': rubricId,
      'title': '${settings.discipline} — $_area',
      'version': 1,
      'discipline': settings.discipline,
      'area': _area,
      'scale': {'min': _scaleMin, 'max': _scaleMax},
      'criteria': _criteria.map((c) => {'id': c.id, 'title': c.title}).toList(),
    });

    await db.upsertRubric(
      RubricsCompanion.insert(
        id: rubricId,
        title: '${settings.discipline} — $_area',
        origin: 'local',
        version: 1,
        schema: rubricSchema,
        updatedAt: now,
        discipline: Value(settings.discipline),
      ),
    );

    await db.upsertAssessment(
      AssessmentsCompanion.insert(
        id: assessmentId,
        rubricId: rubricId,
        rubricSnapshot: rubricSchema,
        discipline: Value(settings.discipline),
        evaluatorName: Value(evaluator),
        subjectName: Value(subject),
        tags: Value.absent(),
        scaleJson: Value(scaleJson),
        summaryNote: const Value(''),
        createdAt: now,
        updatedAt: now,
        importFingerprint: Value.absent(),
        folderKey: Value(folderKey),
      ),
    );

    final List<Insertable<Answer>> answers =
        _criteria.map<Insertable<Answer>>((c) {
      return AnswersCompanion.insert(
        id: _uuid.v4(),
        assessmentId: assessmentId,
        criterionId: c.id,
        value: Value(c.score == null ? '' : c.score.toString()),
        comment: Value(c.comment.trim()),
      );
    }).toList();

    await db.replaceAnswers(assessmentId, answers);

    return assessmentId;
  }

  Future<void> _saveOnly(AppSettings settings) async {
    final id = await _saveAssessment(settings: settings);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Tallennettu ($id)')),
    );
  }

  Future<void> _saveAndShare(AppSettings settings) async {
    // 1) Always save first
    final id = await _saveAssessment(settings: settings);

    // 2) Export/share
    final exporter = ref.read(exporterProvider);
    await exporter.shareAssessment(id);

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Tallennettu ja jaettu')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final settingsAsync = ref.watch(settingsProvider);

    return settingsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Text('Asetusvirhe: $e'),
      data: (settings) {
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Nopea arviointi', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 8),
                Text(
                  settings.role == AppRole.coach
                      ? 'Arvioijana: ${settings.userName}'
                      : 'Oppilaana: ${settings.userName}',
                ),
                const SizedBox(height: 12),

                TextField(
                  controller: _subjectCtrl,
                  decoration: InputDecoration(
                    labelText: settings.role == AppRole.coach ? 'Arvioitava (oppilas)' : 'Valmentaja',
                    border: const OutlineInputBorder(),
                  ),
                  onChanged: (_) => setState(() {}),
                ),
                const SizedBox(height: 12),

                // Scale picker
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: [
                    ChoiceChip(
                      label: const Text('0–5'),
                      selected: _scaleMin == 0 && _scaleMax == 5,
                      onSelected: (_) => setState(() {
                        _scaleMin = 0;
                        _scaleMax = 5;
                      }),
                    ),
                    ChoiceChip(
                      label: const Text('0–10'),
                      selected: _scaleMin == 0 && _scaleMax == 10,
                      onSelected: (_) => setState(() {
                        _scaleMin = 0;
                        _scaleMax = 10;
                      }),
                    ),
                    ChoiceChip(
                      label: const Text('Custom'),
                      selected: !((_scaleMin == 0 && _scaleMax == 5) || (_scaleMin == 0 && _scaleMax == 10)),
                      onSelected: (_) => _showCustomScaleDialog(),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Discipline + area
                DropdownButtonFormField<String>(
                  value: settings.discipline,
                  decoration: const InputDecoration(
                    labelText: 'Laji',
                    border: OutlineInputBorder(),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'Paritanssi', child: Text('Paritanssi')),
                    DropdownMenuItem(value: 'Soolotanssi', child: Text('Soolotanssi')),
                    DropdownMenuItem(value: 'Muu', child: Text('Muu')),
                  ],
                  onChanged: (v) async {
                    final d = v ?? settings.discipline;
                    await ref.read(settingsProvider.notifier).updateDiscipline(d);
                    setState(() => _criteria = _buildCriteria(d, _area));
                  },
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: _area,
                  decoration: const InputDecoration(
                    labelText: 'Osa-alue',
                    border: OutlineInputBorder(),
                  ),
                  items: const [
                    DropdownMenuItem(value: 'Valssi', child: Text('Valssi')),
                    DropdownMenuItem(value: 'Quickstep', child: Text('Quickstep')),
                    DropdownMenuItem(value: 'Wienervalssi', child: Text('Wienervalssi')),
                    DropdownMenuItem(value: 'Placeholder', child: Text('Placeholder')),
                  ],
                  onChanged: (v) {
                    setState(() {
                      _area = v ?? _area;
                      _criteria = _buildCriteria(settings.discipline, _area);
                    });
                  },
                ),
                const SizedBox(height: 12),

                // Criteria list (quick)
                ..._criteria.map((c) => _CriterionTile(
                      title: c.title,
                      min: _scaleMin,
                      max: _scaleMax,
                      value: c.score,
                      onSelect: (v) => setState(() => c.score = v),
                      onComment: (t) => c.comment = t,
                    )),

                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _canSubmit ? () => _saveOnly(settings) : null,
                        child: const Text('Tallenna'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: FilledButton.icon(
                        onPressed: _canSubmit ? () => _saveAndShare(settings) : null,
                        icon: const Icon(Icons.share_outlined),
                        label: const Text('Jaa'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _showCustomScaleDialog() async {
    final minCtrl = TextEditingController(text: _scaleMin.toString());
    final maxCtrl = TextEditingController(text: _scaleMax.toString());

    final res = await showDialog<(int, int)>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Custom mittakaava'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: minCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Min'),
              ),
              TextField(
                controller: maxCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Max'),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Peruuta')),
            FilledButton(
              onPressed: () {
                final min = int.tryParse(minCtrl.text) ?? _scaleMin;
                final max = int.tryParse(maxCtrl.text) ?? _scaleMax;
                Navigator.pop(context, (min, max));
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );

    if (res != null) {
      setState(() {
        _scaleMin = res.$1;
        _scaleMax = res.$2;
      });
    }
  }
}

class _CriterionRow {
  _CriterionRow({required this.id, required this.title});
  final String id;
  final String title;
  int? score;
  String comment = '';
}

class _CriterionTile extends StatelessWidget {
  const _CriterionTile({
    required this.title,
    required this.min,
    required this.max,
    required this.value,
    required this.onSelect,
    required this.onComment,
  });

  final String title;
  final int min;
  final int max;
  final int? value;
  final ValueChanged<int> onSelect;
  final ValueChanged<String> onComment;

  @override
  Widget build(BuildContext context) {
    final options = List.generate(max - min + 1, (i) => min + i);

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 6),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: options.map((v) {
              return ChoiceChip(
                label: Text('$v'),
                selected: value == v,
                onSelected: (_) => onSelect(v),
              );
            }).toList(),
          ),
          const SizedBox(height: 8),
          TextField(
            decoration: const InputDecoration(
              labelText: 'Kommentti (valinnainen)',
              border: OutlineInputBorder(),
            ),
            onChanged: onComment,
          ),
        ],
      ),
    );
  }
}
