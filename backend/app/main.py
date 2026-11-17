import os
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

from app.db.database import init_db
from app.routes import health as health_router
from app.routes import symptoms as symptoms_router
from app.routes import firstaid as firstaid_router
from app.routes import chat as chat_router
from app.routes import assessments as assessments_router
from app.routes import emergency as emergency_router
from app.routes import wellness as wellness_router

APP_NAME = os.getenv("APP_NAME", "Smart Aid API")
API_VERSION = os.getenv("API_VERSION", "1.0.0")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure SQLite database and tables are created
    try:
        init_db()
        print("[SmartAid API] SQLite database initialized successfully.")
    except Exception as e:
        print(f"[SmartAid API] Database initialization warning: {e}")
    yield
    # Shutdown
    print("[SmartAid API] Server shutting down.")


app = FastAPI(
    title=APP_NAME,
    version=API_VERSION,
    description=(
        "Production-grade Backend API for Smart Aid — an AI-assisted health awareness, "
        "evidence-informed symptom triage, first-aid education, and preventive care platform.\n\n"
        "Features:\n"
        "- Symptom library & multi-factor health triage\n"
        "- Step-by-step first-aid protocols & emergency warnings\n"
        "- Dual-engine AI health assistant (Gemini LLM + Clinical Expert System)\n"
        "- SQLite assessment persistence & user feedback collection\n"
        "- Emergency hotlines & preventive wellness tips"
    ),
    contact={
        "name": "Smart Aid Team",
        "url": "https://github.com/kingbenny143/SmartAid",
    },
    lifespan=lifespan,
)

# CORS Configuration
_default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:3000",
]
_cors_env = os.getenv("CORS_ORIGINS")
_frontend_url = os.getenv("FRONTEND_URL")
origins = set(_default_origins)
if _cors_env:
    origins.update(o.strip() for o in _cors_env.split(",") if o.strip())
if _frontend_url:
    origins.add(_frontend_url.strip())

app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    print(f"[GlobalError] Unhandled exception on {request.method} {request.url.path}: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred. Please try again later.",
            "ok": False,
        },
    )


# Include all modular routers
app.include_router(health_router.router)
app.include_router(symptoms_router.router)
app.include_router(firstaid_router.router)
app.include_router(chat_router.router)
app.include_router(assessments_router.router)
app.include_router(emergency_router.router)
app.include_router(wellness_router.router)
