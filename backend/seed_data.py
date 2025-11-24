"""
Seed script to populate database with sample data.
Run this script to add initial packages, add-ons, and admin user.
"""
import sys
import os
from decimal import Decimal
from sqlalchemy.orm import Session

# Fix Windows CMD encoding issue
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
    os.environ['PYTHONIOENCODING'] = 'utf-8'

from app.core.database import SessionLocal, init_db
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.package import Package, PackageCategory
from app.models.addon import AddOn, AddOnCategory


def seed_admin_user(db: Session):
    """Create default admin user."""
    # Check if admin already exists
    existing_admin = db.query(User).filter(User.email == "admin@photobooking.com").first()
    if existing_admin:
        print("⚠️  Admin user already exists")
        return

    admin = User(
        email="admin@photobooking.com",
        password=get_password_hash("admin123"),
        full_name="System Administrator",
        phone="+1234567890",
        role=UserRole.ADMIN
    )
    db.add(admin)
    db.commit()
    print("✅ Admin user created: admin@photobooking.com / admin123")


def seed_packages(db: Session):
    """Create sample photography and videography packages."""
    packages = [
        Package(
            title="Basic Photography Package",
            description="Perfect for small events and intimate gatherings. Includes professional photography coverage with edited photos delivered digitally.",
            category=PackageCategory.PHOTOGRAPHY,
            price=Decimal("299.99"),
            duration=2,
            features=[
                "2 hours of coverage",
                "1 professional photographer",
                "100+ edited photos",
                "Online gallery",
                "Digital download"
            ],
            is_active=True
        ),
        Package(
            title="Premium Photography Package",
            description="Comprehensive photography coverage for weddings, corporate events, and special occasions.",
            category=PackageCategory.PHOTOGRAPHY,
            price=Decimal("799.99"),
            duration=6,
            features=[
                "6 hours of coverage",
                "2 professional photographers",
                "400+ edited photos",
                "Online gallery with sharing",
                "USB drive with all photos",
                "Print release",
                "Custom photo album (20 pages)"
            ],
            is_active=True
        ),
        Package(
            title="Basic Videography Package",
            description="Professional video coverage for your special event with highlight reel.",
            category=PackageCategory.VIDEOGRAPHY,
            price=Decimal("599.99"),
            duration=3,
            features=[
                "3 hours of coverage",
                "1 professional videographer",
                "3-5 minute highlight reel",
                "Full ceremony/event video",
                "Digital delivery (HD)",
                "Background music"
            ],
            is_active=True
        ),
        Package(
            title="Premium Videography Package",
            description="Cinematic video production with drone footage and same-day editing options.",
            category=PackageCategory.VIDEOGRAPHY,
            price=Decimal("1499.99"),
            duration=8,
            features=[
                "8 hours of coverage",
                "2 professional videographers",
                "10-15 minute cinematic film",
                "Full event coverage",
                "Drone aerial footage",
                "4K ultra HD quality",
                "Custom music and color grading",
                "Social media teasers"
            ],
            is_active=True
        ),
        Package(
            title="Ultimate Combo Package",
            description="Complete coverage with both photography and videography for your perfect day.",
            category=PackageCategory.COMBO,
            price=Decimal("1999.99"),
            duration=8,
            features=[
                "8 hours of coverage",
                "2 photographers + 2 videographers",
                "500+ edited photos",
                "15-minute cinematic film",
                "Drone footage included",
                "4K video + high-res photos",
                "Custom album + USB drive",
                "Online galleries",
                "Same-day social media sneak peeks"
            ],
            is_active=True
        ),
        Package(
            title="Photo Editing Only",
            description="Professional editing service for your existing photos.",
            category=PackageCategory.EDITING,
            price=Decimal("199.99"),
            duration=None,
            features=[
                "Color correction",
                "Exposure adjustment",
                "Blemish removal",
                "Background cleanup",
                "Up to 100 photos",
                "3-5 business day delivery"
            ],
            is_active=True
        ),
    ]

    for package in packages:
        existing = db.query(Package).filter(Package.title == package.title).first()
        if not existing:
            db.add(package)

    db.commit()
    print(f"✅ {len(packages)} packages created")


def seed_addons(db: Session):
    """Create sample add-ons."""
    addons = [
        AddOn(
            name="Drone Aerial Footage",
            description="Professional drone footage capturing stunning aerial views of your event",
            price=Decimal("199.99"),
            category=AddOnCategory.EQUIPMENT,
            is_active=True
        ),
        AddOn(
            name="Second Photographer",
            description="Additional photographer for extended coverage and different angles",
            price=Decimal("299.99"),
            category=AddOnCategory.PERSONNEL,
            is_active=True
        ),
        AddOn(
            name="Second Videographer",
            description="Additional videographer for multi-angle video coverage",
            price=Decimal("399.99"),
            category=AddOnCategory.PERSONNEL,
            is_active=True
        ),
        AddOn(
            name="Extra Hour of Coverage",
            description="Extend your photography or videography coverage by one hour",
            price=Decimal("100.00"),
            category=AddOnCategory.OTHER,
            is_active=True
        ),
        AddOn(
            name="Same-Day Editing",
            description="Get a highlight reel or selection of edited photos the same day",
            price=Decimal("299.99"),
            category=AddOnCategory.EDITING,
            is_active=True
        ),
        AddOn(
            name="Photo Booth",
            description="Interactive photo booth with props and instant prints",
            price=Decimal("399.99"),
            category=AddOnCategory.EQUIPMENT,
            is_active=True
        ),
        AddOn(
            name="Custom Photo Album",
            description="Premium hardcover photo album with 40 pages",
            price=Decimal("249.99"),
            category=AddOnCategory.OTHER,
            is_active=True
        ),
        AddOn(
            name="Engagement Session",
            description="Pre-event engagement or portrait session (2 hours)",
            price=Decimal("349.99"),
            category=AddOnCategory.OTHER,
            is_active=True
        ),
    ]

    for addon in addons:
        existing = db.query(AddOn).filter(AddOn.name == addon.name).first()
        if not existing:
            db.add(addon)

    db.commit()
    print(f"✅ {len(addons)} add-ons created")


def main():
    """Main seed function."""
    print("🌱 Starting database seeding...")

    # Initialize database
    init_db()

    # Create session
    db = SessionLocal()

    try:
        # Seed data
        seed_admin_user(db)
        seed_packages(db)
        seed_addons(db)

        print("\n✨ Database seeding completed successfully!")
        print("\n📋 Quick Reference:")
        print("   Admin Login: admin@photobooking.com / admin123")
        print("   Packages: 6 sample packages created")
        print("   Add-ons: 8 sample add-ons created")
        print("\n🚀 You can now start the application!")

    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
