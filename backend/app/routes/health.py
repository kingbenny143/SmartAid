from fastapi import APIRouter
import os

router = APIRouter(tags=["health"])

APP_NAME = os.getenv("APP_NAME", "Smart Aid API")
API_VERSION = os.getenv("API_VERSION", "1.0.0")


@router.get(
    "/",
    summary="Root status endpoint",
    description="Returns basic information about the running Smart Aid API.",
)
def root():
    return {
        "name": APP_NAME,
        "version": API_VERSION,
        "status": "running",
    }


@router.get(
    "/health",
    summary="Health check",
    description="Simple liveness / readiness endpoint for monitoring.",
)
def health_check():
    return {
        "status": "healthy",
        "service": APP_NAME,
    }
