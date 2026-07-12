from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.professional import Professional
from models.user import User

router = APIRouter(prefix="/api/professionals", tags=["Professionals"])

@router.get("/")
def list_professionals(category: str = None, db: Session = Depends(get_db)):
    query = db.query(User.name, User.city, Professional).join(Professional, User.id == Professional.id)
    if category:
        query = query.filter(Professional.service_category == category)
    
    results = query.filter(Professional.is_verified == True).all()
    return [
        {
            "id": pro.id,
            "name": name,
            "city": city,
            "category": pro.service_category,
            "price": pro.base_pricing_rate,
            "is_available": pro.is_available
        }
        for name, city, pro in results
    ]

@router.put("/{prof_id}/toggle-availability")
def toggle_availability(prof_id: int, db: Session = Depends(get_db)):
    pro = db.query(Professional).filter(Professional.id == prof_id).first()
    if not pro:
        raise HTTPException(status_code=404, detail="Professional not found")
    pro.is_available = not pro.is_available
    db.commit()
    return {"message": "Availability status updated", "is_available": pro.is_available}