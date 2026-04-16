from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.utils.database import connect_to_mongo, close_mongo_connection
from app.routes import api_router
import os
import logging

# Configure Application Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="SmartHire AI API",
    description="Backend API for the SmartHire AI Job Assistant Agent",
    version="1.0.0"
)

# CORS configuration for Frontend using Environment Variables
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    logger.info("Initializing SmartHire AI application...")
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Shutting down SmartHire AI application...")
    await close_mongo_connection()

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to SmartHire AI API"}
