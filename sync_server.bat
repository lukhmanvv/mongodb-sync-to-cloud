:init
set "started="
2>nul (
 9>"%~f0.lock" (
  set "started=1"
  call :start
 )
)
@if defined started (
    del "%~f0.lock" >nul 2>nul
) else (
    echo Process aborted: "%~f0" is already running
    @ping localhost > nul
)

exit /b

:start
cd /d %~dp0

if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off

cd D:\worK\Online MongoDB Sync

start /min cmd /C "nodemon java"
goto :EOF
:minimized