import os
import logging
from openai import AsyncOpenAI
from app.models.schemas import CoverLetterRequest, CoverLetterResponse, RecommendationResponse

logger = logging.getLogger(__name__)
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

async def generate_cover_letter_service(resume_text: str, job_description: str) -> CoverLetterResponse:
    if not client.api_key or client.api_key == "your_openai_api_key_here":
        return CoverLetterResponse(
            cover_letter="[Mock Cover Letter] Dear Hiring Manager, based on my extensive experience... I am excited to apply for this job. (OpenAI API key missing)",
            email_template="[Mock Email] Subject: Application for Role\n\nHi ,\n\nPlease find my resume attached.\n\nBest,\nCandidate"
        )
        
    prompt = f"""
    You are an AI assistant helping a candidate apply for a job.
    Resume:
    {resume_text}
    
    Job Description:
    {job_description}
    
    Format your response exactly as two parts separated by '---EMAIL_TEMPLATE---'. 
    Part 1: A professional cover letter.
    Part 2: A short email template for the recruiter.
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": prompt}]
        )
        content = response.choices[0].message.content
        parts = content.split('---EMAIL_TEMPLATE---')
        cover_letter = parts[0].strip()
        email_template = parts[1].strip() if len(parts) > 1 else ""
        return CoverLetterResponse(cover_letter=cover_letter, email_template=email_template)
    except Exception as e:
        logger.error(f"OpenAI completion error in cover letter: {e}")
        raise e

async def generate_recommendations_service(resume_text: str, job_description: str) -> RecommendationResponse:
    if not client.api_key or client.api_key == "your_openai_api_key_here":
        return RecommendationResponse(
            why_matches="[Mock] You have great foundational skills for this role, though specific technical stacks might need brushing up.",
            skills_to_improve=["Communication", "Cloud Deployment"]
        )
        
    prompt = f"""
    You are an AI career coach. Given this resume and job description, tell the candidate briefly why they match the job, and list exactly 3 skills they need to improve.
    Resume:
    {resume_text}
    Job:
    {job_description}
    
    Format:
    Why: <your text>
    Improve: skill1, skill2, skill3
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": prompt}]
        )
        content = response.choices[0].message.content
        why_text = "Analysis available."
        skills = []
        for line in content.split('\n'):
            if line.startswith("Why:"):
                why_text = line.replace("Why:", "").strip()
            elif line.startswith("Improve:"):
                skills = [s.strip() for s in line.replace("Improve:", "").split(",")]
        
        return RecommendationResponse(why_matches=why_text, skills_to_improve=skills)
    except Exception as e:
        logger.error(f"OpenAI completion error in recommendations: {e}")
        raise e
