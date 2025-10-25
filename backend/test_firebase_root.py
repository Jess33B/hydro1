#!/usr/bin/env python3

import requests
import json

def test_firebase_root():
    print("Testing Firebase root structure...")
    print("=" * 50)
    
    # Test root access
    try:
        firebase_url = "https://hydro-b2c6c-default-rtdb.firebaseio.com/.json"
        print(f"Firebase Root URL: {firebase_url}")
        response = requests.get(firebase_url, timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Root Data: {json.dumps(data, indent=2)}")
            
            # If data exists, let's explore the structure
            if data:
                print("\nExploring data structure:")
                for key, value in data.items():
                    print(f"Key: {key}")
                    if isinstance(value, dict):
                        print(f"  Type: dict with keys: {list(value.keys())}")
                        for subkey, subvalue in value.items():
                            print(f"    {subkey}: {subvalue}")
                    else:
                        print(f"  Value: {value}")
        else:
            print(f"Firebase Error: {response.text}")
            
    except Exception as e:
        print(f"Firebase access error: {e}")

if __name__ == "__main__":
    test_firebase_root()
