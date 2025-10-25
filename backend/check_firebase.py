import requests
import json

# Check root Firebase data
response = requests.get('https://hydro-b2c6c-default-rtdb.firebaseio.com/.json')
print('Status:', response.status_code)
print('Root data:', json.dumps(response.json(), indent=2))
