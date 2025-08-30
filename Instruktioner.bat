@echo off
cd /d "%~dp0"

:: Start frontend and backend in parallel
start "" /B cmd /C "npm run start:all"

:: Wait for frontend to become available
:waitloop
timeout /T 1 >nul
curl --silent --head http://localhost:5173 | find "200 OK" >nul
if errorlevel 1 goto waitloop

:: Open default browser to frontend
start http://localhost:5173

:: Keep the window open to show logs (optional)
pause
