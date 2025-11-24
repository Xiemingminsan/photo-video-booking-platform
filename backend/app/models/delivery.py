"""
Delivery model for final deliverables.
"""
from sqlalchemy import Column, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base
from app.core.db_types import GUID, JSON


class Delivery(Base):
    """Final deliverables for completed bookings."""

    __tablename__ = "deliveries"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    booking_id = Column(GUID, ForeignKey("bookings.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    photo_urls = Column(JSON, nullable=True)  # Array of photo URLs
    video_urls = Column(JSON, nullable=True)  # Array of video URLs
    download_links = Column(JSON, nullable=True)  # Array of download link objects
    notes = Column(Text, nullable=True)
    delivered_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    booking = relationship("Booking", back_populates="delivery")

    def __repr__(self):
        return f"<Delivery(id={self.id}, booking_id={self.booking_id})>"
