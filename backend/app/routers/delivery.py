"""
Delivery router for managing final deliverables.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.models.delivery import Delivery
from app.models.booking import Booking, BookingStatus
from app.models.user import User
from app.schemas.delivery import DeliveryCreate, DeliveryUpdate, DeliveryResponse
from app.utils.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/delivery", tags=["Delivery"])


@router.post("/", response_model=DeliveryResponse, status_code=status.HTTP_201_CREATED)
def create_delivery(
    delivery_data: DeliveryCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Create a delivery for a booking (admin only).

    Args:
        delivery_data: Delivery creation data
        db: Database session
        current_admin: Current authenticated admin

    Returns:
        Created delivery

    Raises:
        HTTPException: If booking not found, not completed, or delivery already exists
    """
    # Validate booking exists and is completed
    booking = db.query(Booking).filter(Booking.id == delivery_data.booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    if booking.status != BookingStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only create delivery for completed bookings"
        )

    # Check if delivery already exists
    existing_delivery = db.query(Delivery).filter(Delivery.booking_id == delivery_data.booking_id).first()
    if existing_delivery:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Delivery already exists for this booking"
        )

    # Create delivery
    new_delivery = Delivery(**delivery_data.model_dump())
    db.add(new_delivery)
    db.commit()
    db.refresh(new_delivery)
    return new_delivery


@router.get("/{booking_id}", response_model=DeliveryResponse)
def get_delivery(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get delivery for a booking.

    Args:
        booking_id: Booking UUID
        db: Database session
        current_user: Current authenticated user

    Returns:
        Delivery details

    Raises:
        HTTPException: If delivery not found or not authorized
    """
    # Get booking to verify ownership
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Users can only see their own deliveries (unless admin)
    if str(booking.user_id) != str(current_user.id) and current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this delivery"
        )

    # Get delivery
    delivery = db.query(Delivery).filter(Delivery.booking_id == booking_id).first()
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Delivery not found for this booking"
        )

    return delivery


@router.put("/{booking_id}", response_model=DeliveryResponse)
def update_delivery(
    booking_id: UUID,
    delivery_update: DeliveryUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Update a delivery (admin only).

    Args:
        booking_id: Booking UUID
        delivery_update: Delivery update data
        db: Database session
        current_admin: Current authenticated admin

    Returns:
        Updated delivery

    Raises:
        HTTPException: If delivery not found
    """
    delivery = db.query(Delivery).filter(Delivery.booking_id == booking_id).first()
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Delivery not found"
        )

    # Update only provided fields
    update_data = delivery_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(delivery, key, value)

    db.commit()
    db.refresh(delivery)
    return delivery
