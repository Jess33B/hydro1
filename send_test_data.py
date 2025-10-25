import requests
import json

# Your Firebase database URL and device ID
firebase_url = "https://hydro-b2c6c-default-rtdb.firebaseio.com"
device_id = "-0cPc2eDvRwhkvZ4U1Au"

# Test data matching your hardware simulation
test_data = {
    "currentWeight": 462,
    "totalWaterDrank": 38
}

print("Sending test data to Firebase...")
print(f"Device ID: {device_id}")
print(f"Data: {json.dumps(test_data, indent=2)}")

try:
    # Send data to Firebase
    url = f"{firebase_url}/{device_id}.json"
    response = requests.put(url, json=test_data, timeout=10)
    
    print(f"\nPUT Request Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("✅ Data sent successfully!")
        
        # Verify the data
        print("\nVerifying data...")
        get_response = requests.get(url, timeout=10)
        print(f"GET Status: {get_response.status_code}")
        
        if get_response.status_code == 200:
            data = get_response.json()
            print(f"✅ Verified data: {json.dumps(data, indent=2)}")
        else:
            print(f"❌ Verification failed: {get_response.text}")
    else:
        print(f"❌ Failed to send data: {response.text}")
        
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n💡 Possible issues:")
    print("1. Check your internet connection")
    print("2. Verify Firebase database URL")
    print("3. Check Firebase database rules (should allow read/write)")
    
print("\n" + "="*50)
print("After sending data, test your backend endpoint:")
print(f"http://localhost:8000/api/firebase/device/{device_id}")
