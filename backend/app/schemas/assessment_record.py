from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class AssessmentHistoryItem(BaseModel):
    id: str
    created_at: str
    symptoms: List[str]
    duration: str
    severity: str
    risk_level: str
    possible_categories: List[str]
    matched_symptoms: Optional[List[str]] = None
    notes: Optional[str] = None


class AssessmentHistoryResponse(BaseModel):
    items: List[AssessmentHistoryItem]
    count: int


class FeedbackCreateRequest(BaseModel):
    target_type: Literal["assessment", "chat", "firstaid"] = Field(
        ...,
        description="Type of feature the user is providing feedback on."
    )
    rating: int = Field(
        ...,
        ge=1,
        le=5,
        description="Star rating from 1 to 5."
    )
    target_id: Optional[str] = Field(
        default=None,
        description="Optional ID of the assessment or topic being evaluated."
    )
    comment: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Optional user comments or observations."
    )


class FeedbackResponse(BaseModel):
    id: str
    target_type: str
    target_id: Optional[str]
    rating: int
    comment: Optional[str]
    created_at: str
    message: str = "Thank you for helping improve Smart Aid."
