import requests
import json
from typing import Dict, Any, Optional
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

class FirebaseService:
    def __init__(self, database_url: str):
        """
        Initialize Firebase service with database URL
        Args:
            database_url: Firebase Realtime Database URL (e.g., https://hydro-b2c6c-default-rtdb.firebaseio.com/)
        """
        self.database_url = database_url.rstrip('/')
        
    def get_device_data(self, device_id: str) -> Optional[Dict[str, Any]]:
        """
        Get current device data from Firebase
        Args:
            device_id: Device identifier (e.g., -OcQBJZE__Q1uTdi4USo)
        Returns:
            Dictionary with device data or None if not found
        """
        try:
            # Look under the sensorData node
            url = f"{self.database_url}/{device_id}.json"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            if data is None:
                logger.warning(f"No data found for device {device_id} under sensorData node")
                return None
                
            return data
        except requests.RequestException as e:
            logger.error(f"Error fetching data from Firebase: {e}")
            return None
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing Firebase response: {e}")
            return None
    
    def get_current_weight(self, device_id: str) -> Optional[int]:
        """
        Get current weight from Firebase device data
        Args:
            device_id: Device identifier
        Returns:
            Current weight in grams or None if not available
        """
        data = self.get_device_data(device_id)
        if data and 'currentWeight' in data:
            try:
                return int(data['currentWeight'])
            except (ValueError, TypeError):
                logger.error(f"Invalid currentWeight value: {data['currentWeight']}")
        return None
    
    def get_total_water_drank(self, device_id: str) -> Optional[int]:
        """
        Get total water consumed from Firebase device data
        Args:
            device_id: Device identifier
        Returns:
            Total water consumed in ml or None if not available
        """
        data = self.get_device_data(device_id)
        if data and 'totalWaterDrank' in data:
            try:
                return int(data['totalWaterDrank'])
            except (ValueError, TypeError):
                logger.error(f"Invalid totalWaterDrank value: {data['totalWaterDrank']}")
        return None
    
    def get_hydration_status(self, device_id: str) -> Dict[str, Any]:
        """
        Get comprehensive hydration status from Firebase
        Args:
            device_id: Device identifier
        Returns:
            Dictionary with hydration status including weight, intake, and metadata
        """
        data = self.get_device_data(device_id)
        
        if data is None:
            return {
                'connected': False,
                'currentWeight': None,
                'totalWaterDrank': None,
                'lastUpdated': None,
                'error': 'No data available'
            }
        
        return {
            'connected': True,
            'currentWeight': data.get('currentWeight'),
            'totalWaterDrank': data.get('totalWaterDrank'),
            'lastUpdated': datetime.now(timezone.utc).isoformat(),
            'rawData': data
        }
    
    def is_device_connected(self, device_id: str) -> bool:
        """
        Check if device is connected and sending data
        Args:
            device_id: Device identifier
        Returns:
            True if device is connected and has recent data
        """
        data = self.get_device_data(device_id)
        return data is not None and ('currentWeight' in data or 'totalWaterDrank' in data)

# Global Firebase service instance
firebase_service = FirebaseService("https://hydro-b2c6c-default-rtdb.firebaseio.com")
