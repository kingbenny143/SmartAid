from pydantic import BaseModel, Field
from typing import List, Optional, Dict


class ChatHistoryItem(BaseModel):
    role: str = Field(description="Role of the sender: 'user' or 'assistant'")
    content: str = Field(description="Text message content")


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        description="The user's message to the health-awareness assistant.",
        examples=["What should I know about dehydration?"],
    )
    history: Optional[List[ChatHistoryItem]] = Field(
        default=None,
        description="Optional preceding conversation turns for contextual multi-turn conversation.",
    )


class ChatResponse(BaseModel):
    reply: str = Field(description="The assistant's informational response.")
    category: str = Field(
        default="general_health",
        description="Educational topic category the reply belongs to.",
    )
    risk_level: Optional[str] = Field(
        default="low",
        description="Informational safety level: 'low', 'moderate', 'high', or 'emergency'.",
    )
    suggested_prompts: Optional[List[str]] = Field(
        default=None,
        description="Helpful contextual follow-up questions.",
    )
    disclaimer: str = Field(
        description="Mandatory disclaimer that the assistant does not provide medical diagnosis."
    )
