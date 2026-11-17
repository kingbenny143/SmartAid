from pydantic import BaseModel, Field
from typing import List, Literal, Optional


class SymptomItem(BaseModel):
    id: str
    name: str
    category: str
    description: str


class SymptomListResponse(BaseModel):
    symptoms: List[SymptomItem]
    categories: List[str]
    count: int


class SymptomAssessmentRequest(BaseModel):
    symptoms: List[str] = Field(
        ...,
        min_length=1,
        description="Non-empty list of symptom names or identifiers.",
        examples=[["fever", "headache"]],
    )
    duration: str = Field(
        ...,
        min_length=1,
        description="Free-form duration description (e.g. '1–3 days', 'Less than 1 day').",
        examples=["1–3 days"],
    )
    severity: Literal["mild", "moderate", "severe"] = Field(
        ...,
        description="Perceived severity: mild, moderate, or severe.",
        examples=["moderate"],
    )


class SymptomAssessmentResponse(BaseModel):
    id: Optional[str] = Field(
        default=None,
        description="Unique identifier for the persisted assessment record."
    )
    created_at: Optional[str] = Field(
        default=None,
        description="ISO timestamp of when the assessment was conducted."
    )
    risk_level: Literal["low", "moderate", "high"]
    possible_categories: List[str] = Field(
        description="Educational categories the symptoms may be associated with."
    )
    guidance: List[str] = Field(
        description="General informational self-care and awareness guidance."
    )
    red_flags: List[str] = Field(
        description="Safety warning signs that warrant prompt professional attention."
    )
    next_steps: List[str] = Field(
        description="Suggested practical next actions for the user."
    )
    matched_symptoms: Optional[List[str]] = Field(
        default=None,
        description="List of symptoms recognized and analyzed."
    )
    disclaimer: str = Field(
        description="Mandatory health disclaimer stating that Smart Aid does not provide medical diagnosis."
    )
