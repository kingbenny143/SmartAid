from fastapi import APIRouter
from app.schemas.wellness import WellnessTipsResponse, WellnessTip
from app.services.wellness import (
    get_all_wellness_tips,
    get_daily_tip,
    WELLNESS_DISCLAIMER,
)

router = APIRouter(prefix="/api/wellness", tags=["wellness"])


@router.get(
    "/daily-tip",
    summary="Get today's preventive wellness tip",
    description="Returns a rotating evidence-informed lifestyle and wellness tip.",
    response_model=WellnessTip,
)
def get_today_tip():
    return get_daily_tip()


@router.get(
    "/tips",
    summary="List all evidence-informed wellness tips",
    description="Returns categorized preventive health advice covering hydration, sleep, posture, immunity, and stress.",
    response_model=WellnessTipsResponse,
)
def list_tips():
    tips = get_all_wellness_tips()
    categories = sorted(list({t["category"] for t in tips}))
    return {
        "tips": tips,
        "categories": categories,
        "disclaimer": WELLNESS_DISCLAIMER,
    }
