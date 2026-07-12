from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.booking import Booking

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/{user_id}/dashboard")
def get_user_dashboard(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    history = db.query(Booking).filter(Booking.user_id == user_id).all()
    return {
        "profile": {"name": user.name, "email": user.email, "city": user.city},
        "bookings": history
    }