from fastapi import APIRouter, HTTPException
from app.services.job_fetcher import fetch_recent_jobs
from app.models.schemas import JobSchema
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[JobSchema])
async def get_jobs(location: Optional[str] = None, keyword: Optional[str] = None):
    try:
        jobs = fetch_recent_jobs(location=location, keyword=keyword)
        return jobs
    except Exception as e:
        logger.error(f"Failed to fetch jobs: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch job data from external source.")
