"""
Package router for managing photography/videography packages.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.models.package import Package
from app.models.user import User
from app.schemas.package import PackageCreate, PackageUpdate, PackageResponse
from app.utils.dependencies import get_current_admin

router = APIRouter(prefix="/packages", tags=["Packages"])


@router.get("/", response_model=List[PackageResponse])
def get_packages(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """
    Get all packages (public endpoint).

    Args:
        skip: Number of records to skip (pagination)
        limit: Maximum number of records to return
        category: Filter by category (optional)
        active_only: Show only active packages
        db: Database session

    Returns:
        List of packages
    """
    query = db.query(Package)

    if active_only:
        query = query.filter(Package.is_active == True)

    if category:
        query = query.filter(Package.category == category)

    packages = query.offset(skip).limit(limit).all()
    return packages


@router.get("/{package_id}", response_model=PackageResponse)
def get_package(package_id: UUID, db: Session = Depends(get_db)):
    """
    Get a specific package by ID.

    Args:
        package_id: Package UUID
        db: Database session

    Returns:
        Package details

    Raises:
        HTTPException: If package not found
    """
    package = db.query(Package).filter(Package.id == package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found"
        )
    return package


@router.post("/", response_model=PackageResponse, status_code=status.HTTP_201_CREATED)
def create_package(
    package_data: PackageCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Create a new package (admin only).

    Args:
        package_data: Package creation data
        db: Database session
        current_admin: Current authenticated admin

    Returns:
        Created package

    Raises:
        HTTPException: If not authorized
    """
    new_package = Package(**package_data.model_dump())
    db.add(new_package)
    db.commit()
    db.refresh(new_package)
    return new_package


@router.put("/{package_id}", response_model=PackageResponse)
def update_package(
    package_id: UUID,
    package_data: PackageUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Update a package (admin only).

    Args:
        package_id: Package UUID
        package_data: Package update data
        db: Database session
        current_admin: Current authenticated admin

    Returns:
        Updated package

    Raises:
        HTTPException: If package not found or not authorized
    """
    package = db.query(Package).filter(Package.id == package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found"
        )

    # Update only provided fields
    update_data = package_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(package, key, value)

    db.commit()
    db.refresh(package)
    return package


@router.delete("/{package_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_package(
    package_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """
    Delete a package (admin only).

    Args:
        package_id: Package UUID
        db: Database session
        current_admin: Current authenticated admin

    Raises:
        HTTPException: If package not found, has bookings, or not authorized
    """
    package = db.query(Package).filter(Package.id == package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found"
        )

    # Check if package has bookings
    if package.bookings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete package with existing bookings. Set is_active to False instead."
        )

    db.delete(package)
    db.commit()
    return None
