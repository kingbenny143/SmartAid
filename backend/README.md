# Smart Aid — Backend API Documentation

A production-grade, asynchronous FastAPI backend powering the Smart Aid health awareness, symptom triage, first-aid education, and AI-assisted companion platform.

---

## Architecture Overview

```
backend/
├── app/
│   ├── main.py                  # FastAPI application entrypoint, CORS, lifespan, middleware
│   ├── data/
│   │   ├── symptoms.json        # Curated library of symptoms & clinical metadata
│   │   └── firstaid.json        # Step-by-step first-aid protocols & safety warnings
│   ├── db/
│   │   ├── database.py          # SQLite database connection & schema migrations
│   │   └── crud.py              # CRUD methods for assessments & feedback persistence
│   ├── routes/
│   │   ├── health.py            # /health, /api/health & root uptime metrics
│   │   ├── symptoms.py          # /api/symptoms (list, filter, inspect, assess)
│   │   ├── firstaid.py          # /api/firstaid (list, search, filter, details)
│   │   ├── chat.py              # /api/chat (dual-engine AI health assistant)
│   │   ├── assessments.py       # /api/assessments (history, single record, delete, feedback)
│   │   ├── emergency.py         # /api/emergency (international contact numbers)
│   │   └── wellness.py          # /api/wellness (daily tip, categorized preventive advice)
│   ├── schemas/
│   │   ├── symptom.py           # Pydantic v2 schemas for symptom assessment
│   │   ├── chat.py              # Chat request, response, and multi-turn history schemas
│   │   ├── firstaid.py          # First-aid guide models & step summaries
│   │   ├── assessment_record.py # Persistent assessment history & feedback models
│   │   ├── emergency.py         # Regional emergency hotlines models
│   │   └── wellness.py          # Preventive wellness models
│   └── services/
│       ├── assessment.py        # Clinical triage & multi-factor risk assessment engine
│       ├── chatbot.py           # Dual-mode AI: Gemini 1.5 Flash + Clinical Expert System
│       ├── emergency.py         # Regional hotlines & triage rules
│       └── wellness.py          # Rotating daily wellness intelligence
├── smartaid.db                  # Auto-generated SQLite persistence database
├── test_api.py                  # 18-suite comprehensive automated test script
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment configuration template
└── main.py                      # Standalone server starter
```

---

## Core Capabilities

1. **Evidence-Informed Symptom Triage**:
   - Analyzes reported symptoms against duration and severity.
   - Detects acute emergency red flags (e.g., chest pain radiating to arm, thunderclap headache, breathing compromise).
   - Generates tailored self-care guidance, monitoring schedules, and professional consult thresholds.

2. **Dual-Mode AI Health Assistant**:
   - **Google Gemini 1.5 Flash**: Powered by Google Generative AI when `GEMINI_API_KEY` is provided.
   - **Smart Aid Clinical Expert Engine**: Comprehensive offline rule-based clinical engine covering 25+ medical conditions, CPR protocols, thermal emergencies, and wound care when offline or without an API key.

3. **Persistent SQLite Storage**:
   - Assessments are automatically saved to `smartaid.db` with an assigned UUID.
   - Users can query past assessment history, review recommendations, or remove entries.
   - User feedback collection (1–5 stars + commentary) to measure accuracy and helpfulness.

4. **First-Aid Protocols**:
   - Detailed step-by-step guides with counter-indicators ("What NOT to do") and emergency hospital warning triggers.

5. **International Emergency Services**:
   - Pre-configured emergency numbers across the US, UK, Canada, European Union, India, and Australia, including national Poison Control hotlines.

---

## API Endpoints Reference

### 1. Health & System
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root service info and documentation links |
| `GET` | `/health` | Liveness & readiness check (database status, AI engine, uptime) |
| `GET` | `/api/health` | Alias for reverse proxies and client probes |
| `GET` | `/docs` | Interactive Swagger UI API documentation |
| `GET` | `/redoc` | OpenAPI ReDoc specification |

### 2. Symptoms & Triage
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/symptoms` | List curated symptoms (supports `?category=` and `?q=`) |
| `GET` | `/api/symptoms/{id}` | Clinical details for a specific symptom |
| `POST` | `/api/symptoms/assess` | Run multi-factor triage assessment & save result to DB |

### 3. First Aid Guides
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/firstaid` | List all first-aid guides (supports `?category=` and `?q=`) |
| `GET` | `/api/firstaid/{id}` | Detailed step-by-step protocol, warnings, and contraindications |

### 4. AI Assistant Chat
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send conversational message (supports multi-turn `history`) |

### 5. Assessments & Persistence
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assessments/history` | List recent saved assessment records |
| `GET` | `/api/assessments/{id}` | Retrieve full details of a specific assessment |
| `DELETE` | `/api/assessments/{id}` | Delete a stored assessment record |
| `POST` | `/api/assessments/feedback` | Submit 1–5 star rating and comment |
| `GET` | `/api/assessments/stats` | Aggregated metrics (total runs, risk breakdown, ratings) |

### 6. Emergency & Wellness
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/emergency/contacts` | International emergency & poison control hotlines |
| `GET` | `/api/wellness/daily-tip` | Today's rotating evidence-informed health tip |
| `GET` | `/api/wellness/tips` | Categorized preventive health recommendations |

---

## Setup & Running

### 1. Virtual Environment & Dependencies
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate on Windows:
venv\Scripts\activate

# Install requirements:
pip install -r requirements.txt
```

### 2. Configuration (`.env`)
Create `.env` from `.env.example`:
```env
APP_NAME=Smart Aid API
API_VERSION=1.0.0
PORT=8000
FRONTEND_URL=http://localhost:5173

# Optional: Set your Gemini API key to activate Gemini 1.5 Flash
# If unset, Smart Aid runs on its built-in Clinical Expert System
GEMINI_API_KEY=
```

### 3. Run the Server
```bash
# Start with Uvicorn
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API runs at `http://127.0.0.1:8000` with Swagger docs at `http://127.0.0.1:8000/docs`.

### 4. Run the Automated Test Suite
```bash
python test_api.py
```
Runs all 18 automated integration tests covering the database, health, symptoms, assessments, first aid, emergency, wellness, and AI chat endpoints.
