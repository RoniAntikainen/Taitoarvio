import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'app_settings.dart';

final settingsProvider =
    StateNotifierProvider<SettingsController, AsyncValue<AppSettings>>(
  (ref) => SettingsController()..load(),
);

class SettingsController extends StateNotifier<AsyncValue<AppSettings>> {
  SettingsController() : super(const AsyncValue.loading());

  static const _kOnboarded = 'onboarded';
  static const _kRole = 'role';
  static const _kUserName = 'userName';
  static const _kDiscipline = 'discipline';

  Future<void> load() async {
    final sp = await SharedPreferences.getInstance();

    final onboarded = sp.getBool(_kOnboarded) ?? false;
    final roleStr = sp.getString(_kRole) ?? 'coach';
    final role = roleStr == 'student' ? AppRole.student : AppRole.coach;

    final userName = sp.getString(_kUserName) ?? '';
    final discipline = sp.getString(_kDiscipline) ?? 'Paritanssi';

    state = AsyncValue.data(
      AppSettings(
        isOnboarded: onboarded,
        role: role,
        userName: userName,
        discipline: discipline,
      ),
    );
  }

  Future<void> completeOnboarding({
    required AppRole role,
    required String userName,
    required String discipline,
  }) async {
    final sp = await SharedPreferences.getInstance();
    await sp.setBool(_kOnboarded, true);
    await sp.setString(_kRole, role == AppRole.student ? 'student' : 'coach');
    await sp.setString(_kUserName, userName);
    await sp.setString(_kDiscipline, discipline);

    state = AsyncValue.data(
      AppSettings(
        isOnboarded: true,
        role: role,
        userName: userName,
        discipline: discipline,
      ),
    );
  }

  Future<void> updateDiscipline(String discipline) async {
    final current = state.value;
    if (current == null) return;

    final sp = await SharedPreferences.getInstance();
    await sp.setString(_kDiscipline, discipline);
    state = AsyncValue.data(current.copyWith(discipline: discipline));
  }
}
