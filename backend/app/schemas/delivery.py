"""
Pydantic schemas for Delivery model.
"""
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID


# Schema for download link
class DownloadLink(BaseModel):
    """Schema for a download link."""
    type: str = Field(..., description="Type of link (google_drive, dropbox, etc.)")
    url: str = Field(..., description="URL to the download")
    description: Optional[str] = Field(None, description="Description of the content")


# Base schema
class DeliveryBase(BaseModel):
    """Base delivery schema."""
    photo_urls: Optional[List[str]] = Field(default_factory=list)
    video_urls: Optional[List[str]] = Field(default_factory=list)
    download_links: Optional[List[DownloadLink]] = Field(default_factory=list)
    notes: Optional[str] = None


# Schema for delivery creation
class DeliveryCreate(DeliveryBase):
    """Schema for creating a delivery."""
    booking_id: UUID


# Schema for delivery update
class DeliveryUpdate(DeliveryBase):
    """Schema for updating a delivery."""
    pass


# Schema for delivery response
class DeliveryResponse(DeliveryBase):
    """Schema for delivery response."""
    id: UUID
    booking_id: UUID
    delivered_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
