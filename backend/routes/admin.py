from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.professional import Professional

router = APIRouter(prefix="/api/admin", tags=["Admin Overrides"])

@router.put("/verify/{prof_id}")
def verify_professional(prof_id: int, db: Session = Depends(get_db)):
    pro = db.query(Professional).filter(Professional.id == prof_id).first()
    if not pro:
        raise HTTPException(status_code=404, detail="Professional profile not found")
    pro.is_verified = True
    db.commit()
    return {"message": "Professional verified successfully!"}