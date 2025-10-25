#!/usr/bin/env python3

import requests
import json

def test_firebase_endpoints():
    base_url = "http://localhost:8000/api"
    device_id = "-0cPc2eDvRwhkvZ4U1Au"
    
    endpoints = [
        f"/firebase/device/{device_id}",
        f"/firebase/hydration/{device_id}",
        f"/firebase/intake/{device_id}",
        f"/firebase/prediction/{device_id}"
    ]
    
    print("Testing Firebase endpoints...")
    print("=" * 50)
    
    for endpoint in endpoints:
        try:
            url = base_url + endpoint
            print(f"\nTesting: {url}")
            response = requests.get(url, timeout=10)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)}")
            else:
                print(f"Error: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")
    
    print("\n" + "=" * 50)
    print("Testing direct Firebase access...")
    
    # Test direct Firebase access
    try:
        firebase_url = "https://hydro-b2c6c-default-rtdb.firebaseio.com/-0cPc2eDvRwhkvZ4U1Au.json"
        print(f"\nDirect Firebase URL: {firebase_url}")
        response = requests.get(firebase_url, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Firebase Data: {json.dumps(data, indent=2)}")
        else:
            print(f"Firebase Error: {response.text}")
            
    except Exception as e:
        print(f"Firebase access error: {e}")

if __name__ == "__main__":
    test_firebase_endpoints()
