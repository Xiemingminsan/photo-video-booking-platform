"""
Application configuration and settings.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "Event Photography Booking System"
    DEBUG: bool = True
    VERSION: str = "1.0.0"

    # Database (defaults to SQLite for local development)
    DATABASE_URL: str = "sqlite:///./photobooking.db"

    # JWT
    SECRET_KEY: str = "dev-secret-key-change-in-production-09a8f7b6c5d4e3f2a1b0"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
