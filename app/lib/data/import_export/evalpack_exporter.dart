import 'dart:convert';
import 'dart:io';

import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

import '../../core/constants/file_types.dart';
import '../../core/utils/checksum.dart';
import '../../core/utils/zip_utils.dart';
import '../db/app_database.dart';
import 'evalpack_link_codec.dart';
import 'manifest_model.dart';

class EvalpackExporter {
  EvalpackExporter(this.db);
  final AppDatabase db;

  /// Builds evalpack payload JSON strings (assessment + rubric) and fingerprint.
  Future<({String assessmentJson, String rubricJson, String fingerprint})>
      _buildPayload(String assessmentId) async {
    final assessment = await db.getAssessmentById(assessmentId);
    if (assessment == null) throw StateError('Assessment not found');

    final answers = await db.listAnswers(assessmentId);

    final assessmentJson = jsonEncode({
      'id': assessment.id,
      'meta': {
        'evaluator': assessment.evaluatorName ?? '',
        'subject': assessment.subjectName ?? '',
        'createdAt': assessment.createdAt,
        // Optional: if you add scaleJson later, keep it here (won't break old imports)
        'scale': assessment.scaleJson == null ? null : jsonDecode(assessment.scaleJson!),
        'tags': assessment.tags != null ? jsonDecode(assessment.tags!) : [],
      },
      'answers': answers
          .map((a) => {
                'criterionId': a.criterionId,
                'value': a.value ?? '',
                'comment': a.comment ?? '',
              })
          .toList(),
      'summaryNote': assessment.summaryNote ?? '',
    });

    final rubricJson = assessment.rubricSnapshot;

    // IMPORTANT: stable fingerprint, no broken strings
    final fingerprintHex = sha256HexFromString('${assessmentJson}\n${rubricJson}');
    final fingerprint = 'sha256:$fingerprintHex';

    return (assessmentJson: assessmentJson, rubricJson: rubricJson, fingerprint: fingerprint);
  }

  /// Export as .evalpack (zip) file.
  Future<File> exportAssessmentToFile(String assessmentId) async {
    final payload = await _buildPayload(assessmentId);

    final manifest = EvalpackManifest(
      format: 'evalpack',
      version: 1,
      createdAtIso: DateTime.now().toUtc().toIso8601String(),
      type: 'assessment',
      fingerprint: payload.fingerprint,
      encryption: 'none',
    );

    final manifestJson = jsonEncode(manifest.toJson());

    final tempDir = await getTemporaryDirectory();

    // We want stable filenames; keep using your FileTypes constants.
    final filename = '${FileTypes.evalpackFilenamePrefix}$assessmentId.${FileTypes.evalpackExtension}';

    return zipToFile(
      outDir: tempDir,
      filename: filename,
      files: {
        'manifest.json': utf8.encode(manifestJson),
        'assessment.json': utf8.encode(payload.assessmentJson),
        'rubric.json': utf8.encode(payload.rubricJson),
      },
    );
  }

  /// Share as file via OS share sheet.
  Future<void> shareAssessment(String assessmentId) async {
    final file = await exportAssessmentToFile(assessmentId);
    await Share.shareXFiles([XFile(file.path)], text: 'Arviointi (.evalpack)');
  }

  /// Share as link (deep link with compressed payload).
  /// Auto-fallback to file share if the link would likely be too long.
  Future<void> shareAssessmentAsLink(String assessmentId) async {
    final payload = await _buildPayload(assessmentId);

    final pack = jsonEncode({
      'format': 'evalpack-link',
      'version': 1,
      'assessmentJson': payload.assessmentJson,
      'rubricJson': payload.rubricJson,
      'fingerprint': payload.fingerprint,
    });

    final b64 = EvalpackLinkCodec.encodeJsonToB64Url(pack);

    // Guard against message-app truncation
    if (EvalpackLinkCodec.isLikelyTooLarge(b64)) {
      await shareAssessment(assessmentId);
      return;
    }

    // Your scheme (configure later for iOS/Android)
    final uri = Uri.parse('taitoarvio://import?d=$b64');

    // Share the URI as plain text (works everywhere)
    await Share.share(uri.toString(), subject: 'Arviointi-linkki');
  }
}
