import 'dart:convert';
import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';
import '../db/app_database.dart';

class AssessmentRepository {
  AssessmentRepository(this.db);
  final AppDatabase db;
  final _uuid = const Uuid();

  Future<String> createSampleAssessment({
    required String evaluator,
    required String subject,
  }) async {
    final rubricId = _uuid.v4();
    final rubricSnapshot = jsonEncode({
      'id': rubricId,
      'title': 'Perustekniikka',
      'version': 1,
      'sections': [
        {
          'id': 's1',
          'title': 'Tekniikka',
          'criteria': [
            {'id': 'c1', 'title': 'Asento', 'type': 'score', 'scale': [1, 2, 3, 4, 5]},
            {'id': 'c2', 'title': 'Rytmi', 'type': 'score', 'scale': [1, 2, 3, 4, 5]}
          ]
        }
      ]
    });

    await db.upsertRubric(RubricsCompanion.insert(
      id: rubricId,
      title: 'Perustekniikka',
      origin: 'built_in',
      version: 1,
      schema: rubricSnapshot,
      updatedAt: DateTime.now().millisecondsSinceEpoch,
      discipline: const Value('default'),
    ));

    final assessmentId = _uuid.v4();
    final now = DateTime.now().millisecondsSinceEpoch;

    await db.upsertAssessment(AssessmentsCompanion.insert(
      id: assessmentId,
      rubricId: rubricId,
      rubricSnapshot: rubricSnapshot,
      discipline: const Value('default'),
      evaluatorName: Value(evaluator),
      subjectName: Value(subject),
      tags: const Value('["mvp"]'),
      summaryNote: const Value('Esimerkkipalaute'),
      createdAt: now,
      updatedAt: now,
      importFingerprint: const Value(null),
    ));

    await db.replaceAnswers(assessmentId, [
      AnswersCompanion.insert(
        id: _uuid.v4(),
        assessmentId: assessmentId,
        criterionId: 'c1',
        value: const Value('4'),
        comment: const Value('Hyvä linja'),
      ),
      AnswersCompanion.insert(
        id: _uuid.v4(),
        assessmentId: assessmentId,
        criterionId: 'c2',
        value: const Value('3'),
        comment: const Value('Rytmi paranee'),
      ),
    ]);

    return assessmentId;
  }

  Future<List<Assessment>> list() => db.listAssessments();
}
