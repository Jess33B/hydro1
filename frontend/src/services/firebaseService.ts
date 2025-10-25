// Firebase service for fetching data from backend Firebase endpoints
const API_BASE_URL = 'http://localhost:8000/api';

export interface FirebaseDeviceData {
  connected: boolean;
  currentWeight?: number;
  totalWaterDrank?: number;
  lastUpdated?: string;
  error?: string;
}

export interface HydrationData {
  currentWeight: number;
  totalWaterDrank: number;
  connected: boolean;
  lastUpdated: string;
}

export interface PredictionData {
  goal_ml: number;
  intake_ml: number;
  delta_ml: number;
  status: string;
}

export class FirebaseService {
  private deviceId: string;

  constructor(deviceId: string = '-0cPc2eDvRwhkvZ4U1Au') {
    this.deviceId = deviceId;
  }

  async getDeviceData(): Promise<FirebaseDeviceData> {
    try {
      const response = await fetch(`${API_BASE_URL}/firebase/device/${this.deviceId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching device data:', error);
      throw error;
    }
  }

  async getHydrationData(): Promise<HydrationData> {
    try {
      const response = await fetch(`${API_BASE_URL}/firebase/hydration/${this.deviceId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching hydration data:', error);
      throw error;
    }
  }

  async getIntakeData(): Promise<{ intake_ml: number; timestamp: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/firebase/intake/${this.deviceId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching intake data:', error);
      throw error;
    }
  }

  async getPredictionData(): Promise<PredictionData> {
    try {
      const response = await fetch(`${API_BASE_URL}/firebase/prediction/${this.deviceId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching prediction data:', error);
      throw error;
    }
  }

  setDeviceId(deviceId: string) {
    this.deviceId = deviceId;
  }

  getDeviceId(): string {
    return this.deviceId;
  }
}

// Export a default instance
export const firebaseService = new FirebaseService();
