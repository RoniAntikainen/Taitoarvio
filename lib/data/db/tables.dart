import 'package:drift/drift.dart';

class Assessments extends Table {
  TextColumn get id => text()();
  TextColumn get rubricId => text()();
  TextColumn get rubricSnapshot => text()();
  TextColumn get discipline => text().nullable()();
  TextColumn get evaluatorName => text().nullable()();
  TextColumn get subjectName => text().nullable()();
  TextColumn get tags => text().nullable()();
  TextColumn get summaryNote => text().nullable()();
  IntColumn get createdAt => integer()();
  IntColumn get updatedAt => integer()();
  TextColumn get importFingerprint => text().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

class Answers extends Table {
  TextColumn get id => text()();
  TextColumn get assessmentId => text()();
  TextColumn get criterionId => text()();
  TextColumn get value => text().nullable()();
  TextColumn get comment => text().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

class Rubrics extends Table {
  TextColumn get id => text()();
  TextColumn get title => text()();
  TextColumn get discipline => text().nullable()();
  TextColumn get origin => text()();
  IntColumn get version => integer()();
  TextColumn get schema => text()();
  IntColumn get updatedAt => integer()();

  @override
  Set<Column> get primaryKey => {id};
}
