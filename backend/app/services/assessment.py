from pathlib import Path
import json
from typing import List, Dict, Any, Literal
import re

DATA_PATH = Path(__file__).parent.parent / "data" / "symptoms.json"

DISCLAIMER = (
    "Smart Aid provides informational health guidance and does not provide a medical "
    "diagnosis or replace a qualified healthcare professional. Seek professional "
    "medical care when appropriate. No clinical validation is claimed."
)

RED_FLAG_KEYWORDS = [
    ("chest pain", "Chest pain or pressure requires immediate medical evaluation to rule out cardiac emergencies."),
    ("chest tightness", "Chest tightness or pressure may be a sign of a cardiac or acute respiratory condition."),
    ("difficulty breathing", "Severe difficulty breathing is a critical warning sign requiring immediate emergency care."),
    ("shortness of breath", "Shortness of breath, especially when resting or worsening rapidly, warrants prompt medical evaluation."),
    ("severe headache", "A sudden, unusually severe headache ('thunderclap') requires urgent neurological assessment."),
    ("stiff neck", "Fever paired with a stiff neck is a potential red-flag sign of meningitis and requires urgent care."),
    ("sudden numbness", "Sudden numbness or weakness on one side of the face or body is a key stroke warning sign."),
    ("sudden weakness", "Sudden unexplained loss of strength requires urgent clinical evaluation."),
    ("confusion", "Acute confusion, disorientation, or altered mental status is an emergency red flag."),
    ("seizure", "Any seizure activity or convulsion warrants immediate emergency medical care."),
    ("unconscious", "Loss of consciousness requires immediate emergency attention."),
    ("fainting", "Unexplained fainting or syncope requires professional cardiac and neurological evaluation."),
    ("blood in stool", "Gastrointestinal bleeding requires prompt healthcare investigation."),
    ("vomiting blood", "Vomiting blood or coffee-ground material is a medical emergency."),
    ("coughing blood", "Coughing up blood (hemoptysis) requires prompt clinical assessment."),
    ("high fever", "Fever exceeding 103°F (39.4°C) or not responding to medication requires professional medical advice.")
]

RISK_LITERAL = Literal["low", "moderate", "high"]


def load_symptoms_data() -> Dict[str, Any]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_all_symptoms() -> List[Dict[str, Any]]:
    data = load_symptoms_data()
    return data.get("symptoms", [])


