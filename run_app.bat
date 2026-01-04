@echo off
title Taitoarvio – Flutter Run

echo ===============================
echo  Taitoarvio – Flutter launcher
echo ===============================
echo.

REM Siirrytään app-kansioon
cd /d "%~dp0app"

echo Current directory:
cd
echo.

REM Tarkistetaan Flutter
echo Checking Flutter...
flutter --version
if errorlevel 1 (
  echo.
  echo ERROR: Flutter not found in PATH
  pause
  exit /b
)

echo.
echo Cleaning project...
flutter clean

echo.
echo Getting packages...
flutter pub get

echo.
echo Building generated files...
dart run build_runner build --delete-conflicting-outputs

echo.
echo Launching app (Windows)...
flutter run -d windows

echo.
pause
