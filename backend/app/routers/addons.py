"""
AddOn router for managing optional extras.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.models.addon import AddOn
from app.models.user import User
from app.schemas.addon import AddOnCreate, AddOnUpdate, AddOnResponse
from app.utils.dependencies import get_current_admin

router = APIRouter(prefix="/addons", tags=["Add-ons"])


@router.get("/", response_model=List[AddOnResponse])
def get_addons(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """
    Get all add-ons (public endpoint).

    Args:
        skip: Number of records to skip (pagination)
        limit: Maximum number of records to return
        category: Filter by category (optional)
        active_only: Show only active add-ons
        db: Database session

    Returns:
        List of add-ons
    """
    query = db.query(AddOn)

    if active_only:
        query = query.filter(AddOn.is_active == True)

    if category:
        query = query.filter(AddOn.category == category)

    addons = query.offset(skip).limit(limit).all()
    return addons


@router.post("/", response_model=AddOnResponse, status_code=status.HTTP_201_CREATED)
def create_addon(
    addon_data: AddOnCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Create a new add-on (admin only).

    Args:
        addon_data: Add-on creation data
        db: Database session
        current_admin: Current authenticated admin

    Returns:
        Created add-on
    """
    new_addon = AddOn(**addon_data.model_dump())
    db.add(new_addon)
    db.commit()
    db.refresh(new_addon)
    return new_addon


@router.put("/{addon_id}", response_model=AddOnResponse)
def update_addon(
    addon_id: UUID,
    addon_data: AddOnUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Update an add-on (admin only).

    Args:
        addon_id: Add-on UUID
        addon_data: Add-on update data
        db: Database session
        current_admin: Current authenticated admin

    Returns:
        Updated add-on

    Raises:
        HTTPException: If add-on not found
    """
    addon = db.query(AddOn).filter(AddOn.id == addon_id).first()
    if not addon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Add-on not found"
        )

    # Update only provided fields
    update_data = addon_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(addon, key, value)

    db.commit()
    db.refresh(addon)
    return addon


@router.delete("/{addon_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_addon(
    addon_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Delete an add-on (admin only).

    Args:
        addon_id: Add-on UUID
        db: Database session
        current_admin: Current authenticated admin

    Raises:
        HTTPException: If add-on not found
    """
    addon = db.query(AddOn).filter(AddOn.id == addon_id).first()
    if not addon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Add-on not found"
        )

    db.delete(addon)
    db.commit()
    return None
