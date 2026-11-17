from fastapi import APIRouter
from app.schemas.emergency import EmergencyContactsResponse
from app.services.emergency import get_emergency_contacts, EMERGENCY_DISCLAIMER

router = APIRouter(prefix="/api/emergency", tags=["emergency"])


@router.get(
    "/contacts",
    summary="List emergency contact numbers",
    description="Provides emergency services, ambulance, police, fire, and poison control hotlines by region.",
    response_model=EmergencyContactsResponse,
)
def list_emergency_contacts():
    return {
        "contacts": get_emergency_contacts(),
        "disclaimer": EMERGENCY_DISCLAIMER,
    }
