@echo off
setlocal EnableDelayedExpansion

REM Projektin sijainti = tämän .bat tiedoston kansio
set "SRC=%~dp0"
set "SRC=%SRC:~0,-1%"

REM Export-kansio
set "DST=%SRC%_export"

REM Poista vanha export
if exist "%DST%" rmdir /s /q "%DST%"

REM Luo export-kansio
mkdir "%DST%"

echo.
echo === Kopioidaan projekti ilman turhia kansioita ===
echo.

robocopy "%SRC%" "%DST%" /E ^
  /XD node_modules .next dist build .turbo .cache coverage .git ^
  /XF .env .env.* *.log *.db *.sqlite tsconfig.tsbuildinfo

echo.
echo === Tehdään ZIP ===
echo.

powershell -Command "Compress-Archive -Path '%DST%\*' -DestinationPath '%SRC%\project.zip' -Force"

echo.
echo === VALMIS ===
echo Zip luotu: %SRC%\project.zip
pause
