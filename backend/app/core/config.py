import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from typing import List

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_PATH)

class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartHire AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # MongoDB Config
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "smarthire")
    
    # Security & AI
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "*").split(",")

    class Config:
        case_sensitive = True
        env_file = str(ENV_PATH)
        env_file_encoding = "utf-8"

settings = Settings()
