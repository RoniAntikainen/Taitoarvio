@'
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

  @override
  void initState() {
    super.initState();
    ReceiveSharingIntent.instance.getInitialMedia().then(_handleSharedFiles);
    _sub = ReceiveSharingIntent.instance.getMediaStream().listen(_handleSharedFiles);
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

    ReceiveSharingIntent.instance.reset();
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('Kirjasto')),
    );
  }
}
'@ | Set-Content -Encoding UTF8 .\lib\features\library\library_screen.dart
