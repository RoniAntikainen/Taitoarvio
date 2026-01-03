import 'dart:io';
import 'package:archive/archive.dart';

Future<File> zipToFile({
  required Directory outDir,
  required String filename,
  required Map<String, List<int>> files,
}) async {
  final archive = Archive();
  files.forEach((path, bytes) {
    archive.addFile(ArchiveFile(path, bytes.length, bytes));
  });

  final zipData = ZipEncoder().encode(archive);
  if (zipData == null) {
    throw StateError('ZipEncoder failed');
  }

  final outFile = File('${outDir.path}/$filename');
  return outFile.writeAsBytes(zipData, flush: true);
}

Future<Map<String, List<int>>> unzipFromFile(File zipFile) async {
  final bytes = await zipFile.readAsBytes();
  final archive = ZipDecoder().decodeBytes(bytes);

  final result = <String, List<int>>{};
  for (final f in archive) {
    if (f.isFile) {
      final data = f.content as List<int>;
      result[f.name] = data;
    }
  }
  return result;
}
