import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from app.db.database import get_db


def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def save_assessment_record(
    symptoms: List[str],
    duration: str,
    severity: str,
    assessment_result: Dict[str, Any],
    record_id: Optional[str] = None,
    notes: Optional[str] = None,
) -> Dict[str, Any]:
    """Persists an assessment result into the SQLite database."""
    assigned_id = record_id or str(uuid.uuid4())
    created_at = _iso_now()

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO assessments (
                id, created_at, symptoms, duration, severity,
                risk_level, possible_categories, guidance, red_flags,
                next_steps, matched_symptoms, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                assigned_id,
                created_at,
                json.dumps(symptoms),
                duration,
                severity,
                assessment_result.get("risk_level", "low"),
                json.dumps(assessment_result.get("possible_categories", [])),
                json.dumps(assessment_result.get("guidance", [])),
                json.dumps(assessment_result.get("red_flags", [])),
                json.dumps(assessment_result.get("next_steps", [])),
                json.dumps(assessment_result.get("matched_symptoms", [])),
                notes,
            ),
        )

    return get_assessment_record(assigned_id)  # type: ignore


def get_assessment_record(record_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves a single assessment by ID."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM assessments WHERE id = ?", (record_id,))
        row = cursor.fetchone()
        if not row:
            return None

        return {
            "id": row["id"],
            "created_at": row["created_at"],
            "symptoms": json.loads(row["symptoms"]),
            "duration": row["duration"],
            "severity": row["severity"],
            "risk_level": row["risk_level"],
            "possible_categories": json.loads(row["possible_categories"]),
            "guidance": json.loads(row["guidance"]),
            "red_flags": json.loads(row["red_flags"]),
            "next_steps": json.loads(row["next_steps"]),
            "matched_symptoms": json.loads(row["matched_symptoms"]),
            "notes": row["notes"],
        }


def list_recent_assessments(limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
    """Returns recent assessments sorted by newest first."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, created_at, symptoms, duration, severity, risk_level,
                   possible_categories, matched_symptoms, notes
            FROM assessments
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
            """,
            (limit, offset),
        )
        rows = cursor.fetchall()
        results = []
        for row in rows:
            results.append({
                "id": row["id"],
                "created_at": row["created_at"],
                "symptoms": json.loads(row["symptoms"]),
                "duration": row["duration"],
                "severity": row["severity"],
                "risk_level": row["risk_level"],
                "possible_categories": json.loads(row["possible_categories"]),
                "matched_symptoms": json.loads(row["matched_symptoms"]),
                "notes": row["notes"],
            })
        return results


def delete_assessment_record(record_id: str) -> bool:
    """Deletes an assessment record by ID."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM assessments WHERE id = ?", (record_id,))
        return cursor.rowcount > 0


def save_user_feedback(
    target_type: str,
    rating: int,
    target_id: Optional[str] = None,
    comment: Optional[str] = None,
) -> Dict[str, Any]:
    """Stores user feedback (1 to 5 stars + optional comment)."""
    feedback_id = str(uuid.uuid4())
    created_at = _iso_now()

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO feedback (id, target_type, target_id, rating, comment, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (feedback_id, target_type, target_id, rating, comment, created_at),
        )

    return {
        "id": feedback_id,
        "target_type": target_type,
        "target_id": target_id,
        "rating": rating,
        "comment": comment,
        "created_at": created_at,
    }


def get_backend_stats() -> Dict[str, Any]:
    """Returns aggregated summary metrics from the database."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) AS total FROM assessments")
        total_assessments = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM assessments WHERE risk_level = 'high'")
        high_risk_assessments = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM feedback")
        total_feedback = cursor.fetchone()["total"]

        cursor.execute("SELECT AVG(rating) AS avg_rating FROM feedback")
        avg_rating_row = cursor.fetchone()["avg_rating"]
        avg_rating = round(avg_rating_row, 2) if avg_rating_row is not None else None

        return {
            "total_assessments": total_assessments,
            "high_risk_assessments": high_risk_assessments,
            "total_feedback": total_feedback,
            "average_feedback_rating": avg_rating,
        }
