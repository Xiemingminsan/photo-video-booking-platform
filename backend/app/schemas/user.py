"""
Pydantic schemas for User model.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

from app.models.user import UserRole


# Base schema with common fields
class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)


# Schema for user creation (registration)
class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=6, max_length=100)
    role: Optional[UserRole] = UserRole.CLIENT


# Schema for user login
class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


# Schema for user response (what gets returned from API)
class UserResponse(UserBase):
    """Schema for user response."""
    id: UUID
    role: UserRole
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Schema for token response
class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Schema for token data
class TokenData(BaseModel):
    """Schema for decoded token data."""
    user_id: UUID
    email: str
    role: UserRole
