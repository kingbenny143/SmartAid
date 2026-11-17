from fastapi import APIRouter

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chatbot import get_chat_provider

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post(
    "",
    summary="Send a message to the AI health assistant",
    description=(
        "Endpoint for the Smart Aid AI assistant. Supports intelligent health "
        "guidance, emergency triage, multi-turn history, and optional LLM "
        "integration. Not a substitute for professional medical care."
    ),
    response_model=ChatResponse,
    responses={
        200: {"description": "Assistant reply generated successfully."},
        422: {"description": "Request invalid (e.g. empty message)."},
    },
)
def chat(payload: ChatRequest):
    provider = get_chat_provider()
    return provider.reply(payload.message, payload.history)
