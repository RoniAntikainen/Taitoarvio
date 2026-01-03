import 'dart:convert';
import 'dart:typed_data';
import 'dart:io' show gzip;

class EvalpackLinkCodec {
  /// Pack JSON string -> gzip -> base64url
  static String encodeJsonToB64Url(String jsonStr) {
    final bytes = utf8.encode(jsonStr);
    final gz = gzip.encode(bytes);
    return base64UrlEncode(gz);
  }

  /// base64url -> gunzip -> JSON string
  static String decodeB64UrlToJson(String b64url) {
    final gz = base64Url.decode(b64url);
    final bytes = gzip.decode(gz);
    return utf8.decode(bytes);
  }

  /// Rough guard to avoid message apps truncating links.
  static bool isLikelyTooLarge(String b64url, {int maxChars = 6000}) {
    return b64url.length > maxChars;
  }
}
