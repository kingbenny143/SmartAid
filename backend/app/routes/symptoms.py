from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional

from app.schemas.symptom import (
    SymptomAssessmentRequest,
    SymptomAssessmentResponse,
    SymptomListResponse,
    SymptomItem,
)
from app.services.assessment import get_all_symptoms, run_assessment
from app.db.crud import save_assessment_record

router = APIRouter(prefix="/api/symptoms", tags=["symptoms"])


@router.get(
    "",
    summary="List available symptoms",
    description="Returns the curated library of symptoms with descriptions, categories, and optional filtering.",
    response_model=SymptomListResponse,
)
def list_symptoms(
    category: Optional[str] = Query(None, description="Optional category filter"),
    q: Optional[str] = Query(None, description="Optional search term"),
):
    symptoms_data = get_all_symptoms()
    if category:
        symptoms_data = [
            s for s in symptoms_data
            if s.get("category", "").lower() == category.lower()
        ]
    if q:
        query_str = q.lower()
        symptoms_data = [
            s for s in symptoms_data
            if query_str in s.get("name", "").lower()
            or query_str in s.get("description", "").lower()
        ]

    categories = sorted(list({s["category"] for s in get_all_symptoms() if "category" in s}))
    return {
        "symptoms": symptoms_data,
        "categories": categories,
        "count": len(symptoms_data),
    }


@router.get(
    "/{symptom_id}",
    summary="Get single symptom details",
    description="Returns metadata and clinical description for a specific symptom.",
    responses={
        200: {"description": "Symptom found and returned."},
        404: {"description": "Symptom ID does not exist."},
    },
)
def get_symptom(symptom_id: str):
    symptoms_data = get_all_symptoms()
    for s in symptoms_data:
        if s.get("id") == symptom_id.lower():
            return s
    raise HTTPException(
        status_code=404,
        detail=f"Symptom with id '{symptom_id}' not found.",
    )


@router.post(
    "/assess",
    summary="Run informational symptom assessment",
    description=(
        "Accepts a list of symptoms with duration and severity, then returns a "
        "rule-based informational result with possible categories, guidance, "
        "red flags, and next steps, and automatically records it to the database. "
        "Not a medical diagnosis."
    ),
    response_model=SymptomAssessmentResponse,
    responses={
        200: {"description": "Informational assessment completed successfully."},
        422: {"description": "Validation error in the submitted request."},
    },
)
def assess_symptoms(payload: SymptomAssessmentRequest):
    result = run_assessment(
        symptoms=payload.symptoms,
        duration=payload.duration,
        severity=payload.severity,
    )
    
    # Automatically persist to SQLite database
    try:
        record = save_assessment_record(
            symptoms=payload.symptoms,
            duration=payload.duration,
            severity=payload.severity,
            assessment_result=result,
        )
        if record:
            result["id"] = record.get("id")
            result["created_at"] = record.get("created_at")
    except Exception as e:
        # Graceful fallback: do not fail user assessment if DB logging fails
        print(f"[Assess] Warning: Could not persist assessment record: {e}")

    return result
