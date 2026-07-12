from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from pydantic import BaseModel, EmailStr

from database import get_db
from config import settings
from models.user import User
from models.professional import Professional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/api/auth", tags=["Auth"])

class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    city: str
    role: str  # 'user', 'professional', or 'admin'
    service_category: str = None
    base_pricing_rate: float = 0.0

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    user_exists = db.query(User).filter(User.email == data.email).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(data.password)
    new_user = User(
        name=data.name,
        email=data.email,
        hashed_password=hashed_password,
        city=data.city,
        role=data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    if data.role == "professional":
        new_prof = Professional(
            id=new_user.id,
            service_category=data.service_category or "General",
            base_pricing_rate=data.base_pricing_rate,
            is_verified=False,
            is_available=True
        )
        db.add(new_prof)
        db.commit()
        
    return {"message": "Registration successful", "user_id": new_user.id}

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    expiry = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user.id), "role": user.role, "exp": expiry}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "role": user.role, "city": user.city}
    }