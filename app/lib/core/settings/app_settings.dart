enum AppRole { coach, student }

class AppSettings {
  const AppSettings({
    required this.isOnboarded,
    required this.role,
    required this.userName,
    required this.discipline,
  });

  final bool isOnboarded;
  final AppRole role;
  final String userName;
  final String discipline;

  AppSettings copyWith({
    bool? isOnboarded,
    AppRole? role,
    String? userName,
    String? discipline,
  }) {
    return AppSettings(
      isOnboarded: isOnboarded ?? this.isOnboarded,
      role: role ?? this.role,
      userName: userName ?? this.userName,
      discipline: discipline ?? this.discipline,
    );
  }
}
