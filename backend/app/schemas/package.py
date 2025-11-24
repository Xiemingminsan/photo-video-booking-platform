"""
Pydantic schemas for Package model.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from decimal import Decimal

from app.models.package import PackageCategory


# Base schema
class PackageBase(BaseModel):
    """Base package schema."""
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    category: PackageCategory
    price: Decimal = Field(..., ge=0, decimal_places=2)
    duration: Optional[int] = Field(None, ge=1)
    features: List[str] = Field(..., min_items=1)


# Schema for package creation
class PackageCreate(PackageBase):
    """Schema for creating a package."""
    is_active: Optional[bool] = True


# Schema for package update
class PackageUpdate(BaseModel):
    """Schema for updating a package."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    category: Optional[PackageCategory] = None
    price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    duration: Optional[int] = Field(None, ge=1)
    features: Optional[List[str]] = Field(None, min_items=1)
    is_active: Optional[bool] = None


# Schema for package response
class PackageResponse(PackageBase):
    """Schema for package response."""
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
