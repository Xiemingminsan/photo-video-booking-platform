"""
Booking model for client reservations.
"""
from sqlalchemy import Column, String, Text, DECIMAL, Date, Time, DateTime, Enum as SQLEnum, ForeignKey, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base
from app.core.db_types import GUID


class BookingStatus(str, enum.Enum):
    """Booking status enumeration."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"


class Booking(Base):
    """Client booking requests."""

    __tablename__ = "bookings"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    package_id = Column(GUID, ForeignKey("packages.id", ondelete="RESTRICT"), nullable=False, index=True)
    event_type = Column(String(100), nullable=False)
    event_date = Column(Date, nullable=False, index=True)
    event_time = Column(Time, nullable=False)
    location = Column(Text, nullable=False)
    status = Column(SQLEnum(BookingStatus), nullable=False, default=BookingStatus.PENDING, index=True)
    total_price = Column(DECIMAL(10, 2), nullable=False)
    notes = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="bookings")
    package = relationship("Package", back_populates="bookings")
    booking_addons = relationship("BookingAddOn", back_populates="booking", cascade="all, delete-orphan")
    delivery = relationship("Delivery", back_populates="booking", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Booking(id={self.id}, event_type={self.event_type}, status={self.status})>"


class BookingAddOn(Base):
    """Junction table for bookings and add-ons."""

    __tablename__ = "booking_addons"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    booking_id = Column(GUID, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, index=True)
    addon_id = Column(GUID, ForeignKey("addons.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    booking = relationship("Booking", back_populates="booking_addons")
    addon = relationship("AddOn", back_populates="booking_addons")

    def __repr__(self):
        return f"<BookingAddOn(booking_id={self.booking_id}, addon_id={self.addon_id})>"
