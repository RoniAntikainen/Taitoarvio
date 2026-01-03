import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';

import 'tables.dart';

part 'app_database.g.dart';

@DriftDatabase(tables: [Assessments, Answers, Rubrics])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  static QueryExecutor _openConnection() {
    return driftDatabase(
      name: 'arviointi.sqlite',
      native: const DriftNativeOptions(),
      web: DriftWebOptions(
        sqlite3Wasm: Uri.parse('sqlite3.wasm'),
        driftWorker: Uri.parse('drift_worker.js'),
      ),
    );
  }

  Future<void> upsertAssessment(AssessmentsCompanion row) =>
      into(assessments).insertOnConflictUpdate(row);

  Future<List<Assessment>> listAssessments() =>
      (select(assessments)..orderBy([(t) => OrderingTerm.desc(t.updatedAt)])).get();

  Future<Assessment?> getAssessmentById(String id) =>
      (select(assessments)..where((t) => t.id.equals(id))).getSingleOrNull();

  Future<bool> hasFingerprint(String fingerprint) async {
    final q = select(assessments)..where((t) => t.importFingerprint.equals(fingerprint));
    final row = await q.getSingleOrNull();
    return row != null;
  }

  Future<void> replaceAnswers(String assessmentId, List<AnswersCompanion> rows) async {
    await (delete(answers)..where((t) => t.assessmentId.equals(assessmentId))).go();
    await batch((b) => b.insertAll(answers, rows));
  }

  Future<List<Answer>> listAnswers(String assessmentId) =>
      (select(answers)..where((t) => t.assessmentId.equals(assessmentId))).get();

  Future<void> upsertRubric(RubricsCompanion row) =>
      into(rubrics).insertOnConflictUpdate(row);
}
