from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.schemas import ApplicationSchema, ApplicationResponse
from app.services.openai_service import generate_cover_letter_service
from app.services.job_fetcher import fetch_recent_jobs
from app.utils.database import db
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/apply", response_model=ApplicationResponse)
async def apply_to_job(resume_id: str, job_id: str):
    # 1. Fetch Resume
    resume = None
    if db.db is not None:
        try:
            resume = await db.db["resumes"].find_one({"id": resume_id})
        except Exception as e:
            logger.error(f"DB Error fetching resume: {e}")
    
    if not resume:
        # Mocking for preview if DB is down
        resume = {
           "text_content": "Experienced Developer in React and Python.",
           "user_id": "user_mock"
        }

    # 2. Fetch Job (Real data from Remotive)
    all_jobs = fetch_recent_jobs()
    job = next((j for j in all_jobs if str(j["id"]) == str(job_id)), None)
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found in current live listings.")

    # 3. Generate Tailored Cover Letter via AI
    try:
        cv_data = await generate_cover_letter_service(
            resume_text=resume["text_content"],
            job_description=job["description"]
        )
        cover_letter = cv_data.cover_letter
    except Exception as e:
        logger.error(f"AI Error generating cover letter: {e}")
        cover_letter = f"Dear Hiring Manager at {job['company']}, I am excited to apply for the {job['title']} position..."

    # 4. Create Application Record
    application = ApplicationSchema(
        id=str(uuid.uuid4()),
        user_id=resume.get("user_id", "user_1"),
        job_id=job_id,
        resume_id=resume_id,
        applied_at=datetime.utcnow(),
        status="Applied",
        cover_letter=cover_letter,
        job_title=job["title"],
        company_name=job["company"]
    )

    # 5. Save to Database
    if db.db is not None:
        try:
            await db.db["applications"].insert_one(application.model_dump())
        except Exception as e:
            logger.error(f"DB Error saving application: {e}")

    return ApplicationResponse(
        application=application,
        message=f"Successfully applied to {job['title']} at {job['company']}!"
    )

@router.get("/", response_model=List[ApplicationSchema])
async def get_applications(user_id: str = "user_1"):
    if db.db is None:
        return []
    
    try:
        cursor = db.db["applications"].find({"user_id": user_id})
        applications = await cursor.to_list(length=100)
        return applications
    except Exception as e:
        logger.error(f"DB Error fetching applications: {e}")
        return []
