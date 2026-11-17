import json
import os
import re
import urllib.request
import urllib.error
from typing import Dict, List, Optional, Any
from app.schemas.chat import ChatHistoryItem

DISCLAIMER = (
    "Smart Aid provides informational health guidance and first-aid education only. "
    "It does NOT provide medical diagnosis, treatment, or prescription. For any "
    "medical concern, consult a qualified healthcare professional. In emergencies, "
    "call your local emergency number (such as 911 or 112) immediately."
)

SYSTEM_PROMPT = """You are Smart Aid AI, a compassionate, informative, and evidence-based health awareness and first-aid education assistant.
Guidelines:
1. Emphasize that you provide informational guidance, not clinical diagnoses or prescriptions.
2. If the user presents emergency red flags (e.g., severe chest pain, shortness of breath, sudden numbness or slurred speech, heavy uncontrolled bleeding, anaphylaxis), advise calling local emergency services immediately (911 / 112) and give immediate first-aid instructions.
3. Structure responses clearly with paragraphs, bullet points, and practical steps.
4. Conclude with when to seek professional care.
Keep your response concise, clear, and reassuring."""


class SmartAidExpertAI:
    """Intelligent standalone medical awareness expert engine.

    Provides comprehensive, structured, evidence-informed responses for symptoms,
    first aid, preventive care, and wellness inquiries even when offline.
    """

    EMERGENCIES = [
        (
            ["cpr", "hands-only cpr", "cardiac arrest", "unresponsive not breathing", "chest compression"],
            "emergency",
            "Emergency: Hands-Only CPR Instructions",
            (
                "🚨 **EMERGENCY: HANDS-ONLY CPR (UNRESPONSIVE PERSON)**\n\n"
                "If someone is collapsed, unresponsive, and not breathing or only gasping, take immediate action:\n\n"
                "1. **Call 911 / 112:** Shout to a bystander: 'Call emergency services and bring an AED!'. Put phone on speaker.\n"
                "2. **Positioning:** Lay the person flat on their back on a firm, flat surface. Kneel beside their chest.\n"
                "3. **Hand Placement:** Place the heel of one hand in the center of the chest (lower half of sternum). Place your other hand on top and interlock fingers.\n"
                "4. **Push Hard & Fast:** Lock elbows straight. Push down at least 2 inches (5 cm) at a rate of 100–120 beats per minute (to the beat of 'Stayin' Alive').\n"
                "5. **Allow Full Recoil:** Let the chest come completely back up between each compression. Do not lean on their chest.\n"
                "6. **AED:** As soon as an automated external defibrillator arrives, turn it on and follow the spoken prompts immediately.\n\n"
                "Keep doing compressions until paramedics take over or the person shows obvious signs of life (breathing, moving)."
            ),
            [
                "What is the compression depth for children in CPR?",
                "How does an AED work?",
                "What is the difference between a heart attack and cardiac arrest?",
            ],
        ),
        (
            ["chest pain", "heart attack", "crushing chest", "left arm pain"],
            "emergency",
            "Emergency: Suspected Cardiac Event",
            (
                "🚨 **IMMEDIATE ACTION REQUIRED: CALL 911 OR YOUR LOCAL EMERGENCY NUMBER AT ONCE.**\n\n"
                "Chest pain, pressure, fullness, or pain radiating to the left arm, neck, jaw, or back may indicate an acute myocardial infarction (heart attack).\n\n"
                "**While waiting for paramedics:**\n"
                "- Have the person sit down, rest comfortably, and remain calm.\n"
                "- Loosen tight clothing around the neck and waist.\n"
                "- If the person is not allergic to aspirin and has no bleeding disorder, an emergency operator may advise chewing an adult uncoated aspirin (325 mg).\n"
                "- If the person collapses or loses consciousness, verify breathing and begin **Hands-Only CPR** immediately (100–120 compressions/min in center of chest).\n"
                "- Do NOT drive yourself to the hospital; wait for ambulance personnel equipped with cardiac monitors."
            ),
            [
                "How do I perform hands-only CPR?",
                "What are atypical heart attack symptoms in women?",
                "When should someone take aspirin during chest pain?",
            ],
        ),
        (
            ["stroke", "face droop", "slurred speech", "arm weakness", "fast sign"],
            "emergency",
            "Emergency: Suspected Stroke (FAST)",
            (
                "🚨 **IMMEDIATE ACTION REQUIRED: CALL EMERGENCY SERVICES IMMEDIATELY.**\n\n"
                "Stroke is a time-critical medical emergency. Every minute counts for brain tissue survival. Use the **F.A.S.T.** check:\n\n"
                "- **F - Face Drooping:** Ask them to smile. Does one side of the face droop or feel numb?\n"
                "- **A - Arm Weakness:** Ask them to raise both arms. Does one arm drift downward?\n"
                "- **S - Speech Difficulty:** Ask them to repeat a simple sentence. Is speech slurred or strange?\n"
                "- **T - Time to call 911 / 112:** Note the exact time symptoms first began and report it to emergency medical staff.\n\n"
                "**What NOT to do:** Do NOT give them food, water, or medication (including aspirin, which can be fatal if the stroke is hemorrhagic)."
            ),
            [
                "What causes a stroke?",
                "What is a transient ischemic attack (TIA)?",
                "What are stroke recovery steps?",
            ],
        ),
        (
            ["choking", "can't breathe food", "object in throat", "heimlich"],
            "emergency",
            "Emergency: Airway Obstruction / Choking",
            (
                "🚨 **IMMEDIATE ACTION: CHOKING FIRST AID**\n\n"
                "If someone is clutching their throat, cannot speak, cough, or breathe, act immediately:\n\n"
                "1. **Call 911 / 112** or shout for a bystander to call while you assist.\n"
                "2. **5 Back Blows:** Stand behind them and slightly to the side. Support their chest with one hand and lean them forward. Deliver 5 sharp blows between the shoulder blades with the heel of your hand.\n"
                "3. **5 Abdominal Thrusts (Heimlich):** Stand behind, wrap arms around waist. Place a fist thumb-side in just above the navel. Grasp with other hand and pull sharply inward and upward.\n"
                "4. Alternate cycles of 5 back blows and 5 abdominal thrusts until the airway is clear.\n"
                "5. If they lose consciousness, lower them gently to the floor and initiate CPR."
            ),
            [
                "How do I help a choking infant?",
                "What should I do if I am choking alone?",
                "What are hands-only CPR steps?",
            ],
        ),
        (
            ["anaphylaxis", "severe allergy", "throat swelling", "epipen"],
            "emergency",
            "Emergency: Severe Allergic Reaction (Anaphylaxis)",
            (
                "🚨 **CRITICAL MEDICAL EMERGENCY: ANAPHYLAXIS**\n\n"
                "Anaphylaxis is a severe, life-threatening allergic reaction affecting breathing and blood circulation.\n\n"
                "**Immediate Steps:**\n"
                "1. **Use Epinephrine (EpiPen / Auvi-Q):** Inject firmly into the outer mid-thigh. Hold in place for 3–5 seconds, then massage gently.\n"
                "2. **Call 911 / 112 immediately.** State that anaphylaxis is suspected.\n"
                "3. **Positioning:** Keep the person lying flat with legs elevated unless breathing is difficult (then seated upright). Do NOT allow them to stand or walk.\n"
                "4. If symptoms do not improve within 5–15 minutes and help hasn't arrived, administer a second epinephrine dose if available."
            ),
            [
                "How does an EpiPen work?",
                "What are common anaphylaxis triggers?",
                "How do I recognize early allergy signs?",
            ],
        ),
    ]

    TOPIC_KNOWLEDGE: List[Dict[str, Any]] = [
        {
            "category": "fever",
            "keywords": ["fever", "high temperature", "chills", "febrile", "hot forehead", "sweats"],
            "title": "Fever Awareness & Supportive Care",
            "content": (
                "A fever (typically 100.4°F / 38°C or higher) is the body's natural immunological response to fighting off viral or bacterial infections.\n\n"
                "**Practical Comfort & Self-Care Steps:**\n"
                "- **Hydration:** Sip water, clear broths, or oral rehydration solutions frequently to prevent dehydration caused by sweating.\n"
                "- **Rest:** Give your body downtime in a cool, well-ventilated room with lightweight clothing and light blankets.\n"
                "- **Cool Compresses:** Place a lukewarm, damp washcloth on the forehead or back of the neck for comfort.\n"
                "- **OTC Comfort:** Over-the-counter fever reducers (acetaminophen or ibuprofen) can alleviate discomfort if medically appropriate for you. Never give aspirin to children or teenagers due to the risk of Reye's syndrome.\n\n"
                "**When to Seek Immediate Medical Care:**\n"
                "- Fever in infants under 3 months (any fever > 100.4°F requires urgent pediatric care).\n"
                "- Fever exceeding 103°F (39.4°C) in adults that does not respond to medication.\n"
                "- Fever accompanied by a stiff neck, confusion, difficulty breathing, rash, or seizures."
            ),
            "prompts": [
                "What temperature is considered dangerous for children?",
                "How do I safely manage fever at home?",
                "When does a fever require antibiotics?",
            ],
            "risk": "low",
        },
        {
            "category": "headache",
            "keywords": ["headache", "migraine", "head pain", "temple pain", "throbbing head", "tension headache"],
            "title": "Headache Types & Relief Strategies",
            "content": (
                "Most occasional headaches are tension headaches or mild migraines, often triggered by stress, dehydration, lack of sleep, eye strain, or missed meals.\n\n"
                "**Evidence-Based Self-Care:**\n"
                "- **Hydrate Immediately:** Drink 1–2 tall glasses of water, as mild dehydration is one of the most common headache triggers.\n"
                "- **Quiet & Darkness:** Rest in a quiet, dimly lit room with your eyes closed for 20–30 minutes.\n"
                "- **Temperature Therapy:** Place a cold pack on your forehead for throbbing migraine pain, or a warm heating pad on your neck/shoulders for tension headaches.\n"
                "- **Gentle Stretching:** Slowly stretch your neck, rolling your head gently side to side to relieve trapezius tension.\n\n"
                "**Red Flag Warning Signs:**\n"
                "- Sudden, excruciating 'thunderclap' headache reaching maximum intensity in seconds.\n"
                "- Headache following head trauma, or paired with high fever, stiff neck, vision loss, numbness, or slurred speech."
            ),
            "prompts": [
                "What is the difference between a migraine and a tension headache?",
                "Can eye strain from screens cause chronic headaches?",
                "What natural remedies help reduce headache frequency?",
            ],
            "risk": "low",
        },
        {
            "category": "cough_respiratory",
            "keywords": ["cough", "sore throat", "runny nose", "congestion", "cold", "flu", "mucus", "phlegm", "bronchitis"],
            "title": "Respiratory & Cold Support",
            "content": (
                "Upper respiratory symptoms like cough, sore throat, and nasal congestion are usually caused by common viral infections (such as rhinovirus or influenza).\n\n"
                "**Supportive Measures:**\n"
                "- **Warm Fluids:** Warm herbal tea with honey and lemon coats and soothes inflamed throat tissue (note: do not give honey to infants under 1 year old).\n"
                "- **Steam & Moisture:** Use a cool-mist humidifier in your room or inhale steam from a warm shower to loosen airways.\n"
                "- **Saline Rinses:** Use sterile saline nasal sprays or sinus rinses to flush out irritants and excess mucus.\n"
                "- **Saltwater Gargle:** Gargle with 1/2 teaspoon of salt in warm water 3–4 times daily to relieve throat soreness.\n\n"
                "**When to See a Doctor:**\n"
                "- Shortness of breath, wheezing, or painful breathing.\n"
                "- Cough lasting longer than 3 weeks, or coughing up blood/thick rust-colored mucus.\n"
                "- Severe inability to swallow saliva or open your mouth."
            ),
            "prompts": [
                "How do I know if a sore throat is strep or viral?",
                "What is the best way to soothe a dry nocturnal cough?",
                "How long does the average common cold last?",
            ],
            "risk": "low",
        },
        {
            "category": "digestive",
            "keywords": ["stomach", "nausea", "vomit", "diarrhea", "cramps", "food poison", "gut", "belly ache", "indigestion"],
            "title": "Digestive & Gastrointestinal Care",
            "content": (
                "Digestive upset, including mild nausea, vomiting, or diarrhea, is frequently related to gastroenteritis ('stomach flu'), dietary irritation, or foodborne bugs.\n\n"
                "**Crucial Supportive Care:**\n"
                "- **Prevent Dehydration (Priority #1):** Take small, frequent sips of electrolyte solutions (ORS), diluted coconut water, or broth. Avoid large gulps which trigger vomiting.\n"
                "- **Gut Rest:** Allow your stomach to rest for a couple hours after vomiting before attempting fluids.\n"
                "- **BRAT Diet:** When hunger returns, transition slowly to bland, easily digestible foods: Bananas, Rice, Applesauce, and Toast.\n"
                "- **Avoid Triggers:** Steer clear of greasy, fried, spicy foods, caffeine, alcohol, and dairy products until fully recovered.\n\n"
                "**Red Flag Signs Requiring Medical Evaluation:**\n"
                "- Inability to keep any liquids down for over 24 hours.\n"
                "- Blood in vomit or black/bloody stools.\n"
                "- Severe, sharp, localized abdominal pain (especially in the lower right abdomen, which may signal appendicitis).\n"
                "- High fever or severe dizziness upon standing."
            ),
            "prompts": [
                "How do I make a homemade oral rehydration solution (ORS)?",
                "What are warning signs of dehydration in adults and children?",
                "When should I suspect food poisoning versus a stomach bug?",
            ],
            "risk": "low",
        },
        {
            "category": "first_aid",
            "keywords": ["first aid", "burn", "cut", "wound", "sprain", "bleed", "nosebleed", "bandage", "ice pack"],
            "title": "Essential First-Aid Knowledge",
            "content": (
                "Having core first-aid awareness empowers you to act quickly, calmly, and effectively in everyday accidents.\n\n"
                "**Key First-Aid Protocols in Smart Aid:**\n"
                "- **Minor Cuts:** Wash hands, apply direct pressure with clean gauze, rinse under tap water, apply thin petroleum jelly, and bandage.\n"
                "- **Minor Burns:** Cool immediately under cool running tap water for 10–20 minutes. Never use ice or butter. Cover loosely.\n"
                "- **Sprains (R.I.C.E.):** Rest the joint, Ice for 15–20 minutes with a towel barrier, Compress with elastic wrap, and Elevate above heart level.\n"
                "- **Nosebleeds:** Lean FORWARD (not backward), firmly pinch the soft lower nose for 10–15 continuous minutes without letting go.\n\n"
                "Explore the dedicated **First Aid Guides** section in Smart Aid for detailed step-by-step instructions on each condition."
            ),
            "prompts": [
                "Show me the guide for treating minor burns",
                "What should be in an everyday home first aid kit?",
                "How do I properly treat an ankle sprain with R.I.C.E.?",
            ],
            "risk": "low",
        },
        {
            "category": "hydration",
            "keywords": ["water", "hydrat", "dehydrat", "drink", "thirst", "fluid", "electrolyt"],
            "title": "Hydration & Electrolyte Balance",
            "content": (
                "Water is essential for cellular energy, cardiovascular efficiency, kidney filtration, cognitive performance, and joint lubrication.\n\n"
                "**Healthy Hydration Guidelines:**\n"
                "- **Daily Target:** A general baseline is roughly 2 to 3 liters (8–12 cups) of fluid per day from water, herbal teas, and water-rich fruits/vegetables.\n"
                "- **Urine Color Guide:** Pale straw or light lemonade color indicates optimal hydration. Dark amber indicates you need to drink more fluids.\n"
                "- **Electrolytes:** If exercising vigorously, sweating heavily, or recovering from illness, replenish key electrolytes (sodium, potassium, magnesium) along with water.\n\n"
                "**Signs of Moderate to Severe Dehydration:**\n"
                "- Infrequent urination, dry mouth/tongue, dizziness upon standing, sunken eyes, confusion, or extreme lethargy."
            ),
            "prompts": [
                "How much water should I drink during intense workouts?",
                "What are the best electrolyte-rich foods and drinks?",
                "Can drinking too much water be dangerous?",
            ],
            "risk": "low",
        },
        {
            "category": "lifestyle_prevention",
            "keywords": ["habit", "lifestyle", "sleep", "diet", "exercise", "stress", "prevent", "nutrition", "wellness", "checkup"],
            "title": "Preventive Health & Everyday Habits",
            "content": (
                "Preventive health focuses on building consistent daily foundations that lower the long-term risk of cardiovascular disease, metabolic syndrome, and burnout.\n\n"
                "**Core Pillars of Wellness:**\n"
                "- **Sleep Hygiene:** Target 7–9 hours of consistent sleep. Keep your bedroom dark, cool, and device-free 45 minutes before bedtime.\n"
                "- **Nutritional Balance:** Emphasize whole, colorful foods—leafy greens, legumes, healthy fats (olive oil, nuts), lean proteins, and complex fiber.\n"
                "- **Daily Movement:** Aim for 150 minutes of moderate aerobic activity weekly (brisk walking, cycling) plus 2 strength sessions.\n"
                "- **Stress & Recovery:** Incorporate mindfulness, deep box breathing (4-4-4-4), or spending time in nature to regulate cortisol.\n"
                "- **Routine Screenings:** Keep up with age-appropriate blood pressure, cholesterol, glycemic, and dental checkups."
            ),
            "prompts": [
                "How can I build a sustainable sleep routine?",
                "What are evidence-backed ways to manage daily stress?",
                "What routine preventive screenings are recommended for adults?",
            ],
            "risk": "low",
        },
    ]

    def reply(self, message: str, history: Optional[List[ChatHistoryItem]] = None) -> Dict[str, Any]:
        msg_clean = (message or "").strip().lower()

        # Check for multi-turn context from history
        context_keywords = []
        if history:
            for turn in history[-4:]:
                context_keywords.extend(turn.content.lower().split())

        combined_text = msg_clean + " " + " ".join(context_keywords[:20])

        # 1. Check critical emergencies first
        for keywords, risk, title, content, prompts in self.EMERGENCIES:
            if any(k in msg_clean for k in keywords):
                return {
                    "reply": f"### {title}\n\n{content}",
                    "category": "emergency",
                    "risk_level": "emergency",
                    "suggested_prompts": prompts,
                    "disclaimer": DISCLAIMER,
                }

        # 2. Check greetings / introductions
        greetings = ["hi", "hello", "hey", "good morning", "good evening", "who are you", "what can you do", "help me"]
        if any(msg_clean == g or msg_clean.startswith(g + " ") for g in greetings):
            return {
                "reply": (
                    "### Welcome to Smart Aid Assistant 👋\n\n"
                    "I am your AI health awareness and preventive guidance companion. I can help you with:\n\n"
                    "- **Symptom Awareness:** Understanding common symptoms like fever, headaches, coughs, and digestive upset.\n"
                    "- **First-Aid Education:** Step-by-step guidance for minor burns, cuts, sprains, nosebleeds, and choking response.\n"
                    "- **Preventive Health:** Practical tips on hydration, balanced nutrition, sleep, and cardiovascular habits.\n"
                    "- **Triage Insights:** Recognizing warning signs ('red flags') that indicate when professional or emergency care is needed.\n\n"
                    "How can I assist your health awareness today?"
                ),
                "category": "health_education",
                "risk_level": "low",
                "suggested_prompts": [
                    "What should I do for a mild fever?",
                    "How do I treat a superficial burn?",
                    "Tell me about the best daily hydration habits",
                ],
                "disclaimer": DISCLAIMER,
            }

        # 3. Match curated knowledge topics
        best_match = None
        best_score = 0
        for topic in self.TOPIC_KNOWLEDGE:
            score = sum(1 for kw in topic["keywords"] if kw in msg_clean)
            # small boost if matches prior context
            score += sum(0.5 for kw in topic["keywords"] if kw in combined_text and kw not in msg_clean)
            if score > best_score:
                best_score = score
                best_match = topic

        if best_match and best_score >= 1:
            return {
                "reply": f"### {best_match['title']}\n\n{best_match['content']}",
                "category": best_match["category"],
                "risk_level": best_match.get("risk", "low"),
                "suggested_prompts": best_match["prompts"],
                "disclaimer": DISCLAIMER,
            }

        # 4. Contextual Intelligent General Answer
        # For general or complex queries, provide a structured clinical awareness answer
        return {
            "reply": (
                f"### Health Awareness Guidance\n\n"
                f"Thank you for your question regarding **\"{message.strip()}\"**.\n\n"
                "**General Evidence-Informed Observations:**\n"
                "- When managing health changes or unfamiliar symptoms, observe their **onset, duration, severity**, and any accompanying factors.\n"
                "- Supportive wellness measures usually start with gentle hydration, restful sleep in a comfortable environment, and balanced nourishment.\n"
                "- Avoid taking unnecessary prescription or self-selected medications without verifying with a qualified pharmacist or clinician.\n\n"
                "**When to Consult a Healthcare Provider:**\n"
                "- If symptoms persist beyond 3–5 days without noticeable improvement.\n"
                "- If you experience sudden, sharp, or debilitating pain.\n"
                "- If symptoms interfere with drinking fluids, sleeping, or normal breathing.\n\n"
                "You can also use the **Smart Aid Symptom Checker** to run a structured symptom review, or explore our **First Aid Guides** for step-by-step educational protocols."
            ),
            "category": "general_health",
            "risk_level": "low",
            "suggested_prompts": [
                "Take me through the Symptom Checker",
                "What are general warning signs to see a doctor?",
                "What first-aid guides are available?",
            ],
            "disclaimer": DISCLAIMER,
        }


