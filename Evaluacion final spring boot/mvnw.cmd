@REM ----------------------------------------------------------------------------
@REM Maven Wrapper (lite) for Windows: downloads Maven distro and runs mvn.cmd
@REM ----------------------------------------------------------------------------

@echo off
setlocal

set DIR=%~dp0
set WRAPPER_PROPERTIES=%DIR%.mvn\wrapper\maven-wrapper.properties

for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Content '%WRAPPER_PROPERTIES%' | Where-Object { $_ -match '^distributionUrl=' }) -replace '^distributionUrl=', ''"') do set DIST_URL=%%i

if "%DIST_URL%"=="" (
  echo distributionUrl not found in %WRAPPER_PROPERTIES%
  exit /b 1
)

set DIST_DIR=%DIR%maven-dist
if not exist "%DIST_DIR%" mkdir "%DIST_DIR%"

for /f "delims=" %%i in ('powershell -NoProfile -Command "$u='%DIST_URL%'; [System.IO.Path]::GetFileName($u)"') do set ZIP_NAME=%%i
set ZIP_PATH=%DIST_DIR%\%ZIP_NAME%

if not exist "%ZIP_PATH%" (
  echo Downloading Maven distribution: %DIST_URL%
  powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('%DIST_URL%', '%ZIP_PATH%')"
)

set EXTRACT_DIR=%DIST_DIR%\extracted
if not exist "%EXTRACT_DIR%" (
  powershell -NoProfile -Command "Expand-Archive -Path '%ZIP_PATH%' -DestinationPath '%EXTRACT_DIR%'"
)

for /f "delims=" %%i in ('dir /b "%EXTRACT_DIR%"') do set MAVEN_DIR=%%i
set MAVEN_BIN=%EXTRACT_DIR%\%MAVEN_DIR%\bin\mvn.cmd

if not exist "%MAVEN_BIN%" (
  echo Maven binary not found after extraction.
  exit /b 1
)

set MAVEN_PROJECTBASEDIR=%DIR%
"%MAVEN_BIN%" %*
exit /b %ERRORLEVEL%