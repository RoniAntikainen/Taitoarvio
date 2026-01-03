import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'data/db/app_database.dart';
import 'data/repositories/assessment_repository.dart';
import 'data/import_export/evalpack_exporter.dart';
import 'data/import_export/evalpack_importer.dart';
import 'features/library/library_screen.dart';

final dbProvider = Provider<AppDatabase>((ref) {
  final db = AppDatabase();
  ref.onDispose(db.close);
  return db;
});

final assessmentRepoProvider = Provider<AssessmentRepository>((ref) {
  return AssessmentRepository(ref.watch(dbProvider));
});

final exporterProvider = Provider<EvalpackExporter>((ref) {
  return EvalpackExporter(ref.watch(dbProvider));
});

final importerProvider = Provider<EvalpackImporter>((ref) {
  return EvalpackImporter(ref.watch(dbProvider));
});

class AppRoot extends StatelessWidget {
  const AppRoot({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Arviointi',
      theme: ThemeData(useMaterial3: true),
      home: const LibraryScreen(),
    );
  }
}
