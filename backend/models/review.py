from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True, nullable=False)
    rating = Column(Integer, nullable=False)  
    comment = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())