from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional, List, Dict, Any

from app.schemas.assessment_record import (
    AssessmentHistoryItem,
    AssessmentHistoryResponse,
    FeedbackCreateRequest,
    FeedbackResponse,
)
from app.db.crud import (
    list_recent_assessments,
    get_assessment_record,
    delete_assessment_record,
    save_user_feedback,
    get_backend_stats,
)

router = APIRouter(prefix="/api/assessments", tags=["assessments"])


@router.get(
    "/history",
    summary="List past health assessments",
    description="Returns recent assessment records saved in the database.",
    response_model=AssessmentHistoryResponse,
)
def get_assessment_history(
    limit: int = Query(20, ge=1, le=100, description="Max records to return"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
):
    items = list_recent_assessments(limit=limit, offset=offset)
    return {
        "items": items,
        "count": len(items),
    }


@router.get(
    "/stats",
    summary="Get assessment statistics",
    description="Returns aggregate assessment count, risk distribution, and feedback averages.",
)
def get_stats():
    return get_backend_stats()


@router.get(
    "/{assessment_id}",
    summary="Get single assessment details",
    description="Retrieves a full assessment record including guidance, red flags, and next steps.",
)
def get_assessment(assessment_id: str):
    record = get_assessment_record(assessment_id)
    if not record:
        raise HTTPException(
            status_code=404,
            detail=f"Assessment record with id '{assessment_id}' not found.",
        )
    return record


@router.delete(
    "/{assessment_id}",
    summary="Delete an assessment record",
    description="Removes a specific assessment record from the database.",
)
def delete_assessment(assessment_id: str):
    success = delete_assessment_record(assessment_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Assessment record with id '{assessment_id}' not found.",
        )
    return {
        "ok": True,
        "deleted_id": assessment_id,
        "message": "Assessment record deleted successfully.",
    }


@router.post(
    "/feedback",
    summary="Submit user feedback",
    description="Accepts rating (1 to 5) and optional comment regarding an assessment, guide, or chat response.",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_feedback(payload: FeedbackCreateRequest):
    return save_user_feedback(
        target_type=payload.target_type,
        rating=payload.rating,
        target_id=payload.target_id,
        comment=payload.comment,
    )
