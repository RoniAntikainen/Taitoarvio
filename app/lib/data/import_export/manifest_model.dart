class EvalpackManifest {
  EvalpackManifest({
    required this.format,
    required this.version,
    required this.createdAtIso,
    required this.type,
    required this.fingerprint,
    required this.encryption,
  });

  final String format;
  final int version;
  final String createdAtIso;
  final String type;
  final String fingerprint;
  final String encryption;

  Map<String, dynamic> toJson() => {
        'format': format,
        'version': version,
        'createdAt': createdAtIso,
        'type': type,
        'fingerprint': fingerprint,
        'encryption': encryption,
      };

  static EvalpackManifest fromJson(Map<String, dynamic> json) {
    return EvalpackManifest(
      format: (json['format'] as String?) ?? '',
      version: (json['version'] as num?)?.toInt() ?? 0,
      createdAtIso: (json['createdAt'] as String?) ?? '',
      type: (json['type'] as String?) ?? '',
      fingerprint: (json['fingerprint'] as String?) ?? '',
      encryption: (json['encryption'] as String?) ?? 'none',
    );
  }
}
