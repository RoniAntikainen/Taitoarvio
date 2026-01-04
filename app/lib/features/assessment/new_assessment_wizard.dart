import 'dart:convert';

import 'package:drift/drift.dart' show Value, Insertable;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

import '../../app.dart';
import '../../data/db/app_database.dart';

enum AppRole { coach, student }

class NewAssessmentWizard extends ConsumerStatefulWidget {
  const NewAssessmentWizard({super.key});

  @override
  ConsumerState<NewAssessmentWizard> createState() => _NewAssessmentWizardState();
}

class _NewAssessmentWizardState extends ConsumerState<NewAssessmentWizard> {
  final _uuid = const Uuid();

  int _step = 0;

  // Step 1: role
  AppRole _role = AppRole.coach;

  // Step 2: names
  final _evaluatorCtrl = TextEditingController(text: 'Valmentaja');
  final _subjectCtrl = TextEditingController(text: 'Oppilas');

  // Step 3: scale
  int _scaleMin = 1;
  int _scaleMax = 5;

  // Step 4: discipline + area (placeholders)
  String _discipline = 'Paritanssi';
  String _area = 'Valssi';

  // Step 5: criteria answers
  late final List<_CriterionRow> _criteria = _buildPlaceholderCriteria();

  List<_CriterionRow> _buildPlaceholderCriteria() {
    // PLACEHOLDERS – vaihdat myöhemmin oikeiksi kategorioiksi
    return [
      _CriterionRow(id: 'rhythm', title: 'Rytmi'),
      _CriterionRow(id: 'timing', title: 'Ajoitus'),
      _CriterionRow(id: 'posture', title: 'Ryhti'),
      _CriterionRow(id: 'frame', title: 'Kehys'),
      _CriterionRow(id: 'flow', title: 'Liikkeen virtaus'),
    ];
  }

  @override
  void dispose() {
    _evaluatorCtrl.dispose();
    _subjectCtrl.dispose();
    super.dispose();
  }

  bool get _canContinue {
    if (_step == 1) {
      return _evaluatorCtrl.text.trim().isNotEmpty &&
          _subjectCtrl.text.trim().isNotEmpty;
    }
    if (_step == 2) {
      return _scaleMax > _scaleMin;
    }
    return true;
  }

