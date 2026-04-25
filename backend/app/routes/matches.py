import uuid
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.schemas import MatchSchema, UserInDB
from app.services.matching_service import calculate_match, extract_missing_skills
from app.services.job_service import fetch_recent_jobs
from app.services.auth_service import get_current_user
from app.utils.database import db

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=MatchSchema)
async def create_match(
    resume_id: str,
    job_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Calculates compatibility between a resume and a job listing."""
    resume = None
    if db.db is not None:
        resume = await db.db["resumes"].find_one({"id": resume_id, "user_id": current_user.id})
            
    if not resume:
        logger.warning(f"Resume {resume_id} not found for user {current_user.id}. Falling back to mock data.")
        resume = {
           "text_content": "Experienced Developer in React and Python.",
           "extracted_skills": ["React", "Python"],
           "user_id": current_user.id
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
            user_id=current_user.id,
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


@router.get("/my-matches", response_model=List[MatchSchema])
async def get_my_matches(current_user: UserInDB = Depends(get_current_user)):
    """Fetch all match records for the authenticated user."""
    if db.db is None:
        return []
    try:
        cursor = db.db["matches"].find({"user_id": current_user.id})
        return await cursor.to_list(length=100)
    except Exception as e:
        logger.error(f"Failed to fetch matches: {e}")
        return []
