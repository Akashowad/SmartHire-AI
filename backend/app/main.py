import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.utils.database import connect_to_mongo, close_mongo_connection
from app.routes import api_router

# Configure Structured Application Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise-grade API for AI-powered recruitment, candidate matching, resume parsing, and automated application processing. Built on FastAPI with MongoDB, OpenAI GPT, and SBERT semantic matching."
)

# CORS Configuration
allowed_origins = settings.CORS_ORIGINS if settings.CORS_ORIGINS != ["*"] else [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    logger.info(f"Starting {settings.PROJECT_NAME}...")
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info(f"Shutting down {settings.PROJECT_NAME}...")
    await close_mongo_connection()

# Include Centralized API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health"])
async def read_root():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION
    }
