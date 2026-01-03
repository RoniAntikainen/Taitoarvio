import 'package:drift/drift.dart';

class Assessments extends Table {
  TextColumn get id => text()();

  // Rubric
  TextColumn get rubricId => text()();
  TextColumn get rubricSnapshot => text()();

  // Classification
  TextColumn get discipline => text().nullable()();

  // Names
  TextColumn get evaluatorName => text().nullable()();
  TextColumn get subjectName => text().nullable()();

  // Optional metadata
  TextColumn get tags => text().nullable()();

  // NEW: scale definition (e.g. { "min": 1, "max": 5 })
  TextColumn get scaleJson => text().nullable()();

  // Notes
  TextColumn get summaryNote => text().nullable()();

  // Timestamps
  IntColumn get createdAt => integer()();
  IntColumn get updatedAt => integer()();

  // Import / dedupe
  TextColumn get importFingerprint => text().nullable()();

  // NEW: automatic foldering key
  // - coach view: subjectName
  // - student view: evaluatorName
  TextColumn get folderKey => text().nullable()();

  @override
  Set<Column> get primaryKey => {id};

  @override
  List<Set<Column>> get uniqueKeys => [
        {importFingerprint},
      ];
}

class Answers extends Table {
  TextColumn get id => text()();

  // FK (logical)
  TextColumn get assessmentId => text()();

  // Rubric criterion
  TextColumn get criterionId => text()();

  // User input
  TextColumn get value => text().nullable()();
  TextColumn get comment => text().nullable()();

  @override
  Set<Column> get primaryKey => {id};

  @override
  List<String> get customConstraints => [
        'FOREIGN KEY(assessment_id) REFERENCES assessments(id) ON DELETE CASCADE',
      ];
}

class Rubrics extends Table {
  TextColumn get id => text()();
  TextColumn get title => text()();

  // Optional grouping
  TextColumn get discipline => text().nullable()();

  // Origin info
  TextColumn get origin => text()(); // local / imported / system

  // Versioning
  IntColumn get version => integer()();

  // Full rubric JSON schema
  TextColumn get schema => text()();

  // Timestamp
  IntColumn get updatedAt => integer()();

  @override
  Set<Column> get primaryKey => {id};
}