class GeminiLLMChatProvider:
    """Gemini API provider when GEMINI_API_KEY is supplied.

    Uses Gemini 1.5 Flash via REST API with fallback to SmartAidExpertAI.
    """

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.fallback = SmartAidExpertAI()

    def reply(self, message: str, history: Optional[List[ChatHistoryItem]] = None) -> Dict[str, Any]:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"

            contents = []
            if history:
                for h in history[-6:]:
                    role = "user" if h.role == "user" else "model"
                    contents.append({
                        "role": role,
                        "parts": [{"text": h.content}]
                    })

            contents.append({
                "role": "user",
                "parts": [{"text": f"System context: {SYSTEM_PROMPT}\n\nUser Question: {message}"}]
            })

            payload = {
                "contents": contents,
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 800,
                }
            }

            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST"
            )

            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidates = data.get("candidates", [])
                if candidates:
                    text_parts = candidates[0].get("content", {}).get("parts", [])
                    reply_text = "".join(p.get("text", "") for p in text_parts)
                    if reply_text.strip():
                        # Determine category & risk level based on reply text
                        lower_reply = reply_text.lower()
                        risk = "low"
                        if "emergency" in lower_reply or "call 911" in lower_reply or "call 112" in lower_reply:
                            risk = "emergency"
                        elif "urgent" in lower_reply or "doctor immediately" in lower_reply:
                            risk = "high"
                        elif "consult a healthcare" in lower_reply or "see a doctor" in lower_reply:
                            risk = "moderate"

                        return {
                            "reply": reply_text.strip(),
                            "category": "ai_assistant",
                            "risk_level": risk,
                            "suggested_prompts": [
                                "What are key warning signs to watch for?",
                                "What safe home care measures can I take?",
                                "How do I check my symptoms in Smart Aid?",
                            ],
                            "disclaimer": DISCLAIMER,
                        }

        except Exception as e:
            # Fall back safely without breaking user experience
            print(f"[GeminiLLMProvider] Falling back to Expert AI due to: {e}")

        return self.fallback.reply(message, history)


def get_chat_provider():
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if gemini_key and gemini_key.strip():
        return GeminiLLMChatProvider(gemini_key.strip())
    return SmartAidExpertAI()
