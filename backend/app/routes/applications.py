import uuid
import logging
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import ApplicationSchema, ApplicationResponse, UserInDB
from app.services.ai_service import generate_cover_letter_service
from app.services.job_service import fetch_recent_jobs
from app.services.auth_service import get_current_user
from app.utils.database import db

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/apply", response_model=ApplicationResponse)
async def apply_to_job(
    resume_id: str,
    job_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Orchestrates the automated application process with AI tailoring."""
    resume = None
    if db.db is not None:
        resume = await db.db["resumes"].find_one({"id": resume_id, "user_id": current_user.id})
    
    if not resume:
        logger.warning(f"Resume {resume_id} not found for user {current_user.id}. Using mock data.")
        resume = {"text_content": "Experienced Developer profile.", "user_id": current_user.id}

    try:
        all_jobs = fetch_recent_jobs()
        job = next((j for j in all_jobs if str(j["id"]) == str(job_id)), None)
        
        if not job:
            raise HTTPException(status_code=404, detail="Job listing not found or expired.")

        # AI Tailoring
        logger.info(f"Generating AI application for {job['title']} at {job['company']}")
        cv_data = await generate_cover_letter_service(
            resume_text=resume["text_content"],
            job_description=job["description"]
        )

        application = ApplicationSchema(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            job_id=job_id,
            resume_id=resume_id,
            applied_at=datetime.utcnow(),
            status="Applied",
            cover_letter=cv_data.cover_letter,
            job_title=job["title"],
            company_name=job["company"]
        )

        if db.db is not None:
            await db.db["applications"].insert_one(application.model_dump())

        return ApplicationResponse(
            application=application,
            message=f"Application successfully processed for {job['company']}."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Application flow failed: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during the application process.")

@router.get("/", response_model=List[ApplicationSchema])
async def get_applications(current_user: UserInDB = Depends(get_current_user)):
    """Retrieves application history for the authenticated user."""
    if db.db is None:
        return []
    
    try:
        cursor = db.db["applications"].find({"user_id": current_user.id})
        return await cursor.to_list(length=100)
    except Exception as e:
        logger.error(f"Failed to fetch application history: {e}")
        return []
