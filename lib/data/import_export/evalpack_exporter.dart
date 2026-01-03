@'
import 'dart:convert';
import 'dart:io';

import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

import '../../core/constants/file_types.dart';
import '../../core/utils/checksum.dart';
import '../../core/utils/zip_utils.dart';
import '../db/app_database.dart';
import 'manifest_model.dart';

class EvalpackExporter {
  EvalpackExporter(this.db);
  final AppDatabase db;

  Future<File> exportAssessmentToFile(String assessmentId) async {
    final assessment = await db.getAssessmentById(assessmentId);
    if (assessment == null) throw StateError('Assessment not found');

    final answers = await db.listAnswers(assessmentId);

    final assessmentJson = jsonEncode({
      'id': assessment.id,
      'meta': {
        'evaluator': assessment.evaluatorName ?? '',
        'subject': assessment.subjectName ?? '',
        'date': DateTime.fromMillisecondsSinceEpoch(assessment.createdAt)
            .toIso8601String()
            .substring(0, 10),
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

    // IMPORTANT: separator is '\n' inside the same Dart string
    final fingerprintHex =
        sha256HexFromString('${assessmentJson}\n${rubricJson}');
    final fingerprint = 'sha256:$fingerprintHex';

    final manifest = EvalpackManifest(
      format: 'evalpack',
      version: 1,
      createdAtIso: DateTime.now().toUtc().toIso8601String(),
      type: 'assessment',
      fingerprint: fingerprint,
      encryption: 'none',
    );

    final manifestJson = jsonEncode(manifest.toJson());

    final tempDir = await getTemporaryDirectory();
    final filename =
        '${FileTypes.evalpackFilenamePrefix}${assessment.id}.${FileTypes.evalpackExtension}';

    return zipToFile(
      outDir: tempDir,
      filename: filename,
      files: {
        'manifest.json': utf8.encode(manifestJson),
        'assessment.json': utf8.encode(assessmentJson),
        'rubric.json': utf8.encode(rubricJson),
      },
    );
  }

  Future<void> shareAssessment(String assessmentId) async {
    final file = await exportAssessmentToFile(assessmentId);
    await Share.shareXFiles([XFile(file.path)], text: 'Arviointi');
  }
}
'@ | Set-Content -Encoding UTF8 .\lib\data\import_export\evalpack_exporter.dart
