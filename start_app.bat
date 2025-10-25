@echo off
echo Starting Hydration Hero App with Firebase Integration...

echo.
echo 1. Testing Firebase connection...
python test_firebase_data.py

echo.
echo 2. Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3

echo.
echo 3. Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers are starting...
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo 🔥 To use Firebase mode:
echo    1. Open the app in your browser
echo    2. Go to Dashboard
echo    3. Click "Enable Firebase Mode"
echo.
pause
