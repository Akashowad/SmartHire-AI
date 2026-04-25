import logging
from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    CoverLetterRequest, CoverLetterResponse, RecommendationResponse,
    AnalyzeRequest, AnalyzeResponse
)
from app.services.ai_service import (
    generate_cover_letter_service,
    generate_recommendations_service,
    analyze_candidate_service
)

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/cover-letter", response_model=CoverLetterResponse)
async def get_cover_letter(request: CoverLetterRequest):
    """Generates an AI-powered cover letter and email template."""
    try:
        return await generate_cover_letter_service(
            resume_text=request.resume_text,
            job_description=request.job_description
        )
    except Exception as e:
        logger.error(f"AI Cover Letter Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate AI content.")

@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: CoverLetterRequest):
    """Provides AI-driven insights and skill suggestions."""
    try:
        return await generate_recommendations_service(
            resume_text=request.resume_text,
            job_description=request.job_description
        )
    except Exception as e:
        logger.error(f"AI Recommendations Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate AI insights.")

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_candidate(request: AnalyzeRequest):
    """
    Full candidate analysis endpoint.
    
    Returns comprehensive hiring analysis including:
    - Match Score (0-100%)
    - Strengths & Missing Skills
    - Resume Improvement Suggestions
    - ATS Optimization Keywords
    - Resume Feedback
    - Technical, HR, and Scenario Interview Questions
    """
    try:
        return await analyze_candidate_service(request)
    except Exception as e:
        logger.error(f"AI Analyze Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze candidate: {str(e)}")
