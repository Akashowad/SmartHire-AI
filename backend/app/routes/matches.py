import uuid
import logging
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import MatchSchema
from app.services.matching_service import calculate_match, extract_missing_skills
from app.services.job_service import fetch_recent_jobs
from app.utils.database import db

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=MatchSchema)
async def create_match(resume_id: str, job_id: str):
    """Calculates compatibility between a resume and a job listing."""
    resume = None
    if db.db is not None:
        resume = await db.db["resumes"].find_one({"id": resume_id})
            
    if not resume:
        logger.warning(f"Resume {resume_id} not found in DB. Falling back to mock data.")
        resume = {
           "text_content": "Experienced Developer in React and Python.",
           "extracted_skills": ["React", "Python"],
           "user_id": "user_mock"
        }
        
    try:
        all_jobs = fetch_recent_jobs()
        job = next((j for j in all_jobs if str(j["id"]) == str(job_id)), None)
        
        if not job:
            logger.error(f"Job {job_id} not found in live feed.")
            raise HTTPException(status_code=404, detail="Job not found. It may have expired.")

        match_percentage = calculate_match(resume["text_content"], job["description"])
        matching, missing = extract_missing_skills(resume["extracted_skills"], job["skills_required"])
        
        match_record = MatchSchema(
            id=str(uuid.uuid4()),
            user_id=resume.get("user_id", "user_1"),
            resume_id=resume_id,
            job_id=job_id,
            match_percentage=match_percentage,
            matching_skills=matching,
            missing_skills=missing
        )
        
        if db.db is not None:
            await db.db["matches"].insert_one(match_record.model_dump())
            
        return match_record
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Match calculation failed: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred during match calculation.")
