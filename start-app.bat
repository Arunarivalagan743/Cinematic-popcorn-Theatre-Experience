@echo off
echo Starting Cinematic Popcorn Park Application...
echo ========================================

REM Start the API server
echo Starting API server...
start cmd /k "cd api && npm run dev"

REM Wait for a moment to let the API server start
timeout /t 5 /nobreak

REM Start the client
echo Starting React client...
start cmd /k "cd client && npm run dev"

echo ========================================
echo Application started successfully!
echo - API is running on http://localhost:5000
echo - Client is running on http://localhost:5173
echo ========================================
echo Press any key to close this window...
pause > nul
