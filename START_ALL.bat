@echo off
echo Starting ChainForecast Application...
echo.

echo Starting ML Server (Port 8000)...
start "ML Server" cmd /k "cd ml && python -m uvicorn main:app --reload --port 8000"
timeout /t 3 /nobreak >nul

echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo Starting Frontend (Port 5173)...
start "Frontend" cmd /k "cd frontend\redact_data_drifters && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo All services are starting...
echo - ML Server: http://localhost:8000
echo - Backend Server: http://localhost:5000
echo - Frontend: http://localhost:5173
echo.
echo Press any key to exit this window (services will continue running)
pause >nul

