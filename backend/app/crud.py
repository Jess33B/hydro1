from sqlalchemy.orm import Session
from sqlalchemy import select, desc, func
from datetime import datetime, timezone, date
from . import models


def get_profile(db: Session) -> models.UserProfile | None:
    result = db.execute(select(models.UserProfile).limit(1)).scalars().first()
    return result


def upsert_profile(db: Session, weight_kg: int, age: int | None, activity_level: str | None) -> models.UserProfile:
    profile = get_profile(db)
    if profile is None:
        profile = models.UserProfile(weight_kg=weight_kg, age=age, activity_level=activity_level)
        db.add(profile)
    else:
        profile.weight_kg = weight_kg
        profile.age = age
        profile.activity_level = activity_level
    db.commit()
    db.refresh(profile)
    return profile


def add_intake(db: Session, intake_ml: int) -> models.IntakeLog:
    entry = models.IntakeLog(intake_ml=intake_ml)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def get_today_total_ml(db: Session) -> int:
    # Total is max cumulative intake observed today if using cumulative values,
    # or sum of deltas if logging per sip. Here we mock with sum of per-entry values.
    today = date.today()
    start = datetime(today.year, today.month, today.day, tzinfo=timezone.utc)
    total = db.execute(
        select(func.coalesce(func.sum(models.IntakeLog.intake_ml), 0)).where(models.IntakeLog.timestamp >= start)
    ).scalar_one()
    return int(total or 0)


def get_history(db: Session) -> list[models.IntakeLog]:
    rows = db.execute(select(models.IntakeLog).order_by(desc(models.IntakeLog.timestamp)).limit(500)).scalars().all()
    return list(reversed(rows))


def get_device_status(db: Session) -> models.DeviceStatus:
    status = db.execute(select(models.DeviceStatus).limit(1)).scalars().first()
    if status is None:
        status = models.DeviceStatus(connected=False)
        db.add(status)
        db.commit()
        db.refresh(status)
    return status


