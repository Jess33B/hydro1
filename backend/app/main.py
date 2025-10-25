from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import Base, engine, get_db
from . import models, schemas, crud
from .firebase_service import firebase_service
from datetime import datetime

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hydration Hero API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/user/profile", response_model=schemas.UserProfile)
def get_profile(db: Session = Depends(get_db)):
    profile = crud.get_profile(db)
    if profile is None:
        profile = crud.upsert_profile(db, weight_kg=70, age=None, activity_level="moderate")
    return schemas.UserProfile.from_orm(profile)


@app.put("/api/user/profile", response_model=schemas.UserProfile)
def update_profile(payload: schemas.UserProfileUpdate, db: Session = Depends(get_db)):
    profile = crud.upsert_profile(db, weight_kg=payload.weight_kg, age=payload.age, activity_level=payload.activity_level)
    return schemas.UserProfile.from_orm(profile)


@app.get("/api/hydration/daily", response_model=schemas.DailyIntake)
def get_daily(db: Session = Depends(get_db)):
    total = crud.get_today_total_ml(db)
    return schemas.DailyIntake(date=datetime.utcnow().date().isoformat(), total_ml=total)


@app.get("/api/hydration/history", response_model=list[schemas.IntakeEntry])
def history(db: Session = Depends(get_db)):
    return [schemas.IntakeEntry.from_orm(x) for x in crud.get_history(db)]


@app.get("/api/prediction", response_model=schemas.Prediction)
def prediction(db: Session = Depends(get_db)):
    profile = crud.get_profile(db)
    if profile is None:
        profile = crud.upsert_profile(db, weight_kg=70, age=None, activity_level="moderate")
    goal = int(round(profile.weight_kg * 35))
    total = crud.get_today_total_ml(db)
    delta = total - goal
    status = "ahead" if delta >= 0 else "behind"
    return schemas.Prediction(goal_ml=goal, intake_ml=total, delta_ml=delta, status=status)


@app.get("/api/device/status", response_model=schemas.DeviceStatus)
def device_status(db: Session = Depends(get_db)):
    status = crud.get_device_status(db)
    return schemas.DeviceStatus(connected=status.connected, last_synced=status.last_synced)


# Firebase endpoints for real hardware data
@app.get("/api/firebase/device/{device_id}", response_model=schemas.FirebaseDeviceData)
def get_firebase_device_data(device_id: str):
    """Get current device data from Firebase Realtime Database"""
    try:
        status = firebase_service.get_hydration_status(device_id)
        return schemas.FirebaseDeviceData(**status)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Firebase data: {str(e)}")


@app.get("/api/firebase/hydration/{device_id}", response_model=schemas.HydrationData)
def get_firebase_hydration_data(device_id: str):
    """Get hydration data from Firebase for the dashboard"""
    try:
        current_weight = firebase_service.get_current_weight(device_id)
        total_water = firebase_service.get_total_water_drank(device_id)
        is_connected = firebase_service.is_device_connected(device_id)
        
        if current_weight is None or total_water is None:
            raise HTTPException(status_code=404, detail="Device data not found or incomplete")
        
        return schemas.HydrationData(
            currentWeight=current_weight,
            totalWaterDrank=total_water,
            connected=is_connected,
            lastUpdated=datetime.utcnow().isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching hydration data: {str(e)}")


@app.get("/api/firebase/intake/{device_id}")
def get_firebase_intake_ml(device_id: str):
    """Get current water intake in ml from Firebase"""
    try:
        total_water = firebase_service.get_total_water_drank(device_id)
        if total_water is None:
            raise HTTPException(status_code=404, detail="Water intake data not found")
        
        return {"intake_ml": total_water, "timestamp": datetime.utcnow().isoformat()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching intake data: {str(e)}")


@app.get("/api/firebase/prediction/{device_id}", response_model=schemas.Prediction)
def get_firebase_prediction(device_id: str, db: Session = Depends(get_db)):
    """Get hydration prediction based on Firebase data and user profile"""
    try:
        # Get user profile for goal calculation
        profile = crud.get_profile(db)
        if profile is None:
            profile = crud.upsert_profile(db, weight_kg=70, age=None, activity_level="moderate")
        
        # Get current intake from Firebase
        total_water = firebase_service.get_total_water_drank(device_id)
        if total_water is None:
            raise HTTPException(status_code=404, detail="Water intake data not found")
        
        # Calculate goal and prediction
        goal = int(round(profile.weight_kg * 35))
        delta = total_water - goal
        status = "ahead" if delta >= 0 else "behind"
        
        return schemas.Prediction(goal_ml=goal, intake_ml=total_water, delta_ml=delta, status=status)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating prediction: {str(e)}")


