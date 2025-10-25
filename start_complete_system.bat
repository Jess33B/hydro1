@echo off
title Hydration Hero - Complete System
echo 🚀 HYDRATION HERO - COMPLETE SYSTEM STARTUP
echo =============================================
echo.
echo Starting all components of your hydration tracking system:
echo.
echo 1. 🔧 Backend API Server (FastAPI + Firebase)
echo 2. 📱 Frontend Web Application (React + Vite)  
echo 3. 🔥 Hardware Simulation (Continuous Firebase updates)
echo.
echo ⚠️  This will open 3 terminal windows - DO NOT CLOSE THEM
echo.
pause

echo.
echo 🔧 Starting Backend Server...
start "Backend API Server" cmd /k "cd /d %~dp0backend && echo 🔧 BACKEND SERVER && echo ================= && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3

echo 📱 Starting Frontend Application...
start "Frontend App" cmd /k "cd /d %~dp0frontend && echo 📱 FRONTEND APPLICATION && echo ===================== && npm run dev"

timeout /t 5

echo 🔥 Starting Production Hardware...
start "Production Hardware" cmd /k "cd /d %~dp0 && echo 🔥 PRODUCTION HARDWARE && echo ==================== && python production_hardware.py"

echo.
echo ✅ ALL SYSTEMS STARTED!
echo.
echo 📋 SYSTEM STATUS:
echo ├── Backend API: http://localhost:8000
echo ├── API Documentation: http://localhost:8000/docs
echo ├── Frontend App: http://localhost:5173
echo └── Hardware Simulation: Running continuously
echo.
echo 🎯 NEXT STEPS:
echo 1. Wait 10 seconds for all services to start
echo 2. Open http://localhost:5173 in your browser
echo 3. Go to Dashboard
echo 4. Click "Enable Firebase Mode" 🔥
echo 5. Watch real-time updates!
echo.
echo 🛑 TO STOP: Close all 3 terminal windows
echo.
pause
