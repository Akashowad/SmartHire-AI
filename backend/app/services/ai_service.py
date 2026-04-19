import os
import logging
from openai import AsyncOpenAI
from app.models.schemas import CoverLetterRequest, CoverLetterResponse, RecommendationResponse
from app.core.config import settings

logger = logging.getLogger(__name__)

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_cover_letter_service(resume_text: str, job_description: str) -> CoverLetterResponse:
    """Generates a tailored cover letter and email template using OpenAI."""
    if not settings.OPENAI_API_KEY:
        logger.warning("OpenAI API key missing. Returning mock data.")
        return CoverLetterResponse(
            cover_letter="[Mock Cover Letter] I am excited to apply... (OpenAI API key missing)",
            email_template="[Mock Email] Subject: Application for Role..."
        )
        
    prompt = f"""
    You are an AI career assistant. Create a professional cover letter and email based on the details below.
    
    Resume: {resume_text}
    Job Description: {job_description}
    
    Format your response exactly as two parts separated by '---EMAIL_TEMPLATE---'.
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": prompt}]
        )
        content = response.choices[0].message.content
        parts = content.split('---EMAIL_TEMPLATE---')
        return CoverLetterResponse(
            cover_letter=parts[0].strip(),
            email_template=parts[1].strip() if len(parts) > 1 else ""
        )
    except Exception as e:
        logger.error(f"OpenAI Error (Cover Letter): {e}")
        raise e

async def generate_recommendations_service(resume_text: str, job_description: str) -> RecommendationResponse:
    """Provides AI-driven match analysis and skill gap suggestions."""
    if not settings.OPENAI_API_KEY:
        return RecommendationResponse(
            why_matches="[Mock] You have great foundational skills for this role.",
            skills_to_improve=["Communication", "Cloud Deployment"]
        )
        
    prompt = f"Resume: {resume_text}\nJob: {job_description}\nWhy matches? List exactly 3 skills to improve. Format: Why: <text>\nImprove: s1, s2, s3"
    
    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": prompt}]
        )
        content = response.choices[0].message.content
        why_text = "Analysis complete."
        skills = []
        for line in content.split('\n'):
            if "Why:" in line: why_text = line.split("Why:")[1].strip()
            if "Improve:" in line: skills = [s.strip() for s in line.split("Improve:")[1].split(",")]
        
        return RecommendationResponse(why_matches=why_text, skills_to_improve=skills)
    except Exception as e:
        logger.error(f"OpenAI Error (Recommendations): {e}")
        raise e
