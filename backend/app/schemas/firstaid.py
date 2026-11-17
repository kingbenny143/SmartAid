from pydantic import BaseModel, Field
from typing import List, Optional


class FirstAidStep(BaseModel):
    step: int = Field(description="Step sequence number")
    title: str = Field(description="Short step title")
    text: str = Field(description="Actionable instruction text")


class FirstAidTopicSummary(BaseModel):
    id: str = Field(description="Unique topic identifier")
    title: str = Field(description="Title of the first aid guide")
    category: str = Field(description="Category (e.g. Emergency Response, Everyday Wounds)")
    description: str = Field(description="Summary of the guide")
    warning: Optional[str] = Field(default=None, description="Important clinical or safety warning")
    step_count: int = Field(description="Total number of steps")


class FirstAidTopicDetail(BaseModel):
    id: str = Field(description="Unique topic identifier")
    title: str = Field(description="Title of the first aid guide")
    category: str = Field(description="Category")
    description: str = Field(description="Summary")
    warning: Optional[str] = Field(default=None, description="Clinical or safety warning")
    steps: List[FirstAidStep] = Field(description="Step-by-step guidance")
    when_to_seek_care: Optional[List[str]] = Field(
        default=None,
        description="List of signs indicating when professional care is necessary"
    )
    what_not_to_do: Optional[List[str]] = Field(
        default=None,
        description="Dangerous actions or myths to strictly avoid"
    )


class FirstAidListResponse(BaseModel):
    topics: List[FirstAidTopicSummary]
    categories: List[str]
    count: int
    disclaimer: str
