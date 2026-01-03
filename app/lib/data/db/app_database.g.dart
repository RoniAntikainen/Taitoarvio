// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_database.dart';

// ignore_for_file: type=lint
class $AssessmentsTable extends Assessments
    with TableInfo<$AssessmentsTable, Assessment> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $AssessmentsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _rubricIdMeta =
      const VerificationMeta('rubricId');
  @override
  late final GeneratedColumn<String> rubricId = GeneratedColumn<String>(
      'rubric_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _rubricSnapshotMeta =
      const VerificationMeta('rubricSnapshot');
  @override
  late final GeneratedColumn<String> rubricSnapshot = GeneratedColumn<String>(
      'rubric_snapshot', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _disciplineMeta =
      const VerificationMeta('discipline');
  @override
  late final GeneratedColumn<String> discipline = GeneratedColumn<String>(
      'discipline', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _evaluatorNameMeta =
      const VerificationMeta('evaluatorName');
  @override
  late final GeneratedColumn<String> evaluatorName = GeneratedColumn<String>(
      'evaluator_name', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _subjectNameMeta =
      const VerificationMeta('subjectName');
  @override
  late final GeneratedColumn<String> subjectName = GeneratedColumn<String>(
      'subject_name', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _tagsMeta = const VerificationMeta('tags');
  @override
  late final GeneratedColumn<String> tags = GeneratedColumn<String>(
      'tags', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _summaryNoteMeta =
      const VerificationMeta('summaryNote');
  @override
  late final GeneratedColumn<String> summaryNote = GeneratedColumn<String>(
      'summary_note', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<int> createdAt = GeneratedColumn<int>(
      'created_at', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  @override
  late final GeneratedColumn<int> updatedAt = GeneratedColumn<int>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _importFingerprintMeta =
      const VerificationMeta('importFingerprint');
  @override
  late final GeneratedColumn<String> importFingerprint =
      GeneratedColumn<String>('import_fingerprint', aliasedName, true,
          type: DriftSqlType.string, requiredDuringInsert: false);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        rubricId,
        rubricSnapshot,
        discipline,
        evaluatorName,
        subjectName,
        tags,
        summaryNote,
        createdAt,
        updatedAt,
        importFingerprint
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'assessments';
  @override
  VerificationContext validateIntegrity(Insertable<Assessment> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('rubric_id')) {
      context.handle(_rubricIdMeta,
          rubricId.isAcceptableOrUnknown(data['rubric_id']!, _rubricIdMeta));
    } else if (isInserting) {
      context.missing(_rubricIdMeta);
    }
    if (data.containsKey('rubric_snapshot')) {
      context.handle(
          _rubricSnapshotMeta,
          rubricSnapshot.isAcceptableOrUnknown(
              data['rubric_snapshot']!, _rubricSnapshotMeta));
    } else if (isInserting) {
      context.missing(_rubricSnapshotMeta);
    }
    if (data.containsKey('discipline')) {
      context.handle(
          _disciplineMeta,
          discipline.isAcceptableOrUnknown(
              data['discipline']!, _disciplineMeta));
    }
    if (data.containsKey('evaluator_name')) {
      context.handle(
          _evaluatorNameMeta,
          evaluatorName.isAcceptableOrUnknown(
              data['evaluator_name']!, _evaluatorNameMeta));
    }
    if (data.containsKey('subject_name')) {
      context.handle(
          _subjectNameMeta,
          subjectName.isAcceptableOrUnknown(
              data['subject_name']!, _subjectNameMeta));
    }
    if (data.containsKey('tags')) {
      context.handle(
          _tagsMeta, tags.isAcceptableOrUnknown(data['tags']!, _tagsMeta));
    }
    if (data.containsKey('summary_note')) {
      context.handle(
          _summaryNoteMeta,
          summaryNote.isAcceptableOrUnknown(
              data['summary_note']!, _summaryNoteMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('import_fingerprint')) {
      context.handle(
          _importFingerprintMeta,
          importFingerprint.isAcceptableOrUnknown(
              data['import_fingerprint']!, _importFingerprintMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Assessment map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Assessment(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      rubricId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}rubric_id'])!,
      rubricSnapshot: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}rubric_snapshot'])!,
      discipline: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}discipline']),
      evaluatorName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}evaluator_name']),
      subjectName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}subject_name']),
      tags: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}tags']),
      summaryNote: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}summary_note']),
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}created_at'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}updated_at'])!,
      importFingerprint: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}import_fingerprint']),
    );
  }

  @override
  $AssessmentsTable createAlias(String alias) {
    return $AssessmentsTable(attachedDatabase, alias);
  }
}

