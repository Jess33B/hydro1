#!/usr/bin/env python3
"""
System Health Checker - Verifies all components are working together
"""
import requests
import json
import time
from datetime import datetime

def check_backend():
    """Check if backend API is running"""
    try:
        response = requests.get("http://localhost:8000/api/user/profile", timeout=3)
        if response.status_code == 200:
            print("✅ Backend API: Running")
            return True
        else:
            print(f"❌ Backend API: Error {response.status_code}")
            return False
    except:
        print("❌ Backend API: Not running")
        return False

def check_frontend():
    """Check if frontend is running"""
    try:
        response = requests.get("http://localhost:5173", timeout=3)
        if response.status_code == 200:
            print("✅ Frontend App: Running")
            return True
        else:
            print(f"❌ Frontend App: Error {response.status_code}")
            return False
    except:
        print("❌ Frontend App: Not running")
        return False

def check_firebase():
    """Check Firebase connection and data"""
    try:
        device_id = "-0cPc2eDvRwhkvZ4U1Au"
        url = f"https://hydro-b2c6c-default-rtdb.firebaseio.com/{device_id}.json"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if data and 'totalWaterDrank' in data:
                print(f"✅ Firebase: Connected ({data['totalWaterDrank']}ml)")
                return True
            else:
                print("⚠️  Firebase: Connected but no data")
                return False
        else:
            print(f"❌ Firebase: Error {response.status_code}")
            return False
    except:
        print("❌ Firebase: Connection failed")
        return False

def check_firebase_endpoints():
    """Check if backend Firebase endpoints work"""
    try:
        device_id = "-0cPc2eDvRwhkvZ4U1Au"
        url = f"http://localhost:8000/api/firebase/device/{device_id}"
        response = requests.get(url, timeout=3)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('connected'):
                print(f"✅ Firebase Integration: Working ({data.get('totalWaterDrank', 0)}ml)")
                return True
            else:
                print("⚠️  Firebase Integration: No data available")
                return False
        else:
            print(f"❌ Firebase Integration: Error {response.status_code}")
            return False
    except:
        print("❌ Firebase Integration: Failed")
        return False

def main():
    print("🔍 HYDRATION HERO - SYSTEM HEALTH CHECK")
    print("=" * 50)
    print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Check all components
    backend_ok = check_backend()
    frontend_ok = check_frontend()
    firebase_ok = check_firebase()
    integration_ok = check_firebase_endpoints()
    
    print()
    print("=" * 50)
    
    if all([backend_ok, frontend_ok, firebase_ok, integration_ok]):
        print("🎉 ALL SYSTEMS OPERATIONAL!")
        print()
        print("🚀 Your complete hydration system is ready:")
        print("1. Open http://localhost:5173")
        print("2. Go to Dashboard")
        print("3. Click 'Enable Firebase Mode' 🔥")
        print("4. Watch real-time updates!")
    else:
        print("⚠️  SYSTEM ISSUES DETECTED")
        print()
        print("🔧 To fix issues:")
        if not backend_ok:
            print("- Start backend: cd backend && python -m uvicorn app.main:app --reload")
        if not frontend_ok:
            print("- Start frontend: cd frontend && npm run dev")
        if not firebase_ok:
            print("- Check internet connection and Firebase URL")
        if not integration_ok:
            print("- Restart backend server to load Firebase endpoints")
        
        print()
        print("Or run: start_complete_system.bat")
    
    print("=" * 50)

if __name__ == "__main__":
    main()
