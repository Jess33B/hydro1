#!/usr/bin/env python3
"""
Continuous Hardware Simulation - Keeps sending data until daily goal is reached
"""
import requests
import json
import time
import random
from datetime import datetime

# Configuration
FIREBASE_URL = "https://hydro-b2c6c-default-rtdb.firebaseio.com"
DEVICE_ID = "-0cPc2eDvRwhkvZ4U1Au"
BACKEND_URL = "http://localhost:8000/api"

# Starting values
current_weight = 500  # grams
total_water_drank = 38  # Start from your current value
daily_goal = 2450  # Default goal (70kg * 35ml)

def get_daily_goal():
    """Get daily goal from backend based on user weight"""
    global daily_goal
    try:
        response = requests.get(f"{BACKEND_URL}/user/profile", timeout=5)
        if response.status_code == 200:
            profile = response.json()
            weight_kg = profile.get('weight_kg', 70)
            daily_goal = int(weight_kg * 35)
            print(f"📊 User weight: {weight_kg}kg")
            print(f"🎯 Daily goal: {daily_goal}ml")
        else:
            print(f"⚠️  Using default goal: {daily_goal}ml")
    except Exception as e:
        print(f"⚠️  Could not get profile, using default goal: {daily_goal}ml")

def send_to_firebase():
    """Send current data to Firebase"""
    global current_weight, total_water_drank
    
    data = {
        "currentWeight": current_weight,
        "totalWaterDrank": total_water_drank,
        "timestamp": datetime.now().isoformat()
    }
    
    try:
        url = f"{FIREBASE_URL}/{DEVICE_ID}.json"
        response = requests.put(url, json=data, timeout=10)
        
        if response.status_code == 200:
            progress = min(100, (total_water_drank / daily_goal) * 100)
            print(f"📤 Sent: {total_water_drank}ml/{daily_goal}ml ({progress:.1f}%) | Weight: {current_weight}g")
            return True
        else:
            print(f"❌ Failed to send: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def simulate_drinking():
    """Simulate drinking water"""
    global current_weight, total_water_drank
    
    if total_water_drank >= daily_goal:
        return False  # Goal reached
    
    # Random sip: 20-60ml
    sip = random.randint(20, 60)
    
    # Don't exceed goal
    remaining = daily_goal - total_water_drank
    if sip > remaining:
        sip = remaining
    
    # Update values
    total_water_drank += sip
    current_weight -= sip  # Bottle gets lighter
    
    if current_weight < 0:
        current_weight = 0
    
    return True

def main():
    print("🚀 CONTINUOUS HYDRATION SIMULATION")
    print("=" * 50)
    
    # Get daily goal
    get_daily_goal()
    
    print(f"🥤 Starting from: {total_water_drank}ml")
    print(f"🎯 Target: {daily_goal}ml")
    print(f"📦 Bottle weight: {current_weight}g")
    print("=" * 50)
    print("⏳ Sending data every 10 seconds...")
    print("Press Ctrl+C to stop")
    print()
    
    try:
        while total_water_drank < daily_goal:
            # Send current data
            if send_to_firebase():
                # Wait 10 seconds
                time.sleep(10)
                
                # Simulate drinking
                if not simulate_drinking():
                    break
            else:
                # If sending failed, wait 5 seconds and retry
                time.sleep(5)
        
        # Send final data
        print("\n🎉 GOAL REACHED! Sending final data...")
        send_to_firebase()
        print(f"✅ Final: {total_water_drank}ml/{daily_goal}ml (100%)")
        
    except KeyboardInterrupt:
        print(f"\n⏹️  Stopped at: {total_water_drank}ml/{daily_goal}ml")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()
