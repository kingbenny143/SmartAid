from fastapi import APIRouter, HTTPException, Query
from pathlib import Path
import json
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/api/firstaid", tags=["firstaid"])

DATA_PATH = Path(__file__).parent.parent / "data" / "firstaid.json"

DISCLAIMER = (
    "This is first-aid education for general awareness only. It is NOT a substitute for "
    "certified first-aid training, professional medical advice, diagnosis, or treatment. "
    "In case of emergency or serious injury, call your local emergency number immediately."
)


def _load_topics() -> List[Dict[str, Any]]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f).get("topics", [])


@router.get(
    "",
    summary="List first-aid topics",
    description="Returns all educational first-aid topics with title, category, description, and warning.",
)
def list_firstaid_topics(
    category: Optional[str] = Query(None, description="Optional category filter"),
    q: Optional[str] = Query(None, description="Optional search term"),
):
    topics = _load_topics()
    if category:
        topics = [t for t in topics if t.get("category", "").lower() == category.lower()]
    if q:
        query_str = q.lower()
        topics = [
            t
            for t in topics
            if query_str in t.get("title", "").lower()
            or query_str in t.get("description", "").lower()
        ]

    summary_list = []
    for t in topics:
        summary_list.append({
            "id": t.get("id"),
            "title": t.get("title"),
            "category": t.get("category", "General"),
            "description": t.get("description"),
            "warning": t.get("warning"),
            "step_count": len(t.get("steps", [])),
        })

    categories = sorted(list({t.get("category", "General") for t in _load_topics()}))

    return {
        "topics": summary_list,
        "categories": categories,
        "count": len(summary_list),
        "disclaimer": DISCLAIMER,
    }


@router.get(
    "/{topic_id}",
    summary="Get first-aid topic details",
    description="Returns a single first-aid topic including the step-by-step guidance and warning.",
    responses={
        200: {"description": "Topic found and returned successfully."},
        404: {"description": "The requested topic ID does not exist."},
    },
)
def get_firstaid_topic(topic_id: str):
    topics = _load_topics()
    for t in topics:
        if t.get("id") == topic_id:
            return {
                "topic": t,
                "disclaimer": DISCLAIMER,
            }
    raise HTTPException(
        status_code=404,
        detail=f"First-aid topic with id '{topic_id}' not found.",
    )
