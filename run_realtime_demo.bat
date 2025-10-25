@echo off
echo 🔥 REAL-TIME HYDRATION DEMO
echo ===========================
echo.
echo This will start:
echo 1. ✅ Backend server (already running)
echo 2. ✅ Frontend app (already running) 
echo 3. 🚀 Continuous hardware simulation
echo.
echo The simulation will send data every 10 seconds until daily goal is reached
echo Your frontend will update every 5 seconds with real-time data
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:8000
echo.
echo ⚠️  Make sure to ENABLE FIREBASE MODE in the frontend dashboard!
echo.
pause
echo.
echo 🚀 Starting continuous simulation...
python continuous_simulation.py