  Future<void> _save() async {
    final db = ref.read(dbProvider);

    final now = DateTime.now().millisecondsSinceEpoch;
    final rubricId = _uuid.v4();
    final assessmentId = _uuid.v4();

    final evaluator = _evaluatorCtrl.text.trim();
    final subject = _subjectCtrl.text.trim();

    final scaleJson = jsonEncode({'min': _scaleMin, 'max': _scaleMax});

    // folderKey: valmentajalla ryhmitellään oppilaan mukaan, oppilaalla arvioijan mukaan
    final folderKey = (_role == AppRole.coach) ? subject : evaluator;

    // Rubric schema snapshot (placeholder-rakenne)
    final rubricSchema = jsonEncode({
      'id': rubricId,
      'title': '$_discipline — $_area',
      'version': 1,
      'discipline': _discipline,
      'area': _area,
      'scale': {'min': _scaleMin, 'max': _scaleMax},
      'criteria': _criteria.map((c) => {'id': c.id, 'title': c.title}).toList(),
    });

    // 1) Upsert rubric
    await db.upsertRubric(
      RubricsCompanion.insert(
        id: rubricId,
        title: '$_discipline — $_area',
        origin: 'local',
        version: 1,
        schema: rubricSchema,
        updatedAt: now,
        discipline: Value(_discipline),
      ),
    );

    // 2) Create assessment with rubric snapshot
    await db.upsertAssessment(
      AssessmentsCompanion.insert(
        id: assessmentId,
        rubricId: rubricId,
        rubricSnapshot: rubricSchema,
        discipline: Value(_discipline),
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

    // 3) Answers
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

    if (!mounted) return;
    Navigator.of(context).pop(true);
  }

  void _next() {
    if (!_canContinue) return;
    setState(() => _step++);
  }

  void _back() {
    if (_step == 0) return;
    setState(() => _step--);
  }

  @override
  Widget build(BuildContext context) {
    final title = switch (_step) {
      0 => 'Rooli',
      1 => 'Nimet',
      2 => 'Mittakaava',
      3 => 'Laji ja osa-alue',
      _ => 'Arviointi',
    };

    return Scaffold(
      appBar: AppBar(
        title: Text('Uusi arviointi — $title'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: _back,
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: _buildStep(context),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: _step == 0 ? null : _back,
                child: const Text('Takaisin'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: FilledButton(
                onPressed: _canContinue ? (_step < 4 ? _next : _save) : null,
                child: Text(_step < 4 ? 'Jatka' : 'Tallenna'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStep(BuildContext context) {
    switch (_step) {
      case 0:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Valitse rooli', style: Theme.of(context).textTheme.titleLarge),
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
            const SizedBox(height: 8),
            Text(
              _role == AppRole.coach
                  ? 'Kirjasto ryhmitellään oppilaan mukaan.'
                  : 'Kirjasto ryhmitellään arvioijan mukaan.',
            ),
          ],
        );

      case 1:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Nimet', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),
            TextField(
              controller: _evaluatorCtrl,
              decoration: const InputDecoration(
                labelText: 'Arvioija (valmentaja)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _subjectCtrl,
              decoration: const InputDecoration(
                labelText: 'Oppilas',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        );

      case 2:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Valitse mittakaava', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                ChoiceChip(
                  label: const Text('1–5'),
                  selected: _scaleMin == 1 && _scaleMax == 5,
                  onSelected: (_) => setState(() {
                    _scaleMin = 1;
                    _scaleMax = 5;
                  }),
                ),
                ChoiceChip(
                  label: const Text('1–10'),
                  selected: _scaleMin == 1 && _scaleMax == 10,
                  onSelected: (_) => setState(() {
                    _scaleMin = 1;
                    _scaleMax = 10;
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
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Min',
                      border: OutlineInputBorder(),
                    ),
                    onChanged: (v) =>
                        setState(() => _scaleMin = int.tryParse(v) ?? _scaleMin),
                    controller: TextEditingController(text: _scaleMin.toString()),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Max',
                      border: OutlineInputBorder(),
                    ),
                    onChanged: (v) =>
                        setState(() => _scaleMax = int.tryParse(v) ?? _scaleMax),
                    controller: TextEditingController(text: _scaleMax.toString()),
                  ),
                ),
              ],
            ),
          ],
        );

      case 3:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Laji ja osa-alue', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: _discipline,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Laji',
              ),
              items: const [
                DropdownMenuItem(value: 'Paritanssi', child: Text('Paritanssi')),
                DropdownMenuItem(value: 'Soolotanssi', child: Text('Soolotanssi')),
                DropdownMenuItem(value: 'Muu', child: Text('Muu')),
              ],
              onChanged: (v) => setState(() => _discipline = v ?? _discipline),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: _area,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Osa-alue',
              ),
              items: const [
                DropdownMenuItem(value: 'Valssi', child: Text('Valssi')),
                DropdownMenuItem(value: 'Quickstep', child: Text('Quickstep')),
                DropdownMenuItem(value: 'Wienervalssi', child: Text('Wienervalssi')),
                DropdownMenuItem(value: 'Placeholder', child: Text('Placeholder')),
              ],
              onChanged: (v) => setState(() => _area = v ?? _area),
            ),
            const SizedBox(height: 12),
            const Text('Kriteerit ovat nyt placeholderit. Vaihdat ne myöhemmin oikeiksi.'),
          ],
        );

      default:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Arvioi: $_area', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.separated(
                itemCount: _criteria.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, i) {
                  final c = _criteria[i];
                  return Card(
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(c.title, style: Theme.of(context).textTheme.titleMedium),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: List.generate((_scaleMax - _scaleMin + 1), (idx) {
                              final v = _scaleMin + idx;
                              final selected = c.score == v;
                              return ChoiceChip(
                                label: Text(v.toString()),
                                selected: selected,
                                onSelected: (_) => setState(() => c.score = v),
                              );
                            }),
                          ),
                          const SizedBox(height: 10),
                          TextField(
                            decoration: const InputDecoration(
                              labelText: 'Kommentti (valinnainen)',
                              border: OutlineInputBorder(),
                            ),
                            onChanged: (t) => c.comment = t,
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        );
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
