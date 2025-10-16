from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from .database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True, index=True)
    weight_kg = Column(Integer, nullable=False)
    age = Column(Integer, nullable=True)
    activity_level = Column(String(32), nullable=True)


class IntakeLog(Base):
    __tablename__ = "intake_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    intake_ml = Column(Integer, nullable=False)


class DeviceStatus(Base):
    __tablename__ = "device_status"
    id = Column(Integer, primary_key=True, index=True)
    connected = Column(Boolean, default=False)
    last_synced = Column(DateTime(timezone=True), server_default=func.now())


