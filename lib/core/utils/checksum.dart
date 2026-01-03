import 'dart:convert';
import 'package:crypto/crypto.dart';

String sha256Hex(List<int> bytes) {
  final digest = sha256.convert(bytes);
  return digest.toString();
}

String sha256HexFromString(String s) {
  return sha256Hex(utf8.encode(s));
}
