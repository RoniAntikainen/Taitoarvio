@echo off
setlocal EnableDelayedExpansion

REM Projektin kansio
set "SRC=%~dp0"
set "SRC=%SRC:~0,-1%"

REM Timestamp
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set TS=%%i

set "DST=%SRC%_export_%TS%"
set "ZIP=%SRC%\project_%TS%.zip"

echo.
echo === Luodaan export kansio ===
echo.

mkdir "%DST%" || (
  echo Export-kansion luonti epäonnistui.
  pause
  exit /b 1
)

echo.
echo === Kopioidaan projekti ===
echo.

robocopy "%SRC%" "%DST%" /E ^
  /XD node_modules .next dist build .turbo .cache coverage .git ^
  /XF .env *.log *.db *.sqlite tsconfig.tsbuildinfo project_*.zip

if %ERRORLEVEL% GEQ 8 (
  echo Kopioinnissa tapahtui virhe.
  pause
  exit /b 1
)

echo.
echo === Tehdään ZIP ===
echo.

powershell -NoProfile -Command "Compress-Archive -Path '%DST%\*' -DestinationPath '%ZIP%' -Force"

if %ERRORLEVEL% NEQ 0 (
  echo Zipin luonti epäonnistui.
  pause
  exit /b 1
)

echo.
echo === VALMIS ===
echo Zip luotu: %ZIP%
echo.

pause
