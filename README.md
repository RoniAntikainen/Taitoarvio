# Arviointi-app (Flutter MVP) – valmis import/export/share

Tämä ZIP sisältää **lib/** + konfiguraatiot, joilla saat heti toimivan MVP:n:
- SQLite/Drift DB
- Kirjasto (listaus)
- Demoarviointi + dem rubriikki
- Export -> .evalpack (ZIP: manifest.json + assessment.json + rubric.json)
- Share OS:n kautta
- Import:
  - manuaalisesti FilePickerillä
  - automaattisesti jaetuista tiedostoista (receive_sharing_intent)

## Käynnistys

1) Luo Flutter-projekti ja kopioi sisällöt (helpoin tapa):
```bash
flutter create arviointi_app
```

2) Korvaa luodun projektin tiedostot tällä paketilla:
- pubspec.yaml
- analysis_options.yaml
- lib/
- README.md

3) Asenna ja generoi:
```bash
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
flutter run
```

## Huomio: android/ ja ios/ kansiot

Tässä ZIPissä ei ole mukana `android/` ja `ios/`, koska ne ovat Flutterin generoimia.
Jos haluat ZIPin, jossa on **koko Flutter-projekti myös android/ ios/**, sano se suoraan, niin teen sen seuraavaksi.