class Assessment extends DataClass implements Insertable<Assessment> {
  final String id;
  final String rubricId;
  final String rubricSnapshot;
  final String? discipline;
  final String? evaluatorName;
  final String? subjectName;
  final String? tags;
  final String? summaryNote;
  final int createdAt;
  final int updatedAt;
  final String? importFingerprint;
  const Assessment(
      {required this.id,
      required this.rubricId,
      required this.rubricSnapshot,
      this.discipline,
      this.evaluatorName,
      this.subjectName,
      this.tags,
      this.summaryNote,
      required this.createdAt,
      required this.updatedAt,
      this.importFingerprint});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['rubric_id'] = Variable<String>(rubricId);
    map['rubric_snapshot'] = Variable<String>(rubricSnapshot);
    if (!nullToAbsent || discipline != null) {
      map['discipline'] = Variable<String>(discipline);
    }
    if (!nullToAbsent || evaluatorName != null) {
      map['evaluator_name'] = Variable<String>(evaluatorName);
    }
    if (!nullToAbsent || subjectName != null) {
      map['subject_name'] = Variable<String>(subjectName);
    }
    if (!nullToAbsent || tags != null) {
      map['tags'] = Variable<String>(tags);
    }
    if (!nullToAbsent || summaryNote != null) {
      map['summary_note'] = Variable<String>(summaryNote);
    }
    map['created_at'] = Variable<int>(createdAt);
    map['updated_at'] = Variable<int>(updatedAt);
    if (!nullToAbsent || importFingerprint != null) {
      map['import_fingerprint'] = Variable<String>(importFingerprint);
    }
    return map;
  }

  AssessmentsCompanion toCompanion(bool nullToAbsent) {
    return AssessmentsCompanion(
      id: Value(id),
      rubricId: Value(rubricId),
      rubricSnapshot: Value(rubricSnapshot),
      discipline: discipline == null && nullToAbsent
          ? const Value.absent()
          : Value(discipline),
      evaluatorName: evaluatorName == null && nullToAbsent
          ? const Value.absent()
          : Value(evaluatorName),
      subjectName: subjectName == null && nullToAbsent
          ? const Value.absent()
          : Value(subjectName),
      tags: tags == null && nullToAbsent ? const Value.absent() : Value(tags),
      summaryNote: summaryNote == null && nullToAbsent
          ? const Value.absent()
          : Value(summaryNote),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
      importFingerprint: importFingerprint == null && nullToAbsent
          ? const Value.absent()
          : Value(importFingerprint),
    );
  }

  factory Assessment.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Assessment(
      id: serializer.fromJson<String>(json['id']),
      rubricId: serializer.fromJson<String>(json['rubricId']),
      rubricSnapshot: serializer.fromJson<String>(json['rubricSnapshot']),
      discipline: serializer.fromJson<String?>(json['discipline']),
      evaluatorName: serializer.fromJson<String?>(json['evaluatorName']),
      subjectName: serializer.fromJson<String?>(json['subjectName']),
      tags: serializer.fromJson<String?>(json['tags']),
      summaryNote: serializer.fromJson<String?>(json['summaryNote']),
      createdAt: serializer.fromJson<int>(json['createdAt']),
      updatedAt: serializer.fromJson<int>(json['updatedAt']),
      importFingerprint:
          serializer.fromJson<String?>(json['importFingerprint']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'rubricId': serializer.toJson<String>(rubricId),
      'rubricSnapshot': serializer.toJson<String>(rubricSnapshot),
      'discipline': serializer.toJson<String?>(discipline),
      'evaluatorName': serializer.toJson<String?>(evaluatorName),
      'subjectName': serializer.toJson<String?>(subjectName),
      'tags': serializer.toJson<String?>(tags),
      'summaryNote': serializer.toJson<String?>(summaryNote),
      'createdAt': serializer.toJson<int>(createdAt),
      'updatedAt': serializer.toJson<int>(updatedAt),
      'importFingerprint': serializer.toJson<String?>(importFingerprint),
    };
  }

  Assessment copyWith(
          {String? id,
          String? rubricId,
          String? rubricSnapshot,
          Value<String?> discipline = const Value.absent(),
          Value<String?> evaluatorName = const Value.absent(),
          Value<String?> subjectName = const Value.absent(),
          Value<String?> tags = const Value.absent(),
          Value<String?> summaryNote = const Value.absent(),
          int? createdAt,
          int? updatedAt,
          Value<String?> importFingerprint = const Value.absent()}) =>
      Assessment(
        id: id ?? this.id,
        rubricId: rubricId ?? this.rubricId,
        rubricSnapshot: rubricSnapshot ?? this.rubricSnapshot,
        discipline: discipline.present ? discipline.value : this.discipline,
        evaluatorName:
            evaluatorName.present ? evaluatorName.value : this.evaluatorName,
        subjectName: subjectName.present ? subjectName.value : this.subjectName,
        tags: tags.present ? tags.value : this.tags,
        summaryNote: summaryNote.present ? summaryNote.value : this.summaryNote,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        importFingerprint: importFingerprint.present
            ? importFingerprint.value
            : this.importFingerprint,
      );
  Assessment copyWithCompanion(AssessmentsCompanion data) {
    return Assessment(
      id: data.id.present ? data.id.value : this.id,
      rubricId: data.rubricId.present ? data.rubricId.value : this.rubricId,
      rubricSnapshot: data.rubricSnapshot.present
          ? data.rubricSnapshot.value
          : this.rubricSnapshot,
      discipline:
          data.discipline.present ? data.discipline.value : this.discipline,
      evaluatorName: data.evaluatorName.present
          ? data.evaluatorName.value
          : this.evaluatorName,
      subjectName:
          data.subjectName.present ? data.subjectName.value : this.subjectName,
      tags: data.tags.present ? data.tags.value : this.tags,
      summaryNote:
          data.summaryNote.present ? data.summaryNote.value : this.summaryNote,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
      importFingerprint: data.importFingerprint.present
          ? data.importFingerprint.value
          : this.importFingerprint,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Assessment(')
          ..write('id: $id, ')
          ..write('rubricId: $rubricId, ')
          ..write('rubricSnapshot: $rubricSnapshot, ')
          ..write('discipline: $discipline, ')
          ..write('evaluatorName: $evaluatorName, ')
          ..write('subjectName: $subjectName, ')
          ..write('tags: $tags, ')
          ..write('summaryNote: $summaryNote, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('importFingerprint: $importFingerprint')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      rubricId,
      rubricSnapshot,
      discipline,
      evaluatorName,
      subjectName,
      tags,
      summaryNote,
      createdAt,
      updatedAt,
      importFingerprint);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Assessment &&
          other.id == this.id &&
          other.rubricId == this.rubricId &&
          other.rubricSnapshot == this.rubricSnapshot &&
          other.discipline == this.discipline &&
          other.evaluatorName == this.evaluatorName &&
          other.subjectName == this.subjectName &&
          other.tags == this.tags &&
          other.summaryNote == this.summaryNote &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt &&
          other.importFingerprint == this.importFingerprint);
}

class AssessmentsCompanion extends UpdateCompanion<Assessment> {
  final Value<String> id;
  final Value<String> rubricId;
  final Value<String> rubricSnapshot;
  final Value<String?> discipline;
  final Value<String?> evaluatorName;
  final Value<String?> subjectName;
  final Value<String?> tags;
  final Value<String?> summaryNote;
  final Value<int> createdAt;
  final Value<int> updatedAt;
  final Value<String?> importFingerprint;
  final Value<int> rowid;
  const AssessmentsCompanion({
    this.id = const Value.absent(),
    this.rubricId = const Value.absent(),
    this.rubricSnapshot = const Value.absent(),
    this.discipline = const Value.absent(),
    this.evaluatorName = const Value.absent(),
    this.subjectName = const Value.absent(),
    this.tags = const Value.absent(),
    this.summaryNote = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.importFingerprint = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  AssessmentsCompanion.insert({
    required String id,
    required String rubricId,
    required String rubricSnapshot,
    this.discipline = const Value.absent(),
    this.evaluatorName = const Value.absent(),
    this.subjectName = const Value.absent(),
    this.tags = const Value.absent(),
    this.summaryNote = const Value.absent(),
    required int createdAt,
    required int updatedAt,
    this.importFingerprint = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        rubricId = Value(rubricId),
        rubricSnapshot = Value(rubricSnapshot),
        createdAt = Value(createdAt),
        updatedAt = Value(updatedAt);
  static Insertable<Assessment> custom({
    Expression<String>? id,
    Expression<String>? rubricId,
    Expression<String>? rubricSnapshot,
    Expression<String>? discipline,
    Expression<String>? evaluatorName,
    Expression<String>? subjectName,
    Expression<String>? tags,
    Expression<String>? summaryNote,
    Expression<int>? createdAt,
    Expression<int>? updatedAt,
    Expression<String>? importFingerprint,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (rubricId != null) 'rubric_id': rubricId,
      if (rubricSnapshot != null) 'rubric_snapshot': rubricSnapshot,
      if (discipline != null) 'discipline': discipline,
      if (evaluatorName != null) 'evaluator_name': evaluatorName,
      if (subjectName != null) 'subject_name': subjectName,
      if (tags != null) 'tags': tags,
      if (summaryNote != null) 'summary_note': summaryNote,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (importFingerprint != null) 'import_fingerprint': importFingerprint,
      if (rowid != null) 'rowid': rowid,
    });
  }

  AssessmentsCompanion copyWith(
      {Value<String>? id,
      Value<String>? rubricId,
      Value<String>? rubricSnapshot,
      Value<String?>? discipline,
      Value<String?>? evaluatorName,
      Value<String?>? subjectName,
      Value<String?>? tags,
      Value<String?>? summaryNote,
      Value<int>? createdAt,
      Value<int>? updatedAt,
      Value<String?>? importFingerprint,
      Value<int>? rowid}) {
    return AssessmentsCompanion(
      id: id ?? this.id,
      rubricId: rubricId ?? this.rubricId,
      rubricSnapshot: rubricSnapshot ?? this.rubricSnapshot,
      discipline: discipline ?? this.discipline,
      evaluatorName: evaluatorName ?? this.evaluatorName,
      subjectName: subjectName ?? this.subjectName,
      tags: tags ?? this.tags,
      summaryNote: summaryNote ?? this.summaryNote,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      importFingerprint: importFingerprint ?? this.importFingerprint,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (rubricId.present) {
      map['rubric_id'] = Variable<String>(rubricId.value);
    }
    if (rubricSnapshot.present) {
      map['rubric_snapshot'] = Variable<String>(rubricSnapshot.value);
    }
    if (discipline.present) {
      map['discipline'] = Variable<String>(discipline.value);
    }
    if (evaluatorName.present) {
      map['evaluator_name'] = Variable<String>(evaluatorName.value);
    }
    if (subjectName.present) {
      map['subject_name'] = Variable<String>(subjectName.value);
    }
    if (tags.present) {
      map['tags'] = Variable<String>(tags.value);
    }
    if (summaryNote.present) {
      map['summary_note'] = Variable<String>(summaryNote.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<int>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<int>(updatedAt.value);
    }
    if (importFingerprint.present) {
      map['import_fingerprint'] = Variable<String>(importFingerprint.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('AssessmentsCompanion(')
          ..write('id: $id, ')
          ..write('rubricId: $rubricId, ')
          ..write('rubricSnapshot: $rubricSnapshot, ')
          ..write('discipline: $discipline, ')
          ..write('evaluatorName: $evaluatorName, ')
          ..write('subjectName: $subjectName, ')
          ..write('tags: $tags, ')
          ..write('summaryNote: $summaryNote, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('importFingerprint: $importFingerprint, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $AnswersTable extends Answers with TableInfo<$AnswersTable, Answer> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $AnswersTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _assessmentIdMeta =
      const VerificationMeta('assessmentId');
  @override
  late final GeneratedColumn<String> assessmentId = GeneratedColumn<String>(
      'assessment_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _criterionIdMeta =
      const VerificationMeta('criterionId');
  @override
  late final GeneratedColumn<String> criterionId = GeneratedColumn<String>(
      'criterion_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _valueMeta = const VerificationMeta('value');
  @override
  late final GeneratedColumn<String> value = GeneratedColumn<String>(
      'value', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _commentMeta =
      const VerificationMeta('comment');
  @override
  late final GeneratedColumn<String> comment = GeneratedColumn<String>(
      'comment', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  @override
  List<GeneratedColumn> get $columns =>
      [id, assessmentId, criterionId, value, comment];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'answers';
  @override
  VerificationContext validateIntegrity(Insertable<Answer> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('assessment_id')) {
      context.handle(
          _assessmentIdMeta,
          assessmentId.isAcceptableOrUnknown(
              data['assessment_id']!, _assessmentIdMeta));
    } else if (isInserting) {
      context.missing(_assessmentIdMeta);
    }
    if (data.containsKey('criterion_id')) {
      context.handle(
          _criterionIdMeta,
          criterionId.isAcceptableOrUnknown(
              data['criterion_id']!, _criterionIdMeta));
    } else if (isInserting) {
      context.missing(_criterionIdMeta);
    }
    if (data.containsKey('value')) {
      context.handle(
          _valueMeta, value.isAcceptableOrUnknown(data['value']!, _valueMeta));
    }
    if (data.containsKey('comment')) {
      context.handle(_commentMeta,
          comment.isAcceptableOrUnknown(data['comment']!, _commentMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Answer map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Answer(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      assessmentId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}assessment_id'])!,
      criterionId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}criterion_id'])!,
      value: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}value']),
      comment: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}comment']),
    );
  }

  @override
  $AnswersTable createAlias(String alias) {
    return $AnswersTable(attachedDatabase, alias);
  }
}

class Answer extends DataClass implements Insertable<Answer> {
  final String id;
  final String assessmentId;
  final String criterionId;
  final String? value;
  final String? comment;
  const Answer(
      {required this.id,
      required this.assessmentId,
      required this.criterionId,
      this.value,
      this.comment});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['assessment_id'] = Variable<String>(assessmentId);
    map['criterion_id'] = Variable<String>(criterionId);
    if (!nullToAbsent || value != null) {
      map['value'] = Variable<String>(value);
    }
    if (!nullToAbsent || comment != null) {
      map['comment'] = Variable<String>(comment);
    }
    return map;
  }

  AnswersCompanion toCompanion(bool nullToAbsent) {
    return AnswersCompanion(
      id: Value(id),
      assessmentId: Value(assessmentId),
      criterionId: Value(criterionId),
      value:
          value == null && nullToAbsent ? const Value.absent() : Value(value),
      comment: comment == null && nullToAbsent
          ? const Value.absent()
          : Value(comment),
    );
  }

  factory Answer.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Answer(
      id: serializer.fromJson<String>(json['id']),
      assessmentId: serializer.fromJson<String>(json['assessmentId']),
      criterionId: serializer.fromJson<String>(json['criterionId']),
      value: serializer.fromJson<String?>(json['value']),
      comment: serializer.fromJson<String?>(json['comment']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'assessmentId': serializer.toJson<String>(assessmentId),
      'criterionId': serializer.toJson<String>(criterionId),
      'value': serializer.toJson<String?>(value),
      'comment': serializer.toJson<String?>(comment),
    };
  }

  Answer copyWith(
          {String? id,
          String? assessmentId,
          String? criterionId,
          Value<String?> value = const Value.absent(),
          Value<String?> comment = const Value.absent()}) =>
      Answer(
        id: id ?? this.id,
        assessmentId: assessmentId ?? this.assessmentId,
        criterionId: criterionId ?? this.criterionId,
        value: value.present ? value.value : this.value,
        comment: comment.present ? comment.value : this.comment,
      );
  Answer copyWithCompanion(AnswersCompanion data) {
    return Answer(
      id: data.id.present ? data.id.value : this.id,
      assessmentId: data.assessmentId.present
          ? data.assessmentId.value
          : this.assessmentId,
      criterionId:
          data.criterionId.present ? data.criterionId.value : this.criterionId,
      value: data.value.present ? data.value.value : this.value,
      comment: data.comment.present ? data.comment.value : this.comment,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Answer(')
          ..write('id: $id, ')
          ..write('assessmentId: $assessmentId, ')
          ..write('criterionId: $criterionId, ')
          ..write('value: $value, ')
          ..write('comment: $comment')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, assessmentId, criterionId, value, comment);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Answer &&
          other.id == this.id &&
          other.assessmentId == this.assessmentId &&
          other.criterionId == this.criterionId &&
          other.value == this.value &&
          other.comment == this.comment);
}

class AnswersCompanion extends UpdateCompanion<Answer> {
  final Value<String> id;
  final Value<String> assessmentId;
  final Value<String> criterionId;
  final Value<String?> value;
  final Value<String?> comment;
  final Value<int> rowid;
  const AnswersCompanion({
    this.id = const Value.absent(),
    this.assessmentId = const Value.absent(),
    this.criterionId = const Value.absent(),
    this.value = const Value.absent(),
    this.comment = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  AnswersCompanion.insert({
    required String id,
    required String assessmentId,
    required String criterionId,
    this.value = const Value.absent(),
    this.comment = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        assessmentId = Value(assessmentId),
        criterionId = Value(criterionId);
  static Insertable<Answer> custom({
    Expression<String>? id,
    Expression<String>? assessmentId,
    Expression<String>? criterionId,
    Expression<String>? value,
    Expression<String>? comment,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (assessmentId != null) 'assessment_id': assessmentId,
      if (criterionId != null) 'criterion_id': criterionId,
      if (value != null) 'value': value,
      if (comment != null) 'comment': comment,
      if (rowid != null) 'rowid': rowid,
    });
  }

  AnswersCompanion copyWith(
      {Value<String>? id,
      Value<String>? assessmentId,
      Value<String>? criterionId,
      Value<String?>? value,
      Value<String?>? comment,
      Value<int>? rowid}) {
    return AnswersCompanion(
      id: id ?? this.id,
      assessmentId: assessmentId ?? this.assessmentId,
      criterionId: criterionId ?? this.criterionId,
      value: value ?? this.value,
      comment: comment ?? this.comment,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (assessmentId.present) {
      map['assessment_id'] = Variable<String>(assessmentId.value);
    }
    if (criterionId.present) {
      map['criterion_id'] = Variable<String>(criterionId.value);
    }
    if (value.present) {
      map['value'] = Variable<String>(value.value);
    }
    if (comment.present) {
      map['comment'] = Variable<String>(comment.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('AnswersCompanion(')
          ..write('id: $id, ')
          ..write('assessmentId: $assessmentId, ')
          ..write('criterionId: $criterionId, ')
          ..write('value: $value, ')
          ..write('comment: $comment, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $RubricsTable extends Rubrics with TableInfo<$RubricsTable, Rubric> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $RubricsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
      'title', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _disciplineMeta =
      const VerificationMeta('discipline');
  @override
  late final GeneratedColumn<String> discipline = GeneratedColumn<String>(
      'discipline', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _originMeta = const VerificationMeta('origin');
  @override
  late final GeneratedColumn<String> origin = GeneratedColumn<String>(
      'origin', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _versionMeta =
      const VerificationMeta('version');
  @override
  late final GeneratedColumn<int> version = GeneratedColumn<int>(
      'version', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _schemaMeta = const VerificationMeta('schema');
  @override
  late final GeneratedColumn<String> schema = GeneratedColumn<String>(
      'schema', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  @override
  late final GeneratedColumn<int> updatedAt = GeneratedColumn<int>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns =>
      [id, title, discipline, origin, version, schema, updatedAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'rubrics';
  @override
  VerificationContext validateIntegrity(Insertable<Rubric> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('title')) {
      context.handle(
          _titleMeta, title.isAcceptableOrUnknown(data['title']!, _titleMeta));
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('discipline')) {
      context.handle(
          _disciplineMeta,
          discipline.isAcceptableOrUnknown(
              data['discipline']!, _disciplineMeta));
    }
    if (data.containsKey('origin')) {
      context.handle(_originMeta,
          origin.isAcceptableOrUnknown(data['origin']!, _originMeta));
    } else if (isInserting) {
      context.missing(_originMeta);
    }
    if (data.containsKey('version')) {
      context.handle(_versionMeta,
          version.isAcceptableOrUnknown(data['version']!, _versionMeta));
    } else if (isInserting) {
      context.missing(_versionMeta);
    }
    if (data.containsKey('schema')) {
      context.handle(_schemaMeta,
          schema.isAcceptableOrUnknown(data['schema']!, _schemaMeta));
    } else if (isInserting) {
      context.missing(_schemaMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Rubric map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Rubric(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      title: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}title'])!,
      discipline: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}discipline']),
      origin: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}origin'])!,
      version: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}version'])!,
      schema: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}schema'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}updated_at'])!,
    );
  }

  @override
  $RubricsTable createAlias(String alias) {
    return $RubricsTable(attachedDatabase, alias);
  }
}

class Rubric extends DataClass implements Insertable<Rubric> {
  final String id;
  final String title;
  final String? discipline;
  final String origin;
  final int version;
  final String schema;
  final int updatedAt;
  const Rubric(
      {required this.id,
      required this.title,
      this.discipline,
      required this.origin,
      required this.version,
      required this.schema,
      required this.updatedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['title'] = Variable<String>(title);
    if (!nullToAbsent || discipline != null) {
      map['discipline'] = Variable<String>(discipline);
    }
    map['origin'] = Variable<String>(origin);
    map['version'] = Variable<int>(version);
    map['schema'] = Variable<String>(schema);
    map['updated_at'] = Variable<int>(updatedAt);
    return map;
  }

  RubricsCompanion toCompanion(bool nullToAbsent) {
    return RubricsCompanion(
      id: Value(id),
      title: Value(title),
      discipline: discipline == null && nullToAbsent
          ? const Value.absent()
          : Value(discipline),
      origin: Value(origin),
      version: Value(version),
      schema: Value(schema),
      updatedAt: Value(updatedAt),
    );
  }

  factory Rubric.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Rubric(
      id: serializer.fromJson<String>(json['id']),
      title: serializer.fromJson<String>(json['title']),
      discipline: serializer.fromJson<String?>(json['discipline']),
      origin: serializer.fromJson<String>(json['origin']),
      version: serializer.fromJson<int>(json['version']),
      schema: serializer.fromJson<String>(json['schema']),
      updatedAt: serializer.fromJson<int>(json['updatedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'title': serializer.toJson<String>(title),
      'discipline': serializer.toJson<String?>(discipline),
      'origin': serializer.toJson<String>(origin),
      'version': serializer.toJson<int>(version),
      'schema': serializer.toJson<String>(schema),
      'updatedAt': serializer.toJson<int>(updatedAt),
    };
  }

  Rubric copyWith(
          {String? id,
          String? title,
          Value<String?> discipline = const Value.absent(),
          String? origin,
          int? version,
          String? schema,
          int? updatedAt}) =>
      Rubric(
        id: id ?? this.id,
        title: title ?? this.title,
        discipline: discipline.present ? discipline.value : this.discipline,
        origin: origin ?? this.origin,
        version: version ?? this.version,
        schema: schema ?? this.schema,
        updatedAt: updatedAt ?? this.updatedAt,
      );
  Rubric copyWithCompanion(RubricsCompanion data) {
    return Rubric(
      id: data.id.present ? data.id.value : this.id,
      title: data.title.present ? data.title.value : this.title,
      discipline:
          data.discipline.present ? data.discipline.value : this.discipline,
      origin: data.origin.present ? data.origin.value : this.origin,
      version: data.version.present ? data.version.value : this.version,
      schema: data.schema.present ? data.schema.value : this.schema,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Rubric(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('discipline: $discipline, ')
          ..write('origin: $origin, ')
          ..write('version: $version, ')
          ..write('schema: $schema, ')
          ..write('updatedAt: $updatedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, title, discipline, origin, version, schema, updatedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Rubric &&
          other.id == this.id &&
          other.title == this.title &&
          other.discipline == this.discipline &&
          other.origin == this.origin &&
          other.version == this.version &&
          other.schema == this.schema &&
          other.updatedAt == this.updatedAt);
}

class RubricsCompanion extends UpdateCompanion<Rubric> {
  final Value<String> id;
  final Value<String> title;
  final Value<String?> discipline;
  final Value<String> origin;
  final Value<int> version;
  final Value<String> schema;
  final Value<int> updatedAt;
  final Value<int> rowid;
  const RubricsCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.discipline = const Value.absent(),
    this.origin = const Value.absent(),
    this.version = const Value.absent(),
    this.schema = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  RubricsCompanion.insert({
    required String id,
    required String title,
    this.discipline = const Value.absent(),
    required String origin,
    required int version,
    required String schema,
    required int updatedAt,
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        title = Value(title),
        origin = Value(origin),
        version = Value(version),
        schema = Value(schema),
        updatedAt = Value(updatedAt);
  static Insertable<Rubric> custom({
    Expression<String>? id,
    Expression<String>? title,
    Expression<String>? discipline,
    Expression<String>? origin,
    Expression<int>? version,
    Expression<String>? schema,
    Expression<int>? updatedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (discipline != null) 'discipline': discipline,
      if (origin != null) 'origin': origin,
      if (version != null) 'version': version,
      if (schema != null) 'schema': schema,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  RubricsCompanion copyWith(
      {Value<String>? id,
      Value<String>? title,
      Value<String?>? discipline,
      Value<String>? origin,
      Value<int>? version,
      Value<String>? schema,
      Value<int>? updatedAt,
      Value<int>? rowid}) {
    return RubricsCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      discipline: discipline ?? this.discipline,
      origin: origin ?? this.origin,
      version: version ?? this.version,
      schema: schema ?? this.schema,
      updatedAt: updatedAt ?? this.updatedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (discipline.present) {
      map['discipline'] = Variable<String>(discipline.value);
    }
    if (origin.present) {
      map['origin'] = Variable<String>(origin.value);
    }
    if (version.present) {
      map['version'] = Variable<int>(version.value);
    }
    if (schema.present) {
      map['schema'] = Variable<String>(schema.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<int>(updatedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('RubricsCompanion(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('discipline: $discipline, ')
          ..write('origin: $origin, ')
          ..write('version: $version, ')
          ..write('schema: $schema, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $AssessmentsTable assessments = $AssessmentsTable(this);
  late final $AnswersTable answers = $AnswersTable(this);
  late final $RubricsTable rubrics = $RubricsTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities =>
      [assessments, answers, rubrics];
}

typedef $$AssessmentsTableCreateCompanionBuilder = AssessmentsCompanion
    Function({
  required String id,
  required String rubricId,
  required String rubricSnapshot,
  Value<String?> discipline,
  Value<String?> evaluatorName,
  Value<String?> subjectName,
  Value<String?> tags,
  Value<String?> summaryNote,
  required int createdAt,
  required int updatedAt,
  Value<String?> importFingerprint,
  Value<int> rowid,
});
typedef $$AssessmentsTableUpdateCompanionBuilder = AssessmentsCompanion
    Function({
  Value<String> id,
  Value<String> rubricId,
  Value<String> rubricSnapshot,
  Value<String?> discipline,
  Value<String?> evaluatorName,
  Value<String?> subjectName,
  Value<String?> tags,
  Value<String?> summaryNote,
  Value<int> createdAt,
  Value<int> updatedAt,
  Value<String?> importFingerprint,
  Value<int> rowid,
});

class $$AssessmentsTableFilterComposer
    extends Composer<_$AppDatabase, $AssessmentsTable> {
  $$AssessmentsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get rubricId => $composableBuilder(
      column: $table.rubricId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get rubricSnapshot => $composableBuilder(
      column: $table.rubricSnapshot,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get discipline => $composableBuilder(
      column: $table.discipline, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get evaluatorName => $composableBuilder(
      column: $table.evaluatorName, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get subjectName => $composableBuilder(
      column: $table.subjectName, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get tags => $composableBuilder(
      column: $table.tags, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get summaryNote => $composableBuilder(
      column: $table.summaryNote, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get importFingerprint => $composableBuilder(
      column: $table.importFingerprint,
      builder: (column) => ColumnFilters(column));
}

class $$AssessmentsTableOrderingComposer
    extends Composer<_$AppDatabase, $AssessmentsTable> {
  $$AssessmentsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get rubricId => $composableBuilder(
      column: $table.rubricId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get rubricSnapshot => $composableBuilder(
      column: $table.rubricSnapshot,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get discipline => $composableBuilder(
      column: $table.discipline, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get evaluatorName => $composableBuilder(
      column: $table.evaluatorName,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get subjectName => $composableBuilder(
      column: $table.subjectName, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get tags => $composableBuilder(
      column: $table.tags, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get summaryNote => $composableBuilder(
      column: $table.summaryNote, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get importFingerprint => $composableBuilder(
      column: $table.importFingerprint,
      builder: (column) => ColumnOrderings(column));
}

class $$AssessmentsTableAnnotationComposer
    extends Composer<_$AppDatabase, $AssessmentsTable> {
  $$AssessmentsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get rubricId =>
      $composableBuilder(column: $table.rubricId, builder: (column) => column);

  GeneratedColumn<String> get rubricSnapshot => $composableBuilder(
      column: $table.rubricSnapshot, builder: (column) => column);

  GeneratedColumn<String> get discipline => $composableBuilder(
      column: $table.discipline, builder: (column) => column);

  GeneratedColumn<String> get evaluatorName => $composableBuilder(
      column: $table.evaluatorName, builder: (column) => column);

  GeneratedColumn<String> get subjectName => $composableBuilder(
      column: $table.subjectName, builder: (column) => column);

  GeneratedColumn<String> get tags =>
      $composableBuilder(column: $table.tags, builder: (column) => column);

  GeneratedColumn<String> get summaryNote => $composableBuilder(
      column: $table.summaryNote, builder: (column) => column);

  GeneratedColumn<int> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<int> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  GeneratedColumn<String> get importFingerprint => $composableBuilder(
      column: $table.importFingerprint, builder: (column) => column);
}

class $$AssessmentsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $AssessmentsTable,
    Assessment,
    $$AssessmentsTableFilterComposer,
    $$AssessmentsTableOrderingComposer,
    $$AssessmentsTableAnnotationComposer,
    $$AssessmentsTableCreateCompanionBuilder,
    $$AssessmentsTableUpdateCompanionBuilder,
    (Assessment, BaseReferences<_$AppDatabase, $AssessmentsTable, Assessment>),
    Assessment,
    PrefetchHooks Function()> {
  $$AssessmentsTableTableManager(_$AppDatabase db, $AssessmentsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$AssessmentsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$AssessmentsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$AssessmentsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> rubricId = const Value.absent(),
            Value<String> rubricSnapshot = const Value.absent(),
            Value<String?> discipline = const Value.absent(),
            Value<String?> evaluatorName = const Value.absent(),
            Value<String?> subjectName = const Value.absent(),
            Value<String?> tags = const Value.absent(),
            Value<String?> summaryNote = const Value.absent(),
            Value<int> createdAt = const Value.absent(),
            Value<int> updatedAt = const Value.absent(),
            Value<String?> importFingerprint = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              AssessmentsCompanion(
            id: id,
            rubricId: rubricId,
            rubricSnapshot: rubricSnapshot,
            discipline: discipline,
            evaluatorName: evaluatorName,
            subjectName: subjectName,
            tags: tags,
            summaryNote: summaryNote,
            createdAt: createdAt,
            updatedAt: updatedAt,
            importFingerprint: importFingerprint,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String rubricId,
            required String rubricSnapshot,
            Value<String?> discipline = const Value.absent(),
            Value<String?> evaluatorName = const Value.absent(),
            Value<String?> subjectName = const Value.absent(),
            Value<String?> tags = const Value.absent(),
            Value<String?> summaryNote = const Value.absent(),
            required int createdAt,
            required int updatedAt,
            Value<String?> importFingerprint = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              AssessmentsCompanion.insert(
            id: id,
            rubricId: rubricId,
            rubricSnapshot: rubricSnapshot,
            discipline: discipline,
            evaluatorName: evaluatorName,
            subjectName: subjectName,
            tags: tags,
            summaryNote: summaryNote,
            createdAt: createdAt,
            updatedAt: updatedAt,
            importFingerprint: importFingerprint,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$AssessmentsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $AssessmentsTable,
    Assessment,
    $$AssessmentsTableFilterComposer,
    $$AssessmentsTableOrderingComposer,
    $$AssessmentsTableAnnotationComposer,
    $$AssessmentsTableCreateCompanionBuilder,
    $$AssessmentsTableUpdateCompanionBuilder,
    (Assessment, BaseReferences<_$AppDatabase, $AssessmentsTable, Assessment>),
    Assessment,
    PrefetchHooks Function()>;
typedef $$AnswersTableCreateCompanionBuilder = AnswersCompanion Function({
  required String id,
  required String assessmentId,
  required String criterionId,
  Value<String?> value,
  Value<String?> comment,
  Value<int> rowid,
});
typedef $$AnswersTableUpdateCompanionBuilder = AnswersCompanion Function({
  Value<String> id,
  Value<String> assessmentId,
  Value<String> criterionId,
  Value<String?> value,
  Value<String?> comment,
  Value<int> rowid,
});

class $$AnswersTableFilterComposer
    extends Composer<_$AppDatabase, $AnswersTable> {
  $$AnswersTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get assessmentId => $composableBuilder(
      column: $table.assessmentId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get criterionId => $composableBuilder(
      column: $table.criterionId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get value => $composableBuilder(
      column: $table.value, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get comment => $composableBuilder(
      column: $table.comment, builder: (column) => ColumnFilters(column));
}

class $$AnswersTableOrderingComposer
    extends Composer<_$AppDatabase, $AnswersTable> {
  $$AnswersTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get assessmentId => $composableBuilder(
      column: $table.assessmentId,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get criterionId => $composableBuilder(
      column: $table.criterionId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get value => $composableBuilder(
      column: $table.value, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get comment => $composableBuilder(
      column: $table.comment, builder: (column) => ColumnOrderings(column));
}

class $$AnswersTableAnnotationComposer
    extends Composer<_$AppDatabase, $AnswersTable> {
  $$AnswersTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get assessmentId => $composableBuilder(
      column: $table.assessmentId, builder: (column) => column);

  GeneratedColumn<String> get criterionId => $composableBuilder(
      column: $table.criterionId, builder: (column) => column);

  GeneratedColumn<String> get value =>
      $composableBuilder(column: $table.value, builder: (column) => column);

  GeneratedColumn<String> get comment =>
      $composableBuilder(column: $table.comment, builder: (column) => column);
}

class $$AnswersTableTableManager extends RootTableManager<
    _$AppDatabase,
    $AnswersTable,
    Answer,
    $$AnswersTableFilterComposer,
    $$AnswersTableOrderingComposer,
    $$AnswersTableAnnotationComposer,
    $$AnswersTableCreateCompanionBuilder,
    $$AnswersTableUpdateCompanionBuilder,
    (Answer, BaseReferences<_$AppDatabase, $AnswersTable, Answer>),
    Answer,
    PrefetchHooks Function()> {
  $$AnswersTableTableManager(_$AppDatabase db, $AnswersTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$AnswersTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$AnswersTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$AnswersTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> assessmentId = const Value.absent(),
            Value<String> criterionId = const Value.absent(),
            Value<String?> value = const Value.absent(),
            Value<String?> comment = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              AnswersCompanion(
            id: id,
            assessmentId: assessmentId,
            criterionId: criterionId,
            value: value,
            comment: comment,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String assessmentId,
            required String criterionId,
            Value<String?> value = const Value.absent(),
            Value<String?> comment = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              AnswersCompanion.insert(
            id: id,
            assessmentId: assessmentId,
            criterionId: criterionId,
            value: value,
            comment: comment,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$AnswersTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $AnswersTable,
    Answer,
    $$AnswersTableFilterComposer,
    $$AnswersTableOrderingComposer,
    $$AnswersTableAnnotationComposer,
    $$AnswersTableCreateCompanionBuilder,
    $$AnswersTableUpdateCompanionBuilder,
    (Answer, BaseReferences<_$AppDatabase, $AnswersTable, Answer>),
    Answer,
    PrefetchHooks Function()>;
typedef $$RubricsTableCreateCompanionBuilder = RubricsCompanion Function({
  required String id,
  required String title,
  Value<String?> discipline,
  required String origin,
  required int version,
  required String schema,
  required int updatedAt,
  Value<int> rowid,
});
typedef $$RubricsTableUpdateCompanionBuilder = RubricsCompanion Function({
  Value<String> id,
  Value<String> title,
  Value<String?> discipline,
  Value<String> origin,
  Value<int> version,
  Value<String> schema,
  Value<int> updatedAt,
  Value<int> rowid,
});

class $$RubricsTableFilterComposer
    extends Composer<_$AppDatabase, $RubricsTable> {
  $$RubricsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get title => $composableBuilder(
      column: $table.title, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get discipline => $composableBuilder(
      column: $table.discipline, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get origin => $composableBuilder(
      column: $table.origin, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get version => $composableBuilder(
      column: $table.version, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get schema => $composableBuilder(
      column: $table.schema, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnFilters(column));
}

class $$RubricsTableOrderingComposer
    extends Composer<_$AppDatabase, $RubricsTable> {
  $$RubricsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get title => $composableBuilder(
      column: $table.title, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get discipline => $composableBuilder(
      column: $table.discipline, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get origin => $composableBuilder(
      column: $table.origin, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get version => $composableBuilder(
      column: $table.version, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get schema => $composableBuilder(
      column: $table.schema, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnOrderings(column));
}

class $$RubricsTableAnnotationComposer
    extends Composer<_$AppDatabase, $RubricsTable> {
  $$RubricsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get title =>
      $composableBuilder(column: $table.title, builder: (column) => column);

  GeneratedColumn<String> get discipline => $composableBuilder(
      column: $table.discipline, builder: (column) => column);

  GeneratedColumn<String> get origin =>
      $composableBuilder(column: $table.origin, builder: (column) => column);

  GeneratedColumn<int> get version =>
      $composableBuilder(column: $table.version, builder: (column) => column);

  GeneratedColumn<String> get schema =>
      $composableBuilder(column: $table.schema, builder: (column) => column);

  GeneratedColumn<int> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);
}

class $$RubricsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $RubricsTable,
    Rubric,
    $$RubricsTableFilterComposer,
    $$RubricsTableOrderingComposer,
    $$RubricsTableAnnotationComposer,
    $$RubricsTableCreateCompanionBuilder,
    $$RubricsTableUpdateCompanionBuilder,
    (Rubric, BaseReferences<_$AppDatabase, $RubricsTable, Rubric>),
    Rubric,
    PrefetchHooks Function()> {
  $$RubricsTableTableManager(_$AppDatabase db, $RubricsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$RubricsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$RubricsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$RubricsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> title = const Value.absent(),
            Value<String?> discipline = const Value.absent(),
            Value<String> origin = const Value.absent(),
            Value<int> version = const Value.absent(),
            Value<String> schema = const Value.absent(),
            Value<int> updatedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              RubricsCompanion(
            id: id,
            title: title,
            discipline: discipline,
            origin: origin,
            version: version,
            schema: schema,
            updatedAt: updatedAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String title,
            Value<String?> discipline = const Value.absent(),
            required String origin,
            required int version,
            required String schema,
            required int updatedAt,
            Value<int> rowid = const Value.absent(),
          }) =>
              RubricsCompanion.insert(
            id: id,
            title: title,
            discipline: discipline,
            origin: origin,
            version: version,
            schema: schema,
            updatedAt: updatedAt,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$RubricsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $RubricsTable,
    Rubric,
    $$RubricsTableFilterComposer,
    $$RubricsTableOrderingComposer,
    $$RubricsTableAnnotationComposer,
    $$RubricsTableCreateCompanionBuilder,
    $$RubricsTableUpdateCompanionBuilder,
    (Rubric, BaseReferences<_$AppDatabase, $RubricsTable, Rubric>),
    Rubric,
    PrefetchHooks Function()>;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$AssessmentsTableTableManager get assessments =>
      $$AssessmentsTableTableManager(_db, _db.assessments);
  $$AnswersTableTableManager get answers =>
      $$AnswersTableTableManager(_db, _db.answers);
  $$RubricsTableTableManager get rubrics =>
      $$RubricsTableTableManager(_db, _db.rubrics);
}
