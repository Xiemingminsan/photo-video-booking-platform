"""
AddOn model for optional extras.
"""
from sqlalchemy import Column, String, Text, DECIMAL, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base
from app.core.db_types import GUID


class AddOnCategory(str, enum.Enum):
    """AddOn category enumeration."""
    EQUIPMENT = "equipment"
    PERSONNEL = "personnel"
    EDITING = "editing"
    OTHER = "other"


class AddOn(Base):
    """Optional add-ons for bookings."""

    __tablename__ = "addons"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(DECIMAL(10, 2), nullable=False)
    category = Column(SQLEnum(AddOnCategory), nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    booking_addons = relationship("BookingAddOn", back_populates="addon", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<AddOn(id={self.id}, name={self.name}, price={self.price})>"
