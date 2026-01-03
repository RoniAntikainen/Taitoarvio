import 'dart:async';
import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:receive_sharing_intent/receive_sharing_intent.dart';

import '../../app.dart';

class LibraryScreen extends ConsumerStatefulWidget {
  const LibraryScreen({super.key});

  @override
  ConsumerState<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends ConsumerState<LibraryScreen> {
  StreamSubscription<List<SharedMediaFile>>? _sub;

  bool get _supportsReceiveShare =>
      Platform.isAndroid || Platform.isIOS; // Windows/mac/linux: false

  @override
  void initState() {
    super.initState();

    // Vain mobiilissa: kuunnellaan jaetut tiedostot
    if (_supportsReceiveShare) {
      ReceiveSharingIntent.instance.getInitialMedia().then(_handleSharedFiles);
      _sub = ReceiveSharingIntent.instance.getMediaStream().listen(_handleSharedFiles);
    }
  }

  Future<void> _handleSharedFiles(List<SharedMediaFile> files) async {
    if (files.isEmpty) return;

    final evalpacks = files
        .map((f) => f.path)
        .where((p) => p.toLowerCase().endsWith('.evalpack'))
        .toList();

    if (evalpacks.isEmpty) return;

    final importer = ref.read(importerProvider);

    for (final p in evalpacks) {
      try {
        await importer.importFromFile(File(p));
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Import onnistui (jaettu tiedosto)')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Import epäonnistui: $e')),
          );
        }
      }
    }

    // Reset vain mobiilissa
    if (_supportsReceiveShare) {
      ReceiveSharingIntent.instance.reset();
    }

    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  Future<void> _createSample() async {
    final repo = ref.read(assessmentRepoProvider);
    await repo.createSampleAssessment(evaluator: 'Valmentaja', subject: 'Oppilas');
    if (mounted) setState(() {});
  }

  Future<void> _importManual() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: const ['evalpack'],
      withData: false,
    );
    if (result == null || result.files.single.path == null) return;

    final importer = ref.read(importerProvider);
    try {
      await importer.importFromFile(File(result.files.single.path!));
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Import onnistui')),
        );
      }
      if (mounted) setState(() {});
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Import epäonnistui: $e')),
        );
      }
    }
  }

  Future<void> _share(String assessmentId) async {
    final exporter = ref.read(exporterProvider);
    await exporter.shareAssessment(assessmentId);
  }

  @override
  Widget build(BuildContext context) {
    final repo = ref.watch(assessmentRepoProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kirjasto'),
        actions: [
          IconButton(
            onPressed: _importManual,
            icon: const Icon(Icons.file_upload_outlined),
            tooltip: 'Import .evalpack',
          ),
        ],
      ),
      body: FutureBuilder(
        future: repo.list(),
        builder: (context, snapshot) {
          final data = snapshot.data ?? const [];
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (data.isEmpty) {
            return const Center(
              child: Text('Ei arviointeja vielä. Luo esimerkki tai importtaa .evalpack.'),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(12),
            itemCount: data.length,
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (context, i) {
              final a = data[i];
              return Card(
                child: ListTile(
                  title: Text(a.subjectName ?? 'Arviointi'),
                  subtitle: Text('Arvioija: ${a.evaluatorName ?? '-'}'),
                  trailing: IconButton(
                    icon: const Icon(Icons.share_outlined),
                    onPressed: () => _share(a.id),
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _createSample,
        icon: const Icon(Icons.add),
        label: const Text('Luo esimerkki'),
      ),
    );
  }
}
