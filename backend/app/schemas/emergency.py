from pydantic import BaseModel, Field
from typing import List, Optional


class EmergencyContact(BaseModel):
    country_code: str
    country_name: str
    police: str
    ambulance: str
    fire: str
    general_emergency: str
    poison_control: Optional[str] = None
    notes: Optional[str] = None


class EmergencyContactsResponse(BaseModel):
    contacts: List[EmergencyContact]
    disclaimer: str
