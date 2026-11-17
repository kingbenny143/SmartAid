from typing import List, Dict, Any

EMERGENCY_DISCLAIMER = (
    "Smart Aid provides emergency numbers and red-flag education for awareness only. "
    "If you or someone near you is in distress, experiencing severe chest pain, "
    "breathing failure, heavy bleeding, or loss of consciousness, dial your local "
    "emergency number immediately."
)

EMERGENCY_CONTACTS: List[Dict[str, Any]] = [
    {
        "country_code": "US",
        "country_name": "United States",
        "police": "911",
        "ambulance": "911",
        "fire": "911",
        "general_emergency": "911",
        "poison_control": "1-800-222-1222",
        "notes": "Text-to-911 is available in many areas. 988 is the Suicide & Crisis Lifeline."
    },
    {
        "country_code": "CA",
        "country_name": "Canada",
        "police": "911",
        "ambulance": "911",
        "fire": "911",
        "general_emergency": "911",
        "poison_control": "1-844-POISON-X",
        "notes": "Dial 911 for all emergencies. 988 is available for suicide crisis support."
    },
    {
        "country_code": "GB",
        "country_name": "United Kingdom",
        "police": "999",
        "ambulance": "999",
        "fire": "999",
        "general_emergency": "999",
        "poison_control": "111",
        "notes": "Dial 112 as European standard. NHS 111 provides urgent non-emergency medical advice."
    },
    {
        "country_code": "EU",
        "country_name": "European Union (Standard)",
        "police": "112",
        "ambulance": "112",
        "fire": "112",
        "general_emergency": "112",
        "poison_control": "112",
        "notes": "112 is free and operates across all EU member states from any phone."
    },
    {
        "country_code": "IN",
        "country_name": "India",
        "police": "112",
        "ambulance": "108",
        "fire": "101",
        "general_emergency": "112",
        "poison_control": "1800-116-117",
        "notes": "112 is the unified all-in-one national emergency number (ERSS). 108 is emergency medical."
    },
    {
        "country_code": "AU",
        "country_name": "Australia",
        "police": "000",
        "ambulance": "000",
        "fire": "000",
        "general_emergency": "000",
        "poison_control": "13 11 26",
        "notes": "Triple Zero (000) works from all phones. 112 redirects on digital mobile phones."
    }
]


def get_emergency_contacts() -> List[Dict[str, Any]]:
    return EMERGENCY_CONTACTS
