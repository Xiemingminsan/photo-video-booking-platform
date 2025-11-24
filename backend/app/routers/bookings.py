"""
Booking router for managing client bookings.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import date, datetime
from decimal import Decimal

from app.core.database import get_db
from app.models.booking import Booking, BookingAddOn, BookingStatus
from app.models.package import Package
from app.models.addon import AddOn
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingUpdate, BookingResponse, BookingDetailResponse
from app.utils.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new booking (authenticated users).

    Args:
        booking_data: Booking creation data
        db: Database session
        current_user: Current authenticated user

    Returns:
        Created booking

    Raises:
        HTTPException: If package not found or event date is in the past
    """
    # Validate package exists
    package = db.query(Package).filter(Package.id == booking_data.package_id).first()
    if not package or not package.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found or not active"
        )

    # Validate event date is in the future
    if booking_data.event_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event date must be in the future"
        )

    # Calculate total price
    total_price = package.price

    # Create booking
    new_booking = Booking(
        user_id=current_user.id,
        package_id=booking_data.package_id,
        event_type=booking_data.event_type,
        event_date=booking_data.event_date,
        event_time=booking_data.event_time,
        location=booking_data.location,
        notes=booking_data.notes,
        total_price=total_price,
        status=BookingStatus.PENDING
    )

    db.add(new_booking)
    db.flush()  # Get booking ID without committing

    # Add add-ons if provided
    if booking_data.addon_ids:
        for addon_item in booking_data.addon_ids:
            addon = db.query(AddOn).filter(AddOn.id == addon_item.addon_id).first()
            if addon and addon.is_active:
                booking_addon = BookingAddOn(
                    booking_id=new_booking.id,
                    addon_id=addon.id,
                    quantity=addon_item.quantity
                )
                db.add(booking_addon)
                total_price += addon.price * addon_item.quantity

    # Update total price
    new_booking.total_price = total_price

    db.commit()
    db.refresh(new_booking)
    return new_booking


@router.get("/user/{user_id}", response_model=List[BookingDetailResponse])
def get_user_bookings(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all bookings for a specific user.

    Args:
        user_id: User UUID
        db: Database session
        current_user: Current authenticated user

    Returns:
        List of user's bookings

    Raises:
        HTTPException: If user tries to access another user's bookings
    """
    # Users can only see their own bookings (unless admin)
    if str(current_user.id) != str(user_id) and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view these bookings"
        )

    bookings = db.query(Booking).filter(Booking.user_id == user_id).all()
    return bookings


@router.get("/", response_model=List[BookingDetailResponse])
def get_all_bookings(
    skip: int = 0,
    limit: int = 100,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Get all bookings (admin only).

    Args:
        skip: Number of records to skip (pagination)
        limit: Maximum number of records to return
        status_filter: Filter by status (optional)
        db: Database session
        current_admin: Current authenticated admin

    Returns:
        List of all bookings
    """
    query = db.query(Booking)

    if status_filter:
        query = query.filter(Booking.status == status_filter)

    bookings = query.offset(skip).limit(limit).all()
    return bookings


@router.get("/{booking_id}", response_model=BookingDetailResponse)
def get_booking(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific booking by ID.

    Args:
        booking_id: Booking UUID
        db: Database session
        current_user: Current authenticated user

    Returns:
        Booking details

    Raises:
        HTTPException: If booking not found or not authorized
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Users can only see their own bookings (unless admin)
    if str(booking.user_id) != str(current_user.id) and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this booking"
        )

    return booking


@router.put("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: UUID,
    booking_update: BookingUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Update booking status (admin only).

    Args:
        booking_id: Booking UUID
        booking_update: Booking update data
        db: Database session
        current_admin: Current authenticated admin

    Returns:
        Updated booking

    Raises:
        HTTPException: If booking not found
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Update only provided fields
    update_data = booking_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(booking, key, value)

    db.commit()
    db.refresh(booking)
    return booking
