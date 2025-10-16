Hydration Hero – Smart Water Bottle App

Overview
Hydration Hero tracks daily water intake in real time via an ESP32 BLE-enabled smart bottle. A web dashboard connects over Web Bluetooth to receive updates, shows progress toward a personalized daily goal, and can optionally sync with a FastAPI backend for history and predictions.

Components
- ESP32 Firmware (Arduino C++)
- Frontend Web App (Vite + React + TypeScript + Recharts + Web Bluetooth)
- Backend (FastAPI + SQLite via SQLAlchemy)

Daily Goal Formula
- daily_goal_ml = weight_kg × 35

Project Structure
- firmware/esp32/ (Arduino sketch)
- frontend/ (Vite React app)
- backend/ (FastAPI server)

Prerequisites
- ESP32 board set up in Arduino IDE (or PlatformIO)
- Node.js 18+
- Python 3.10+
- Chrome/Edge browser (Web Bluetooth enabled)

Quick Start
1) Firmware (ESP32)
   - Open firmware/esp32/HydrationHero/HydrationHero.ino in Arduino IDE
   - Select ESP32 board (e.g., ESP32 Dev Module)
   - Set SIMULATION_MODE true to simulate without hardware
   - Upload and open Serial Monitor (115200)

2) Backend (optional)
   - cd backend
   - python -m venv .venv && source .venv/bin/activate (Windows: .venv\\Scripts\\activate)
   - pip install -r requirements.txt
   - uvicorn app.main:app --reload --port 8000

3) Frontend (Web)
   - cd frontend
   - npm install
   - npm run dev
   - Open the URL printed by Vite (e.g., http://localhost:5173)

Using the App
- Enter your weight to compute your daily goal
- Click "Connect Bottle" to pair with the ESP32 BLE device
- Real-time intake will stream via notifications and update charts and predictions
- If backend is running, you can enable sync to store history

BLE Details
- Service UUID: HydrationService (128-bit UUID format used in code)
- Characteristic UUID: CurrentIntake (Notify)
- Data Format: Little-endian uint32 representing cumulative milliliters

Notes
- Web Bluetooth requires HTTPS or localhost
- If you cannot use hardware, set simulation mode in firmware or use the frontend mock toggle

License
MIT


