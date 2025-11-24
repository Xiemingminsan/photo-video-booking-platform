"""
Main FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import init_db
from app.routers import auth, packages, addons, bookings, delivery


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for application startup and shutdown.
    """
    # Startup: Initialize database tables
    init_db()
    print("Database initialized successfully")
    yield
    # Shutdown: Clean up resources
    print("Application shutting down")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="A full-stack platform for booking photography and videography services",
    version=settings.VERSION,
    lifespan=lifespan
)

# Configure CORS - allow local dev origins
allowed_origins = settings.cors_origins or []
if "http://localhost:5173" not in allowed_origins:
  allowed_origins.append("http://localhost:5173")
if "http://127.0.0.1:5173" not in allowed_origins:
  allowed_origins.append("http://127.0.0.1:5173")
print(f"CORS allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(packages.router)
app.include_router(addons.router)
app.include_router(bookings.router)
app.include_router(delivery.router)


@app.get("/")
def root():
    """
    Root endpoint - health check.
    """
    return {
        "message": "Welcome to Event Photography & Videography Booking System API",
        "version": settings.VERSION,
        "docs": "/docs",
        "status": "healthy"
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy", "service": settings.APP_NAME}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
