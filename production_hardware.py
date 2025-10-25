#!/usr/bin/env python3
"""
Production Hardware Simulation
Integrates with your complete hydration tracking system
"""
import requests
import json
import time
import random
import threading
from datetime import datetime, timedelta
import sys

class ProductionHardwareSimulator:
    def __init__(self):
        self.firebase_url = "https://hydro-b2c6c-default-rtdb.firebaseio.com"
        self.device_id = "-0cPc2eDvRwhkvZ4U1Au"
        self.backend_url = "http://localhost:8000/api"
        
        # Hardware state
        self.bottle_weight = 500  # grams
        self.total_consumed = 0   # ml
        self.daily_goal = 2450    # ml (default)
        self.user_weight = 70     # kg
        self.is_running = True
        self.last_update = datetime.now()
        
        # System status
        self.backend_connected = False
        self.firebase_connected = False
        
    def check_backend_connection(self):
        """Check if backend is running"""
        try:
            response = requests.get(f"{self.backend_url}/user/profile", timeout=3)
            if response.status_code == 200:
                profile = response.json()
                self.user_weight = profile.get('weight_kg', 70)
                self.daily_goal = int(self.user_weight * 35)
                self.backend_connected = True
                return True
        except:
            self.backend_connected = False
        return False
    
    def send_sensor_data(self):
        """Send current sensor readings to Firebase"""
        sensor_data = {
            "currentWeight": self.bottle_weight,
            "totalWaterDrank": self.total_consumed,
            "timestamp": datetime.now().isoformat(),
            "deviceStatus": "active",
            "batteryLevel": random.randint(75, 100),  # Simulate battery
            "temperature": round(random.uniform(20.0, 25.0), 1)  # Simulate temp sensor
        }
        
        try:
            url = f"{self.firebase_url}/{self.device_id}.json"
            response = requests.put(url, json=sensor_data, timeout=5)
            
            if response.status_code == 200:
                self.firebase_connected = True
                progress = min(100, (self.total_consumed / self.daily_goal) * 100)
                
                print(f"📊 {datetime.now().strftime('%H:%M:%S')} | "
                      f"💧 {self.total_consumed}ml/{self.daily_goal}ml ({progress:.1f}%) | "
                      f"⚖️ {self.bottle_weight}g")
                
                return True
            else:
                self.firebase_connected = False
                print(f"❌ Firebase error: {response.status_code}")
                return False
                
        except Exception as e:
            self.firebase_connected = False
            print(f"❌ Connection error: {e}")
            return False
    
    def simulate_drinking_event(self):
        """Simulate a drinking event"""
        if self.total_consumed >= self.daily_goal:
            return False
        
        # Realistic drinking patterns
        sip_size = random.choice([
            random.randint(15, 30),   # Small sip
            random.randint(30, 60),   # Normal sip  
            random.randint(60, 120),  # Large gulp
        ])
        
        # Don't exceed daily goal
        remaining = self.daily_goal - self.total_consumed
        if sip_size > remaining:
            sip_size = remaining
        
        # Update hardware state
        self.total_consumed += sip_size
        self.bottle_weight = max(0, self.bottle_weight - sip_size)
        self.last_update = datetime.now()
        
        return True
    
    def print_system_status(self):
        """Print current system status"""
        print("\n" + "="*60)
        print("🔥 HYDRATION HERO - PRODUCTION HARDWARE")
        print("="*60)
        print(f"👤 User: {self.user_weight}kg | 🎯 Goal: {self.daily_goal}ml")
        print(f"💧 Consumed: {self.total_consumed}ml | ⚖️ Bottle: {self.bottle_weight}g")
        print(f"🔧 Backend: {'✅ Connected' if self.backend_connected else '❌ Disconnected'}")
        print(f"🔥 Firebase: {'✅ Connected' if self.firebase_connected else '❌ Disconnected'}")
        print(f"⏰ Last Update: {self.last_update.strftime('%H:%M:%S')}")
        print("="*60)
        print("📱 Frontend: http://localhost:5173 (Enable Firebase Mode)")
        print("🔧 Backend: http://localhost:8000/docs")
        print("⏹️  Press Ctrl+C to stop")
        print("="*60)
    
    def run_hardware_loop(self):
        """Main hardware simulation loop"""
        print("🚀 Starting Production Hardware Simulator...")
        
        # Initial system check
        if not self.check_backend_connection():
            print("⚠️  Backend not detected, using default settings")
        
        self.print_system_status()
        
        try:
            while self.is_running and self.total_consumed < self.daily_goal:
                # Send sensor data to Firebase
                self.send_sensor_data()
                
                # Wait before next drinking event (10-30 seconds)
                wait_time = random.randint(10, 30)
                time.sleep(wait_time)
                
                # Simulate drinking
                if not self.simulate_drinking_event():
                    break
                
                # Periodically check backend connection
                if random.random() < 0.1:  # 10% chance
                    self.check_backend_connection()
            
            # Goal reached
            print(f"\n🎉 DAILY HYDRATION GOAL ACHIEVED!")
            print(f"✅ Total consumed: {self.total_consumed}ml")
            print(f"✅ Goal: {self.daily_goal}ml")
            
            # Send final data
            self.send_sensor_data()
            
        except KeyboardInterrupt:
            print(f"\n⏹️  Hardware simulation stopped")
            print(f"📊 Final stats: {self.total_consumed}ml/{self.daily_goal}ml")
            
        except Exception as e:
            print(f"\n❌ Hardware error: {e}")
        
        finally:
            self.is_running = False

def main():
    """Start the production hardware simulator"""
    simulator = ProductionHardwareSimulator()
    simulator.run_hardware_loop()

if __name__ == "__main__":
    main()
