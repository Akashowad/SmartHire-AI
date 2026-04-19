import logging
from fastapi import APIRouter, HTTPException
from app.services.job_service import fetch_recent_jobs
from app.models.schemas import JobSchema
from typing import List, Optional

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=List[JobSchema])
async def get_jobs(location: Optional[str] = None, keyword: Optional[str] = None):
    """Fetches real job listings with optional filtering and error handling."""
    try:
        jobs = fetch_recent_jobs(location=location, keyword=keyword)
        if not jobs:
            logger.info("No jobs found for the specified criteria.")
        return jobs
    except Exception as e:
        logger.error(f"Failed to fetch jobs in route: {str(e)}")
        raise HTTPException(status_code=500, detail="External job data service is currently unavailable.")
