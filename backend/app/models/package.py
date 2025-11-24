"""
Package model for photography and videography services.
"""
from sqlalchemy import Column, String, Text, DECIMAL, Integer, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base
from app.core.db_types import GUID, JSON


class PackageCategory(str, enum.Enum):
    """Package category enumeration."""
    PHOTOGRAPHY = "photography"
    VIDEOGRAPHY = "videography"
    COMBO = "combo"
    EDITING = "editing"


class Package(Base):
    """Photography and videography service packages."""

    __tablename__ = "packages"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(SQLEnum(PackageCategory), nullable=False, index=True)
    price = Column(DECIMAL(10, 2), nullable=False)
    duration = Column(Integer, nullable=True)  # Duration in hours
    features = Column(JSON, nullable=False)  # List of features
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    bookings = relationship("Booking", back_populates="package")

    def __repr__(self):
        return f"<Package(id={self.id}, title={self.title}, category={self.category})>"
