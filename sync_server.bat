
if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off

cd D:\worK\Online MongoDB Sync

start /min cmd /C "nodemon start"
goto :EOF
:minimized