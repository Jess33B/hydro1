from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserProfile(BaseModel):
    id: int
    weight_kg: int
    age: Optional[int] = None
    activity_level: Optional[str] = None

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    weight_kg: int
    age: Optional[int] = None
    activity_level: Optional[str] = None


class IntakeEntry(BaseModel):
    id: int
    timestamp: datetime
    intake_ml: int

    class Config:
        from_attributes = True


class DailyIntake(BaseModel):
    date: str
    total_ml: int


class Prediction(BaseModel):
    goal_ml: int
    intake_ml: int
    delta_ml: int
    status: str


class DeviceStatus(BaseModel):
    connected: bool
    last_synced: datetime | None = None


class FirebaseDeviceData(BaseModel):
    connected: bool
    currentWeight: Optional[int] = None
    totalWaterDrank: Optional[int] = None
    lastUpdated: Optional[str] = None
    error: Optional[str] = None


class HydrationData(BaseModel):
    currentWeight: int
    totalWaterDrank: int
    connected: bool
    lastUpdated: str


