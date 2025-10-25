import requests
import json

# Test Firebase endpoints
device_id = "-0cPc2eDvRwhkvZ4U1Au"
base_url = "http://localhost:8000/api"

print("Testing Firebase endpoints...")

# Test device endpoint
try:
    url = f"{base_url}/firebase/device/{device_id}"
    print(f"Testing: {url}")
    response = requests.get(url, timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "="*50)

# Test direct Firebase access
try:
    firebase_url = f"https://hydro-b2c6c-default-rtdb.firebaseio.com/{device_id}.json"
    print(f"Direct Firebase: {firebase_url}")
    response = requests.get(firebase_url, timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Data: {response.text}")
except Exception as e:
    print(f"Firebase Error: {e}")
