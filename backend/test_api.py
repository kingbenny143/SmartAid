from app.routes.health import health_check, root
from app.routes.symptoms import list_symptoms, assess_symptoms
from app.routes.firstaid import list_firstaid_topics, get_firstaid_topic
from app.routes.chat import chat
from app.schemas.symptom import SymptomAssessmentRequest
from app.schemas.chat import ChatRequest, ChatHistoryItem

def run_tests():
    print("=== 1. Health & Root Endpoints ===")
    h = health_check()
    assert h["status"] == "healthy"
    print("  /health: OK ->", h)

    r = root()
    assert r["status"] == "running"
    print("  /: OK ->", r)

    print("=== 2. Symptoms Endpoints ===")
    s = list_symptoms()
    assert s["count"] >= 20
    assert "Respiratory" in s["categories"]
    assert "General" in s["categories"]
    print(f"  GET /api/symptoms: OK -> {s['count']} symptoms in {len(s['categories'])} categories")

    # Mild viral symptoms
    req_mild = SymptomAssessmentRequest(
        symptoms=["fever", "cough", "runny_nose"],
        duration="1–3 days",
        severity="mild"
    )
    res_mild = assess_symptoms(req_mild)
    assert res_mild["risk_level"] in ["low", "moderate"]
    assert len(res_mild["guidance"]) > 0
    print(f"  POST /api/symptoms/assess (mild viral): OK -> risk={res_mild['risk_level']}, categories={res_mild['possible_categories']}")

    # Red flag symptoms
    req_severe = SymptomAssessmentRequest(
        symptoms=["chest pain", "shortness_of_breath"],
        duration="Less than 1 day",
        severity="severe"
    )
    res_severe = assess_symptoms(req_severe)
    assert res_severe["risk_level"] == "high"
    assert len(res_severe["red_flags"]) >= 1
    print(f"  POST /api/symptoms/assess (severe red-flag): OK -> risk={res_severe['risk_level']}, red flags={len(res_severe['red_flags'])}")

    print("=== 3. First Aid Endpoints ===")
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

    print("=== 4. AI Health Assistant Chatbot ===")
    # Hydration query
    c1 = chat(ChatRequest(message="What are healthy habits for staying hydrated?"))
    assert c1["risk_level"] == "low"
    assert len(c1["reply"]) > 100
    assert len(c1["suggested_prompts"]) >= 2
    print(f"  POST /api/chat (hydration): OK -> category={c1['category']}, suggested_prompts={len(c1['suggested_prompts'])}")

    # Emergency query
    c2 = chat(ChatRequest(message="I have crushing chest pain and left arm numbness!"))
    assert c2["risk_level"] == "emergency"
    assert "911" in c2["reply"] or "EMERGENCY" in c2["reply"]
    print(f"  POST /api/chat (emergency chest pain): OK -> risk={c2['risk_level']}")

    # CPR instruction
    c3 = chat(ChatRequest(message="How do I perform hands-only CPR on someone?"))
    assert c3["risk_level"] == "emergency"
    assert "CPR" in c3["reply"]
    print(f"  POST /api/chat (CPR): OK -> risk={c3['risk_level']}")

    # Multi-turn conversational memory
    c4 = chat(ChatRequest(
        message="What about infants or children?",
        history=[
            ChatHistoryItem(role="user", content="What should I do for a fever?"),
            ChatHistoryItem(role="assistant", content="A fever is the body immune response...")
        ]
    ))
    assert len(c4["reply"]) > 50
    print(f"  POST /api/chat (multi-turn history): OK -> category={c4['category']}")

    print("\n🎉 ALL 12 BACKEND AND AI MODEL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
