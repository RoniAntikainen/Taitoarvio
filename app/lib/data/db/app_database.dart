import 'dart:io';

import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';

import 'tables.dart';

part 'app_database.g.dart';

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dir = await getApplicationDocumentsDirectory();
    final file = File(p.join(dir.path, 'taitoarvio.sqlite'));
    return NativeDatabase.createInBackground(file);
  });
}

@DriftDatabase(tables: [Assessments, Answers, Rubrics])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  // -------- Queries used by importer/exporter/UI --------

  Future<Assessment?> getAssessmentById(String id) {
    return (select(assessments)..where((t) => t.id.equals(id))).getSingleOrNull();
  }

  Future<List<Assessment>> listAssessments() {
    return (select(assessments)..orderBy([(t) => OrderingTerm.desc(t.createdAt)]))
        .get();
  }

  Future<List<Answer>> listAnswers(String assessmentId) {
    return (select(answers)..where((t) => t.assessmentId.equals(assessmentId))).get();
  }

  Future<void> upsertAssessment(Insertable<Assessment> row) async {
    await into(assessments).insertOnConflictUpdate(row);
  }

  Future<void> upsertRubric(Insertable<Rubric> row) async {
    await into(rubrics).insertOnConflictUpdate(row);
  }

  Future<void> replaceAnswers(String assessmentId, List<Insertable<Answer>> rows) async {
    await transaction(() async {
      await (delete(answers)..where((t) => t.assessmentId.equals(assessmentId))).go();
      if (rows.isNotEmpty) {
        await batch((b) => b.insertAll(answers, rows));
      }
    });
  }

  Future<bool> hasFingerprint(String fingerprint) async {
    final q = selectOnly(assessments)
      ..addColumns([assessments.id])
      ..where(assessments.importFingerprint.equals(fingerprint))
      ..limit(1);

    final row = await q.getSingleOrNull();
    return row != null;
  }
}
