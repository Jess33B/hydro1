#!/usr/bin/env python3
"""
Test script to check Firebase data and send sample data
"""
import requests
import json

def test_firebase_structure():
    """Test the current Firebase data structure"""
    print("=== Testing Firebase Data Structure ===")
    
    # Test your device ID
    device_id = "-0cPc2eDvRwhkvZ4U1Au"
    firebase_url = f"https://hydro-b2c6c-default-rtdb.firebaseio.com/{device_id}.json"
    
    print(f"Testing device ID: {device_id}")
    print(f"Firebase URL: {firebase_url}")
    
    try:
        response = requests.get(firebase_url)
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Current data: {json.dumps(data, indent=2)}")
        
        if data is None:
            print("\n❌ No data found for this device ID")
            print("💡 You need to send data to Firebase first")
            
            # Send sample data
            sample_data = {
                "currentWeight": 462,
                "totalWaterDrank": 38
            }
            
            print(f"\n📤 Sending sample data: {sample_data}")
            put_response = requests.put(firebase_url, json=sample_data)
            print(f"PUT Status: {put_response.status_code}")
            
            if put_response.status_code == 200:
                print("✅ Sample data sent successfully!")
                
                # Verify the data was sent
                verify_response = requests.get(firebase_url)
                verify_data = verify_response.json()
                print(f"✅ Verified data: {json.dumps(verify_data, indent=2)}")
            else:
                print(f"❌ Failed to send data: {put_response.text}")
        else:
            print("✅ Data found!")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_backend_endpoints():
    """Test the backend Firebase endpoints"""
    print("\n=== Testing Backend Endpoints ===")
    
    device_id = "-0cPc2eDvRwhkvZ4U1Au"
    base_url = "http://localhost:8000/api"
    
    endpoints = [
        f"/firebase/device/{device_id}",
        f"/firebase/intake/{device_id}",
    ]
    
    for endpoint in endpoints:
        try:
            url = base_url + endpoint
            print(f"\n🔍 Testing: {url}")
            response = requests.get(url, timeout=5)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Response: {json.dumps(data, indent=2)}")
            else:
                print(f"❌ Error: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Backend server not running. Start it with:")
            print("   cd backend && python -m uvicorn app.main:app --reload")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_firebase_structure()
    test_backend_endpoints()
