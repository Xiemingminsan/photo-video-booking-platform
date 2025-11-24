"""
Pydantic schemas for AddOn model.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from decimal import Decimal

from app.models.addon import AddOnCategory


# Base schema
class AddOnBase(BaseModel):
    """Base add-on schema."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: Decimal = Field(..., ge=0, decimal_places=2)
    category: AddOnCategory


# Schema for add-on creation
class AddOnCreate(AddOnBase):
    """Schema for creating an add-on."""
    is_active: Optional[bool] = True


# Schema for add-on update
class AddOnUpdate(BaseModel):
    """Schema for updating an add-on."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    category: Optional[AddOnCategory] = None
    is_active: Optional[bool] = None


# Schema for add-on response
class AddOnResponse(AddOnBase):
    """Schema for add-on response."""
    id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
