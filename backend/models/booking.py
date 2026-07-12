from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    professional_id = Column(Integer, ForeignKey("professionals.id"), nullable=False)
    booking_status = Column(
        Enum('Pending', 'Accepted', 'Completed', 'Cancelled'), 
        default='Pending'
    )
    appointment_time = Column(DateTime, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())