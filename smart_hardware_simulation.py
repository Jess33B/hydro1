#!/usr/bin/env python3
"""
Smart Hardware Simulation - Sends continuous data until daily hydration goal is reached
"""
import requests
import json
import time
import random
from datetime import datetime

class SmartHydrationSimulator:
    def __init__(self):
        self.firebase_url = "https://hydro-b2c6c-default-rtdb.firebaseio.com"
        self.device_id = "-0cPc2eDvRwhkvZ4U1Au"
        self.backend_url = "http://localhost:8000/api"
        
        # Starting values
        self.current_weight = 500  # Starting bottle weight in grams
        self.total_water_drank = 0  # Starting water intake
        self.daily_goal = 0
        self.user_weight = 70  # Default weight
        
    def get_user_profile(self):
        """Get user profile from backend to calculate daily goal"""
        try:
            response = requests.get(f"{self.backend_url}/user/profile", timeout=5)
            if response.status_code == 200:
                profile = response.json()
                self.user_weight = profile.get('weight_kg', 70)
                self.daily_goal = int(self.user_weight * 35)  # 35ml per kg body weight
                print(f"📊 User Profile: {self.user_weight}kg")
                print(f"🎯 Daily Goal: {self.daily_goal}ml")
                return True
        except Exception as e:
            print(f"⚠️  Could not get user profile: {e}")
            # Use default values
            self.daily_goal = int(self.user_weight * 35)
            print(f"🎯 Using default goal: {self.daily_goal}ml (based on {self.user_weight}kg)")
        return False
    
    def send_data_to_firebase(self):
        """Send current sensor data to Firebase"""
        data = {
            "currentWeight": self.current_weight,
            "totalWaterDrank": self.total_water_drank,
            "timestamp": datetime.now().isoformat(),
            "goalReached": self.total_water_drank >= self.daily_goal
        }
        
        try:
            url = f"{self.firebase_url}/{self.device_id}.json"
            response = requests.put(url, json=data, timeout=10)
            
            if response.status_code == 200:
                progress = min(100, (self.total_water_drank / self.daily_goal) * 100)
                print(f"📤 Data sent: {self.total_water_drank}ml/{self.daily_goal}ml ({progress:.1f}%) | Weight: {self.current_weight}g")
                return True
            else:
                print(f"❌ Failed to send data: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Error sending data: {e}")
            return False
    
    def simulate_drinking(self):
        """Simulate someone drinking water"""
        if self.total_water_drank >= self.daily_goal:
            return False  # Goal reached, stop simulation
        
        # Simulate drinking: 15-50ml per sip
        sip_amount = random.randint(15, 50)
        
        # Don't exceed the daily goal
        remaining = self.daily_goal - self.total_water_drank
        if sip_amount > remaining:
            sip_amount = remaining
        
        # Update values
        self.total_water_drank += sip_amount
        self.current_weight -= sip_amount  # Bottle gets lighter
        
        # Ensure weight doesn't go negative
        if self.current_weight < 0:
            self.current_weight = 0
            
        return True
    
    def run_simulation(self, interval_seconds=15):
        """Run the continuous simulation"""
        print("🚀 Starting Smart Hydration Hardware Simulation")
        print("=" * 60)
        
        # Get user profile and daily goal
        self.get_user_profile()
        
        print(f"⏱️  Sending data every {interval_seconds} seconds")
        print(f"🥤 Simulating sips of 15-50ml each")
        print(f"🎯 Target: {self.daily_goal}ml")
        print("=" * 60)
        
        try:
            while True:
                # Send current data to Firebase
                if not self.send_data_to_firebase():
                    print("⚠️  Failed to send data, retrying in 5 seconds...")
                    time.sleep(5)
                    continue
                
                # Check if goal is reached
                if self.total_water_drank >= self.daily_goal:
                    print("\n🎉 DAILY HYDRATION GOAL REACHED! 🎉")
                    print(f"✅ Total consumed: {self.total_water_drank}ml")
                    print(f"✅ Goal: {self.daily_goal}ml")
                    print("🏁 Simulation complete!")
                    
                    # Send final data
                    self.send_data_to_firebase()
                    break
                
                # Wait before next update
                print(f"⏳ Waiting {interval_seconds}s before next sip...")
                time.sleep(interval_seconds)
                
                # Simulate drinking
                if not self.simulate_drinking():
                    break
                    
        except KeyboardInterrupt:
            print("\n⏹️  Simulation stopped by user")
            print(f"📊 Final stats: {self.total_water_drank}ml/{self.daily_goal}ml")
        except Exception as e:
            print(f"❌ Simulation error: {e}")

def main():
    print("🔥 Smart Hydration Hardware Simulator")
    print("This will simulate continuous water intake until daily goal is reached")
    print()
    
    # Ask user for simulation speed
    try:
        interval = input("⏱️  Enter interval between sips in seconds (default 15): ").strip()
        interval = int(interval) if interval else 15
    except ValueError:
        interval = 15
    
    print(f"\n🚀 Starting simulation with {interval}s intervals...")
    print("Press Ctrl+C to stop\n")
    
    simulator = SmartHydrationSimulator()
    simulator.run_simulation(interval_seconds=interval)

if __name__ == "__main__":
    main()
