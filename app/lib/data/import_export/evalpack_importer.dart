import 'dart:convert';
import 'dart:io';

import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';

import '../../core/utils/checksum.dart';
import '../../core/utils/zip_utils.dart';
import '../db/app_database.dart';
import 'manifest_model.dart';

class EvalpackImporter {
  EvalpackImporter(this.db);
  final AppDatabase db;
  final _uuid = const Uuid();

  Future<String> importFromFile(File evalpackFile) async {
    final files = await unzipFromFile(evalpackFile);

    final manifestBytes = files['manifest.json'];
    final assessmentBytes = files['assessment.json'];
    final rubricBytes = files['rubric.json'];

    if (manifestBytes == null || assessmentBytes == null || rubricBytes == null) {
      throw const FormatException('evalpack missing required files');
    }

    final manifestJson =
        jsonDecode(utf8.decode(manifestBytes)) as Map<String, dynamic>;
    final manifest = EvalpackManifest.fromJson(manifestJson);

    if (manifest.format != 'evalpack' || manifest.version != 1) {
      throw const FormatException('Unsupported evalpack format/version');
    }
    if (manifest.encryption != 'none') {
      throw const FormatException('Encryption not supported in MVP');
    }

    final assessmentJsonStr = utf8.decode(assessmentBytes);
    final rubricJsonStr = utf8.decode(rubricBytes);

    // IMPORTANT: sama fingerprint-sääntö kuin exporterissa
    final computed =
        'sha256:${sha256HexFromString('${assessmentJsonStr}\n${rubricJsonStr}')}';

    if (computed != manifest.fingerprint) {
      throw const FormatException('Fingerprint mismatch (corrupt file?)');
    }

    final already = await db.hasFingerprint(manifest.fingerprint);
    if (already) {
      throw StateError('This evalpack has already been imported');
    }

    final assessmentObj = jsonDecode(assessmentJsonStr) as Map<String, dynamic>;
    final rubricObj = jsonDecode(rubricJsonStr) as Map<String, dynamic>;

    final rubricId = rubricObj['id'] as String? ?? _uuid.v4();
    final rubricTitle = (rubricObj['title'] as String?) ?? 'Imported Rubric';
    final rubricVersion = (rubricObj['version'] as num?)?.toInt() ?? 1;

    await db.upsertRubric(
      RubricsCompanion.insert(
        id: rubricId,
        title: rubricTitle,
        origin: 'imported',
        version: rubricVersion,
        schema: rubricJsonStr,
        updatedAt: DateTime.now().millisecondsSinceEpoch,
        discipline: const Value(null),
      ),
    );

    final newAssessmentId = _uuid.v4();
    final now = DateTime.now().millisecondsSinceEpoch;

    final meta = (assessmentObj['meta'] as Map<String, dynamic>?) ?? {};
    final evaluator = (meta['evaluator'] as String?) ?? '';
    final subject = (meta['subject'] as String?) ?? '';
    final tags = meta['tags'] ?? [];

    await db.upsertAssessment(
      AssessmentsCompanion.insert(
        id: newAssessmentId,
        rubricId: rubricId,
        rubricSnapshot: rubricJsonStr,
        discipline: const Value(null),
        evaluatorName: Value(evaluator),
        subjectName: Value(subject),
        tags: Value(jsonEncode(tags)),
        summaryNote: Value((assessmentObj['summaryNote'] as String?) ?? ''),
        createdAt: now,
        updatedAt: now,
        importFingerprint: Value(manifest.fingerprint),
      ),
    );

    final answers = (assessmentObj['answers'] as List<dynamic>? ?? const []);
    await db.replaceAnswers(
      newAssessmentId,
      answers.map((e) {
        final m = e as Map<String, dynamic>;
        return AnswersCompanion.insert(
          id: _uuid.v4(),
          assessmentId: newAssessmentId,
          criterionId: (m['criterionId'] as String?) ?? '',
          value: Value((m['value'] as String?) ?? ''),
          comment: Value((m['comment'] as String?) ?? ''),
        );
      }).toList(),
    );

    return newAssessmentId;
  }
}
