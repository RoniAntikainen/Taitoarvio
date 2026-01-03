import 'dart:convert';
import 'dart:io';

import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';

import '../../core/utils/checksum.dart';
import '../../core/utils/zip_utils.dart';
import '../db/app_database.dart';
import 'evalpack_link_codec.dart';
import 'manifest_model.dart';

class EvalpackImporter {
  EvalpackImporter(this.db);
  final AppDatabase db;
  final _uuid = const Uuid();

  /// Import from .evalpack file (zip).
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

    return _importFromStrings(
      assessmentJsonStr: assessmentJsonStr,
      rubricJsonStr: rubricJsonStr,
      expectedFingerprint: manifest.fingerprint,
    );
  }

  /// Import from deep link payload:
  /// taitoarvio://import?d=<base64url(gzip(json))>
  Future<String> importFromLinkParam(String b64url) async {
    final jsonStr = EvalpackLinkCodec.decodeB64UrlToJson(b64url);
    final obj = jsonDecode(jsonStr) as Map<String, dynamic>;

    // Payload format written by exporter.shareAssessmentAsLink()
    final format = obj['format'] as String?;
    final version = (obj['version'] as num?)?.toInt();

    if (format != 'evalpack-link' || version != 1) {
      throw const FormatException('Unsupported link payload format/version');
    }

    final assessmentJsonStr = obj['assessmentJson'] as String?;
    final rubricJsonStr = obj['rubricJson'] as String?;
    final fingerprint = obj['fingerprint'] as String?;

    if (assessmentJsonStr == null || rubricJsonStr == null || fingerprint == null) {
      throw const FormatException('Invalid link payload (missing fields)');
    }

    return _importFromStrings(
      assessmentJsonStr: assessmentJsonStr,
      rubricJsonStr: rubricJsonStr,
      expectedFingerprint: fingerprint,
    );
  }

  /// Shared core import logic:
  /// - compute fingerprint from (assessmentJson + "\n" + rubricJson)
  /// - verify against expected fingerprint (from manifest or link)
  /// - dupe-check
  /// - upsert rubric, create assessment + answers
  Future<String> _importFromStrings({
    required String assessmentJsonStr,
    required String rubricJsonStr,
    required String expectedFingerprint,
  }) async {
    final computedHex =
        sha256HexFromString('${assessmentJsonStr}\n${rubricJsonStr}');
    final computed = 'sha256:$computedHex';

    if (computed != expectedFingerprint) {
      throw const FormatException('Fingerprint mismatch (corrupt data?)');
    }

    final already = await db.hasFingerprint(expectedFingerprint);
    if (already) {
      throw StateError('This evalpack has already been imported');
    }

    final assessmentObj = jsonDecode(assessmentJsonStr) as Map<String, dynamic>;
    final rubricObj = jsonDecode(rubricJsonStr) as Map<String, dynamic>;

    // Rubric
    final rubricId = rubricObj['id'] as String? ?? _uuid.v4();
    final rubricTitle = (rubricObj['title'] as String?) ?? 'Imported Rubric';
    final rubricVersion = (rubricObj['version'] as num?)?.toInt() ?? 1;

    await db.upsertRubric(RubricsCompanion.insert(
      id: rubricId,
      title: rubricTitle,
      origin: 'imported',
      version: rubricVersion,
      schema: rubricJsonStr,
      updatedAt: DateTime.now().millisecondsSinceEpoch,
      discipline: const Value(null),
    ));

    // Assessment
    final newAssessmentId = _uuid.v4();
    final now = DateTime.now().millisecondsSinceEpoch;

    final meta = (assessmentObj['meta'] as Map<String, dynamic>?) ?? {};
    final evaluator = (meta['evaluator'] as String?) ?? '';
    final subject = (meta['subject'] as String?) ?? '';

    final tagsDynamic = meta['tags'];
    final tags = tagsDynamic is List ? tagsDynamic : const [];

    // Optional scale (if you add scaleJson column later, keep this)
    final scaleDynamic = meta['scale'];

    await db.upsertAssessment(AssessmentsCompanion.insert(
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
      importFingerprint: Value(expectedFingerprint),

      // If you later add scaleJson column, uncomment this and add field:
      // scaleJson: Value(scaleDynamic == null ? null : jsonEncode(scaleDynamic)),
    ));

    // Answers
    final answers = (assessmentObj['answers'] as List<dynamic>? ?? const []);
    await db.replaceAnswers(
      newAssessmentId,
      answers.map((e) {
        final m = e as Map<String, dynamic>;
        return AnswersCompanion.insert(
          id: _uuid.v4(),
          assessmentId: newAssessmentId,
          criterionId: (m['criterionId'] as String?) ?? 'unknown',
          value: Value((m['value'] as String?) ?? ''),
          comment: Value((m['comment'] as String?) ?? ''),
        );
      }).toList(),
    );

    return newAssessmentId;
  }
}