def _parse_duration_days(duration: str) -> int:
    text = (duration or "").lower()
    m = re.search(r"(\d+)\s*day", text)
    if m:
        return int(m.group(1))
    m = re.search(r"(\d+)\s*week", text)
    if m:
        return int(m.group(1)) * 7
    m = re.search(r"(\d+)\s*hour", text)
    if m:
        return max(1, int(m.group(1)) // 24)
    m = re.search(r"(\d+)\s*month", text)
    if m:
        return int(m.group(1)) * 30
    if "less than 1 day" in text:
        return 1
    if "1–3 days" in text or "1-3 days" in text:
        return 2
    if "4–7 days" in text or "4-7 days" in text:
        return 5
    if "more than 7 days" in text:
        return 8
    if any(w in text for w in ["persistent", "chronic", "weeks", "months"]):
        return 14
    return 2


def run_assessment(symptoms: List[str], duration: str, severity: str) -> Dict[str, Any]:
    symptoms_list = get_all_symptoms()
    symptom_map = {s["id"]: s for s in symptoms_list}
    name_map = {s["name"].lower(): s for s in symptoms_list}

    # Normalize symptoms input
    matched_ids = []
    matched_names = []
    for raw in symptoms:
        cleaned = str(raw).strip().lower()
        if not cleaned:
            continue
        if cleaned in symptom_map:
            matched_ids.append(cleaned)
            matched_names.append(symptom_map[cleaned]["name"])
        elif cleaned in name_map:
            matched_ids.append(name_map[cleaned]["id"])
            matched_names.append(name_map[cleaned]["name"])
        else:
            # Fuzzy match
            found = False
            for sid, sdef in symptom_map.items():
                if sid in cleaned or sdef["name"].lower() in cleaned:
                    matched_ids.append(sid)
                    matched_names.append(sdef["name"])
                    found = True
                    break
            if not found:
                matched_ids.append(cleaned)
                matched_names.append(raw)

    symptom_set = set(matched_ids)
    all_text = " ".join(matched_names).lower() + " " + " ".join(matched_ids).lower()
    duration_days = _parse_duration_days(duration)

    # 1. Red Flag Detection
    red_flags: List[str] = []
    is_high_risk = False

    for phrase, warning in RED_FLAG_KEYWORDS:
        if phrase in all_text or any(phrase in sid for sid in symptom_set):
            red_flags.append(warning)
            is_high_risk = True

    # Critical combinations
    if ("fever" in symptom_set or "chills" in symptom_set) and ("stiff neck" in all_text or "headache" in symptom_set and severity == "severe"):
        red_flags.append("Combination of fever and severe headache or neck stiffness requires immediate medical evaluation.")
        is_high_risk = True

    if ("shortness_of_breath" in symptom_set) and ("chest" in all_text or "fever" in symptom_set):
        red_flags.append("Breathing difficulty combined with fever or chest discomfort warrants urgent clinical care.")
        is_high_risk = True

    if severity == "severe":
        red_flags.append("Overall severity reported as severe — prompt professional consultation is strongly advised.")

    if duration_days >= 14:
        red_flags.append(f"Symptoms have persisted for {duration} ({duration_days}+ days); long-standing symptoms should be evaluated by a healthcare provider.")

    # 2. Category classification
    possible_categories: List[str] = []
    respiratory_keys = {"cough", "sore_throat", "runny_nose", "congestion", "shortness_of_breath"}
    digestive_keys = {"nausea", "vomiting", "diarrhea", "stomach_pain"}
    musculoskeletal_keys = {"joint_pain", "back_pain", "body_ache"}
    ent_keys = {"earache", "loss_of_taste_smell", "runny_nose", "congestion", "sore_throat"}
    viral_keys = {"fever", "chills", "fatigue", "body_ache", "headache"}

    if symptom_set & respiratory_keys:
        possible_categories.append("Upper / Lower Respiratory Symptoms")
    if symptom_set & digestive_keys:
        possible_categories.append("Gastrointestinal / Digestive Concern")
    if symptom_set & viral_keys:
        possible_categories.append("Common Viral or Immune Response")
    if symptom_set & musculoskeletal_keys:
        possible_categories.append("Musculoskeletal Strain / Discomfort")
    if "rash" in symptom_set:
        possible_categories.append("Dermatological / Skin Reaction")
    if symptom_set & ent_keys and "Upper / Lower Respiratory Symptoms" not in possible_categories:
        possible_categories.append("Ear, Nose & Throat (ENT) Concern")
    if "headache" in symptom_set or "dizziness" in symptom_set:
        possible_categories.append("Neurological / Vestibular Concern")
    if "insomnia" in symptom_set:
        possible_categories.append("Sleep & Circadian Rhythm Disruption")

    if not possible_categories:
        possible_categories.append("General Health Concern")

    # 3. Determine Overall Risk Level
    if is_high_risk or severity == "severe" or ("shortness_of_breath" in symptom_set):
        risk_level: RISK_LITERAL = "high"
    elif severity == "moderate" or len(symptom_set) >= 3 or duration_days >= 4:
        risk_level = "moderate"
    else:
        risk_level = "low"

    # 4. Tailored Guidance
    guidance: List[str] = []

    # Hydration
    if symptom_set & (digestive_keys | {"fever", "chills"}):
        guidance.append("Prioritize oral rehydration with small, frequent sips of water, broth, or oral rehydration salt (ORS) solutions to offset fluid and electrolyte loss.")
    else:
        guidance.append("Stay well hydrated with clean water and herbal infusions throughout the day.")

    # Rest
    guidance.append("Allow your body ample rest in a comfortable, quiet, well-ventilated room to support immune function and recovery.")

    # Respiratory specific
    if symptom_set & respiratory_keys:
        guidance.append("Use steam inhalation, a cool-mist humidifier, or warm honey and lemon to soothe airways and ease nasal congestion.")

    # Digestive specific
    if symptom_set & digestive_keys:
        guidance.append("Follow a gentle, bland diet (BRAT: bananas, rice, applesauce, toast) and avoid greasy, spicy, acidic, or dairy foods until your stomach settles.")

    # Pain & fever comfort
    if symptom_set & (musculoskeletal_keys | {"fever", "headache", "body_ache"}):
        guidance.append("Warm or cold compresses can help relieve localized aches; consider safe over-the-counter comfort options only if approved by your doctor or pharmacist.")

    # General monitoring
    guidance.append("Keep a simple log of your temperature, symptoms, and intake to share with a physician if an evaluation becomes necessary.")

    # 5. Practical Next Steps
    next_steps: List[str] = []

    if risk_level == "high":
        next_steps.append("URGENT: Contact your doctor, visit an urgent care center, or call emergency medical services promptly due to reported warning signs.")
    elif risk_level == "moderate":
        next_steps.append("Schedule a visit or telehealth consult with a healthcare professional if symptoms persist beyond 3 to 5 days, or if they worsen.")
    else:
        next_steps.append("Practice self-care and continue observing your symptoms for 48 to 72 hours.")

    next_steps.append("Review relevant Smart Aid First Aid guides for safe, non-invasive supportive care techniques.")
    next_steps.append("If any new red flag signs develop (such as breathing trouble, confusion, or uncontrolled pain), seek medical help immediately.")

    return {
        "risk_level": risk_level,
        "possible_categories": possible_categories,
        "guidance": guidance,
        "red_flags": red_flags,
        "next_steps": next_steps,
        "matched_symptoms": matched_names,
        "disclaimer": DISCLAIMER,
    }
