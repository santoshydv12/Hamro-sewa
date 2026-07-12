from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models.booking import Booking

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("/")
def create_booking(user_id: int, professional_id: int, appt_time: str, db: Session = Depends(get_db)):
    new_booking = Booking(
        user_id=user_id,
        professional_id=professional_id,
        appointment_time=datetime.strptime(appt_time, "%Y-%m-%dT%H:%M"),
        booking_status="Pending"
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return {"status": "Booking created successfully", "booking": new_booking}

@router.put("/{booking_id}/status")
def update_status(booking_id: int, status_string: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if status_string in ["Accepted", "Completed", "Cancelled"]:
        booking.booking_status = status_string
        db.commit()
        return {"message": f"Status updated to {status_string}"}
    raise HTTPException(status_code=400, detail="Invalid status option")