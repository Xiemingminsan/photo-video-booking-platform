"""
Pydantic schemas for Booking model.
"""
from typing import List, Optional
from datetime import datetime, date, time
from uuid import UUID
from decimal import Decimal

from pydantic import BaseModel, Field, ConfigDict

from app.models.booking import BookingStatus
from app.schemas.addon import AddOnResponse
from app.schemas.package import PackageResponse
from app.schemas.user import UserResponse


class BookingAddOnItem(BaseModel):
    """Schema for add-on in booking."""
    addon_id: UUID
    quantity: int = Field(1, ge=1)


class BookingAddOnResponse(BaseModel):
    """Schema for booking add-on response."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    addon: AddOnResponse
    quantity: int


class BookingBase(BaseModel):
    """Base booking schema."""
    package_id: UUID
    event_type: str = Field(..., min_length=1, max_length=100)
    event_date: date
    event_time: time
    location: str = Field(..., min_length=1)
    notes: Optional[str] = None


class BookingCreate(BookingBase):
    """Schema for creating a booking."""
    addon_ids: Optional[List[BookingAddOnItem]] = Field(default_factory=list)


class BookingUpdate(BaseModel):
    """Schema for updating a booking."""
    status: Optional[BookingStatus] = None
    admin_notes: Optional[str] = None


class BookingResponse(BaseModel):
    """Schema for booking response."""
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    user_id: UUID
    package_id: UUID
    event_type: str
    event_date: date
    event_time: time
    location: str
    status: BookingStatus
    total_price: Decimal
    notes: Optional[str]
    admin_notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    addons: List[BookingAddOnResponse] = Field(default_factory=list, alias="booking_addons")
    user: Optional[UserResponse] = None


class BookingDetailResponse(BookingResponse):
    """Schema for detailed booking response with package info."""
    package: PackageResponse

    model_config = ConfigDict(from_attributes=True)
