from datetime import datetime, timezone
from typing import List, Dict, Any

WELLNESS_DISCLAIMER = (
    "Smart Aid wellness recommendations are evidence-informed lifestyle suggestions "
    "for general health awareness. They do not constitute personalized medical advice."
)

WELLNESS_TIPS: List[Dict[str, Any]] = [
    {
        "id": "hydration-balance",
        "category": "Hydration",
        "title": "Optimal Daily Fluid Balance",
        "summary": "Consistent hydration supports cognitive clarity, thermoregulation, and kidney health.",
        "actionable_points": [
            "Drink clean water steadily throughout the day rather than chugging large amounts at once.",
            "Monitor urine color: pale straw yellow indicates adequate hydration, dark amber signifies dehydration.",
            "Increase intake during hot weather, physical exertion, or when recovering from illness."
        ],
        "icon": "💧"
    },
    {
        "id": "sleep-hygiene",
        "category": "Sleep & Recovery",
        "title": "Circadian Rhythm & Sleep Hygiene",
        "summary": "7 to 9 hours of quality sleep enhances cellular repair, immune defenses, and emotional resilience.",
        "actionable_points": [
            "Maintain a consistent wake and sleep time, even on weekends, to stabilize circadian rhythm.",
            "Avoid blue light screens (phones, tablets, TVs) at least 45 minutes before bedtime.",
            "Keep your sleeping environment cool (around 65°F / 18°C), quiet, and dark."
        ],
        "icon": "🌙"
    },
    {
        "id": "ergonomics-movement",
        "category": "Musculoskeletal",
        "title": "Desk Ergonomics & Movement Snacks",
        "summary": "Combatting prolonged sedentary posture relieves spinal compression and joint stiffness.",
        "actionable_points": [
            "Follow the 20-20-20 rule: every 20 minutes look at an object 20 feet away for 20 seconds.",
            "Position computer screens at eye level with elbows bent at a 90-degree angle.",
            "Take 2-minute 'movement snacks' every hour: shoulder rolls, neck stretches, and brisk walking."
        ],
        "icon": "🧘"
    },
    {
        "id": "immune-nutrition",
        "category": "Immune Health",
        "title": "Nutrient-Dense Immune Support",
        "summary": "Whole foods provide antioxidants and micronutrients that reinforce barrier and innate immunity.",
        "actionable_points": [
            "Incorporate a rainbow of vegetables and fruits rich in Vitamin C, zinc, and bioflavonoids.",
            "Include probiotic and prebiotic foods (yogurt, kefir, oats, garlic) to maintain a healthy gut microbiome.",
            "Limit excessive refined sugar and ultra-processed foods that induce systemic low-grade inflammation."
        ],
        "icon": "🥗"
    },
    {
        "id": "stress-resilience",
        "category": "Mental Wellness",
        "title": "Active Stress Decompression",
        "summary": "Regulating the autonomic nervous system reduces cortisol and improves cardiovascular health.",
        "actionable_points": [
            "Practice box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s) when feeling overwhelmed.",
            "Spend 15–20 minutes daily in natural daylight or green spaces.",
            "Set clear boundaries between work tasks and restorative personal downtime."
        ],
        "icon": "🌿"
    }
]


def get_all_wellness_tips() -> List[Dict[str, Any]]:
    return WELLNESS_TIPS


def get_daily_tip() -> Dict[str, Any]:
    day_of_year = datetime.now(timezone.utc).timetuple().tm_yday
    tip_index = day_of_year % len(WELLNESS_TIPS)
    return WELLNESS_TIPS[tip_index]
