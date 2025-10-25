@echo off
echo 🔥 Smart Hydration Hardware Simulator
echo =====================================
echo.
echo This will simulate continuous water drinking until daily goal is reached
echo The goal is calculated as: User Weight (kg) × 35ml
echo.
echo Make sure your backend server is running at http://localhost:8000
echo.
pause
echo.
echo Starting simulation...
python smart_hardware_simulation.py
pause
