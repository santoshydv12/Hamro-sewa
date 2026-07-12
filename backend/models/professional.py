from sqlalchemy import Column, Integer, String, Decimal, Boolean, ForeignKey
from database import Base

class Professional(Base):
    __tablename__ = "professionals"

    # Links directly to your user table id
    id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    certificates = Column(String(500), nullable=True)  
    base_pricing_rate = Column(Decimal(10, 2), nullable=False)
    service_category = Column(String(100), nullable=False)  # 'Home', 'Vehicle', 'Health'
    is_verified = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)