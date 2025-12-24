@echo off
echo Starting PDF Master Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && D:\pdf-master\.venv\Scripts\python.exe -m uvicorn server:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting in separate windows!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
pause
