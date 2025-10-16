from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import Base, engine, get_db
from . import models, schemas, crud
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


