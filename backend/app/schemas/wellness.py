from pydantic import BaseModel, Field
from typing import List, Optional


class WellnessTip(BaseModel):
    id: str
    category: str
    title: str
    summary: str
    actionable_points: List[str]
    icon: Optional[str] = None


class WellnessTipsResponse(BaseModel):
    tips: List[WellnessTip]
    categories: List[str]
    disclaimer: str
