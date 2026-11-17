# Smart Aid 🩺

AI-assisted health awareness and preventive-support platform designed for everyday wellness and educational first aid.

## ⚠️ Health Disclaimer

Smart Aid is **NOT** a medical diagnosis system. It provides:
- AI-assisted health awareness and triage guidance
- Informational symptom assessment with safety red-flag detection
- Step-by-step first-aid educational protocols
- Preventive wellness habits (hydration, nutrition, sleep, cardiovascular support)
- General health guidance and emergency response information

This prototype does **not** replace a qualified healthcare professional. Always seek professional care when appropriate. In medical emergencies, call your local emergency number (such as **911** or **112**) immediately.

---

## 🚀 Key Features

1. **AI Health Assistant (`/assistant`)**
   - Built-in multi-turn contextual AI engine with triage categorization.
   - Immediate emergency red-flag identification (e.g. cardiac signs, stroke F.A.S.T., anaphylaxis, airway choking, hands-only CPR).
   - Pluggable Google Gemini LLM API integration via `GEMINI_API_KEY` with graceful fallback to our offline expert model.
   - Copy-to-clipboard, markdown formatting (headings, bold, lists), and contextual suggested prompts.

2. **Interactive Symptom Checker (`/symptom-checker`)**
   - Comprehensive library of 20+ common symptoms organized into categories (General, Respiratory, Digestive, Musculoskeletal, ENT, Dermatological).
   - Real-time search and category filtering chips.
   - Configurable onset duration and perceived severity with responsive radio selectors.
   - Multi-factor risk scoring (`low`, `moderate`, `high`), possible categories, tailored guidance, safety red flags, and next steps.

3. **Step-by-Step First Aid Guides (`/first-aid`)**
   - 12 comprehensive clinical education guides (CPR, Choking, Minor Burns, Cuts & Scrapes, Sprains, Nosebleeds, Heatstroke, Allergic Reaction/Anaphylaxis, Eye Injuries, Fainting, Minor Wound Care, Poisoning).
   - Searchable and filterable by category (Emergency Response, Everyday Wounds, Thermal & Environmental, Musculoskeletal, General).
   - Responsive detailed modal with step badges, critical warning notices, and emergency guidance.

4. **100% Fully Responsive Design**
   - Handcrafted responsive layout optimized across mobile (320px–480px), tablet (768px–1024px), and desktop.
   - Sticky blur navbar with mobile hamburger menu and quick action links.
   - High-contrast accessible color scheme with clear triage badges.

---

## 🛠️ Architecture

- **Frontend**: React 19 + Vite 8 + Tailwind CSS + React Router 7
- **Backend**: FastAPI + Uvicorn + Pydantic v2 + Python-dotenv
- **AI Engine**: Hybrid Dual-Layer AI Engine (Google Gemini 1.5 Flash API + Built-in Clinical Knowledge Inference Model)
- **Data Layer**: Clean modular JSON schemas (`symptoms.json`, `firstaid.json`)

---

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd backend
# Activate virtual environment
.\venv\Scripts\activate      # Windows (PowerShell: .\venv\Scripts\Activate.ps1)

# Install dependencies
pip install -r requirements.txt

# Run backend server
uvicorn app.main:app --reload --port 8000
```
Runs at: **http://127.0.0.1:8000**
Interactive API Docs (Swagger): **http://127.0.0.1:8000/docs**

#### Optional: Enable Google Gemini LLM
Add your Gemini API key in `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If omitted, Smart Aid automatically runs on its built-in expert clinical inference engine without any external dependencies!)*

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Runs at: **http://localhost:5173**

### 3. Run Backend Verification Tests
```bash
# From repository root:
$env:PYTHONPATH="backend"; .\backend\venv\Scripts\python.exe backend\test_api.py
```

---

## 📁 Repository Structure

```
SmartAid/
├── backend/
│   ├── app/
│   │   ├── data/
│   │   │   ├── firstaid.json       # 12 detailed first-aid educational topics
│   │   │   └── symptoms.json       # 21 curated common symptoms with categories
│   │   ├── routes/
│   │   │   ├── chat.py             # POST /api/chat
│   │   │   ├── firstaid.py         # GET /api/firstaid & GET /api/firstaid/{id}
│   │   │   ├── health.py           # GET /health & GET /
│   │   │   └── symptoms.py         # GET /api/symptoms & POST /api/symptoms/assess
│   │   ├── schemas/
│   │   │   ├── chat.py             # ChatRequest & ChatResponse schemas
│   │   │   └── symptom.py          # Symptom assessment & list schemas
│   │   ├── services/
│   │   │   ├── assessment.py       # Clinical triage algorithm & red-flag detection
│   │   │   └── chatbot.py          # Hybrid AI engine (Gemini API + Expert System)
│   │   └── main.py                 # FastAPI application definition & CORS
│   ├── .env                        # Environment variables
│   ├── requirements.txt            # Python dependencies
│   └── test_api.py                 # Automated backend test suite
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI components (Navbar, Footer, Cards, ChatMessage)
│   │   ├── pages/                  # Home, SymptomChecker, AssessmentResult, FirstAid, Assistant
│   │   ├── services/
│   │   │   └── api.js              # REST client with dynamic fallback handling
│   │   ├── App.jsx                 # App routing definition
│   │   └── index.css               # Design system & responsive styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```
