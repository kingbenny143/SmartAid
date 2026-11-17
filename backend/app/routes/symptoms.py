from fastapi import APIRouter
from typing import List, Dict, Any

from app.schemas.symptom import (
    SymptomAssessmentRequest,
    SymptomAssessmentResponse,
    SymptomListResponse,
    SymptomItem,
)
from app.services.assessment import get_all_symptoms, run_assessment

router = APIRouter(prefix="/api/symptoms", tags=["symptoms"])


@router.get(
    "",
    summary="List available symptoms",
    description="Returns the curated library of symptoms with descriptions and categories.",
    response_model=SymptomListResponse,
)
def list_symptoms():
    symptoms_data = get_all_symptoms()
    categories = sorted(list({s["category"] for s in symptoms_data if "category" in s}))
    return {
        "symptoms": symptoms_data,
        "categories": categories,
        "count": len(symptoms_data),
    }


@router.post(
    "/assess",
    summary="Run informational symptom assessment",
    description=(
        "Accepts a list of symptoms with duration and severity, then returns a "
        "rule-based informational result with possible categories, guidance, "
        "red flags, and next steps. Not a medical diagnosis."
    ),
    response_model=SymptomAssessmentResponse,
    responses={
        200: {"description": "Informational assessment completed successfully."},
        422: {"description": "Validation error in the submitted request."},
    },
)
def assess_symptoms(payload: SymptomAssessmentRequest):
    return run_assessment(
        symptoms=payload.symptoms,
        duration=payload.duration,
        severity=payload.severity,
    )
