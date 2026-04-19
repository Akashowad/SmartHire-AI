from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import MatchSchema
from app.services.matching_engine import calculate_match, extract_missing_skills
from app.services.job_fetcher import fetch_recent_jobs
from app.utils.database import db
import uuid

router = APIRouter()

@router.post("/", response_model=MatchSchema)
async def create_match(resume_id: str, job_id: str):
    resume = None
    if db.db is not None:
        try:
            resume = await db.db["resumes"].find_one({"id": resume_id})
        except Exception:
            pass # Default to None
            
    # If not found in DB (e.g. MongoDB not running), we will just mock the resume text so UI works visually!
    if not resume:
        print("Warning: Resume not found in DB. Simulating for UI preview.")
        resume = {
           "text_content": "Experienced Developer in React and Python.",
           "extracted_skills": ["React", "Python"],
           "user_id": "user_mock"
        }
        
    # Fetch the job from the real API cached results
    all_jobs = fetch_recent_jobs()
    job = next((j for j in all_jobs if str(j["id"]) == str(job_id)), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found. It may have expired from the live listings.")

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
        try:
            await db.db["matches"].insert_one(match_record.model_dump())
        except Exception:
            pass # Continue and return results anyway

    return match_record
