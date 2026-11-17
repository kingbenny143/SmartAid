from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

load_dotenv()

from app.routes import health as health_router
from app.routes import symptoms as symptoms_router
from app.routes import firstaid as firstaid_router
from app.routes import chat as chat_router

APP_NAME = os.getenv("APP_NAME", "Smart Aid API")
API_VERSION = os.getenv("API_VERSION", "1.0.0")

app = FastAPI(
    title=APP_NAME,
    version=API_VERSION,
    description=(
        "Backend API for Smart Aid — an AI-assisted health awareness and "
        "preventive-support prototype. All content is for informational and "
        "educational purposes only and does not replace a qualified healthcare "
        "professional."
    ),
    contact={
        "name": "Smart Aid Team",
    },
)

_default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
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
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred. Please try again later.",
            "ok": False,
        },
    )


@app.get("/openapi.json", include_in_schema=False)
async def get_openapi_endpoint():
    return app.openapi()


app.include_router(health_router.router)
app.include_router(symptoms_router.router)
app.include_router(firstaid_router.router)
app.include_router(chat_router.router)
