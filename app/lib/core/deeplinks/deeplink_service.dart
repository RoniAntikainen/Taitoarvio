import 'dart:async';
import 'package:app_links/app_links.dart';

class DeeplinkService {
  DeeplinkService();

  final _appLinks = AppLinks();
  StreamSubscription<Uri>? _sub;

  void start({
    required Future<void> Function(Uri uri) onUri,
  }) {
    _sub?.cancel();

    // initial
    _appLinks.getInitialLink().then((uri) async {
      if (uri != null) await onUri(uri);
    });

    // stream
    _sub = _appLinks.uriLinkStream.listen((uri) async {
      await onUri(uri);
    });
  }

  void dispose() {
    _sub?.cancel();
    _sub = null;
  }
}
