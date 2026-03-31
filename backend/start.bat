@echo off
cd /d "%~dp0"
venv\Scripts\python.exe -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
pause
