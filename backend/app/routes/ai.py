from fastapi import APIRouter, HTTPException
from app.models.schemas import CoverLetterRequest, CoverLetterResponse, RecommendationResponse
from app.services.openai_service import generate_cover_letter_service, generate_recommendations_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(request: CoverLetterRequest):
    try:
        return await generate_cover_letter_service(request.resume_text, request.job_description)
    except Exception as e:
        logger.error(f"Failed to generate cover letter: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the cover letter.")

@router.post("/recommendations", response_model=RecommendationResponse)
async def generate_recommendations(request: CoverLetterRequest):
    try:
        return await generate_recommendations_service(request.resume_text, request.job_description)
    except Exception as e:
        logger.error(f"Failed to generate recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while analyzing the job match.")
