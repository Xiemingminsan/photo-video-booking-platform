"""
Pydantic schemas initialization.
"""
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token, TokenData
from app.schemas.package import PackageCreate, PackageUpdate, PackageResponse
from app.schemas.addon import AddOnCreate, AddOnUpdate, AddOnResponse
from app.schemas.booking import (
    BookingCreate,
    BookingUpdate,
    BookingResponse,
    BookingDetailResponse,
    BookingAddOnItem,
)
from app.schemas.delivery import DeliveryCreate, DeliveryUpdate, DeliveryResponse

__all__ = [
    # User schemas
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "Token",
    "TokenData",
    # Package schemas
    "PackageCreate",
    "PackageUpdate",
    "PackageResponse",
    # AddOn schemas
    "AddOnCreate",
    "AddOnUpdate",
    "AddOnResponse",
    # Booking schemas
    "BookingCreate",
    "BookingUpdate",
    "BookingResponse",
    "BookingDetailResponse",
    "BookingAddOnItem",
    # Delivery schemas
    "DeliveryCreate",
    "DeliveryUpdate",
    "DeliveryResponse",
]