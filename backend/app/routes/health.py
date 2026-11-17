import time
import os
from fastapi import APIRouter
from app.db.database import get_db

router = APIRouter(tags=["health"])

START_TIME = time.time()
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
        "documentation": "/docs",
    }


@router.get(
    "/health",
    summary="Health check",
    description="Liveness and readiness endpoint reporting database and AI provider status.",
)
def health_check():
    db_status = "connected"
    try:
        with get_db() as conn:
            conn.execute("SELECT 1").fetchone()
    except Exception as e:
        db_status = f"error: {str(e)}"

    has_gemini = bool(os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY"))

    return {
        "status": "healthy",
        "service": APP_NAME,
        "version": API_VERSION,
        "uptime_seconds": round(time.time() - START_TIME, 2),
        "database": db_status,
        "ai_provider": "gemini_llm" if has_gemini else "clinical_expert_engine",
    }


@router.get(
    "/api/health",
    summary="API Health Check alias",
    description="Standard /api/health path for reverse proxies and client probes.",
)
def api_health():
    return health_check()
