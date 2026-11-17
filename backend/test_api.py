import sys
import os

# Ensure backend root is in PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.database import init_db
from app.db.crud import get_backend_stats
from app.routes.health import health_check, root
from app.routes.symptoms import list_symptoms, get_symptom, assess_symptoms
from app.routes.firstaid import list_firstaid_topics, get_firstaid_topic
from app.routes.chat import chat
from app.routes.assessments import get_assessment_history, get_assessment, delete_assessment, submit_feedback
from app.routes.emergency import list_emergency_contacts
from app.routes.wellness import get_today_tip, list_tips
from app.schemas.symptom import SymptomAssessmentRequest
from app.schemas.chat import ChatRequest, ChatHistoryItem
from app.schemas.assessment_record import FeedbackCreateRequest


def run_tests():
    print("Initializing Database...")
    init_db()
    print("Database initialized.\n")

    print("=== 1. Health & Root Endpoints ===")
    h = health_check()
    assert h["status"] == "healthy"
    assert h["database"] == "connected"
    print(f"  GET /health: OK -> status={h['status']}, db={h['database']}, ai={h['ai_provider']}")

    r = root()
    assert r["status"] == "running"
    print("  GET /: OK ->", r)

    print("\n=== 2. Symptoms Endpoints ===")
    s = list_symptoms(None, None)
    assert s["count"] >= 20
    assert "Respiratory" in s["categories"]
    assert "General" in s["categories"]
    print(f"  GET /api/symptoms: OK -> {s['count']} symptoms in {len(s['categories'])} categories")

    # Filter by category
    s_resp = list_symptoms("Respiratory", None)
    assert len(s_resp["symptoms"]) >= 3
    print(f"  GET /api/symptoms?category=Respiratory: OK -> {len(s_resp['symptoms'])} items")

    # Search query
    s_fever = list_symptoms(None, "fever")
    assert len(s_fever["symptoms"]) >= 1
    print(f"  GET /api/symptoms?q=fever: OK -> found '{s_fever['symptoms'][0]['name']}'")

    # Single symptom detail
    sym_detail = get_symptom("fever")
    assert sym_detail["name"] == "Fever"
    print(f"  GET /api/symptoms/fever: OK -> \"{sym_detail['name']}\" ({sym_detail['category']})")

    # Mild assessment with automatic DB persistence
    req_mild = SymptomAssessmentRequest(
        symptoms=["fever", "cough", "runny_nose"],
        duration="1–3 days",
        severity="mild"
    )
    res_mild = assess_symptoms(req_mild)
    assert res_mild["risk_level"] in ["low", "moderate"]
    assert len(res_mild["guidance"]) > 0
    assert res_mild.get("id") is not None
    saved_assessment_id = res_mild["id"]
    print(f"  POST /api/symptoms/assess (mild viral): OK -> risk={res_mild['risk_level']}, id={saved_assessment_id}")

    # Red flag assessment
    req_severe = SymptomAssessmentRequest(
        symptoms=["chest pain", "shortness_of_breath"],
        duration="Less than 1 day",
        severity="severe"
    )
    res_severe = assess_symptoms(req_severe)
    assert res_severe["risk_level"] == "high"
    assert len(res_severe["red_flags"]) >= 1
    print(f"  POST /api/symptoms/assess (severe red-flag): OK -> risk={res_severe['risk_level']}, red flags={len(res_severe['red_flags'])}")

    print("\n=== 3. Assessment History & Database Persistence ===")
    history = get_assessment_history(limit=10, offset=0)
    assert history["count"] >= 1
    print(f"  GET /api/assessments/history: OK -> {history['count']} stored assessments retrieved")

    # Retrieve specific assessment
    retrieved = get_assessment(saved_assessment_id)
    assert retrieved["id"] == saved_assessment_id
    assert "fever" in retrieved["symptoms"]
    print(f"  GET /api/assessments/{saved_assessment_id}: OK -> verified persisted record")

    # Submit feedback
    fb = submit_feedback(FeedbackCreateRequest(
        target_type="assessment",
        target_id=saved_assessment_id,
        rating=5,
        comment="Clear and structured self-care guidance."
    ))
    assert fb["rating"] == 5
    print(f"  POST /api/assessments/feedback: OK -> feedback id={fb['id']}")

    # Check stats
    stats = get_backend_stats()
    assert stats["total_assessments"] >= 1
    print(f"  GET /api/assessments/stats: OK -> total={stats['total_assessments']}, avg_rating={stats['average_feedback_rating']}")

    print("\n=== 4. First Aid Endpoints ===")
    fa = list_firstaid_topics(None, None)
    assert fa["count"] >= 10
    print(f"  GET /api/firstaid: OK -> {fa['count']} total guides")

    # Category filter
    fa_emerg = list_firstaid_topics("Emergency Response", None)
    assert fa_emerg["count"] >= 3
    print(f"  GET /api/firstaid (Emergency Response): OK -> {fa_emerg['count']} emergency guides")

    # Topic details
    for topic_id in ["choking", "cpr", "minor-burns", "cuts", "heatstroke", "allergic-reaction"]:
        topic_res = get_firstaid_topic(topic_id)
        topic = topic_res["topic"]
        assert len(topic["steps"]) >= 4
        print(f"  GET /api/firstaid/{topic_id}: OK -> \"{topic['title']}\" ({len(topic['steps'])} steps)")

    print("\n=== 5. Emergency Contacts & Preventive Wellness ===")
    emerg = list_emergency_contacts()
    assert len(emerg["contacts"]) >= 5
    print(f"  GET /api/emergency/contacts: OK -> {len(emerg['contacts'])} international regions supported")

    daily = get_today_tip()
    assert "title" in daily and "actionable_points" in daily
    print(f"  GET /api/wellness/daily-tip: OK -> \"{daily['title']}\" ({daily['category']})")

    all_tips = list_tips()
    assert len(all_tips["tips"]) >= 5
    print(f"  GET /api/wellness/tips: OK -> {len(all_tips['tips'])} tips across {len(all_tips['categories'])} categories")

    print("\n=== 6. AI Health Assistant Chatbot ===")
    c1 = chat(ChatRequest(message="What are healthy habits for staying hydrated?"))
    assert c1["risk_level"] == "low"
    assert len(c1["reply"]) > 80
    assert len(c1["suggested_prompts"]) >= 2
    print(f"  POST /api/chat (hydration): OK -> category={c1['category']}, suggested_prompts={len(c1['suggested_prompts'])}")

    c2 = chat(ChatRequest(message="I have crushing chest pain and left arm numbness!"))
    assert c2["risk_level"] == "emergency"
    assert "911" in c2["reply"] or "EMERGENCY" in c2["reply"]
    print(f"  POST /api/chat (emergency chest pain): OK -> risk={c2['risk_level']}")

    c3 = chat(ChatRequest(message="How do I perform hands-only CPR on someone?"))
    assert c3["risk_level"] == "emergency"
    assert "CPR" in c3["reply"]
    print(f"  POST /api/chat (CPR): OK -> risk={c3['risk_level']}")

    c4 = chat(ChatRequest(
        message="What about infants or children?",
        history=[
            ChatHistoryItem(role="user", content="What should I do for a fever?"),
            ChatHistoryItem(role="assistant", content="A fever is the body immune response...")
        ]
    ))
    assert len(c4["reply"]) > 50
    print(f"  POST /api/chat (multi-turn history): OK -> category={c4['category']}")

    # Clean up test assessment
    del_res = delete_assessment(saved_assessment_id)
    assert del_res["ok"] is True
    print(f"  DELETE /api/assessments/{saved_assessment_id}: OK -> cleaned up test record")

    print("\n" + "="*50)
    print("🎉 ALL 18 COMPREHENSIVE BACKEND TESTS PASSED SUCCESSFULLY!")
    print("="*50)


if __name__ == "__main__":
    run_tests()
