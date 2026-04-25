import os
import json
import logging
from openai import AsyncOpenAI
from app.models.schemas import (
    CoverLetterRequest, CoverLetterResponse, RecommendationResponse,
    AnalyzeRequest, AnalyzeResponse, InterviewQuestions
)
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

async def analyze_candidate_service(data: AnalyzeRequest) -> AnalyzeResponse:
    """
    Full candidate analysis: resume parsing, job matching, ATS optimization,
    resume improvements, and interview preparation using structured master prompt.
    """
    if not settings.OPENAI_API_KEY:
        logger.warning("OpenAI API key missing. Returning mock analysis.")
        return AnalyzeResponse(
            match_score=72.5,
            strengths=["Python programming", "FastAPI experience", "Problem solving"],
            missing_skills=["Kubernetes", "GraphQL", "CI/CD pipelines"],
            improvement_suggestions=[
                "Add quantifiable achievements (e.g., improved performance by 30%)",
                "Include cloud certifications if available",
                "Use more action verbs in experience descriptions"
            ],
            ats_keywords=["Docker", "AWS", "Agile", "REST API", "Microservices"],
            resume_feedback=[
                "Resume is well-structured but could use more keywords from the job description",
                "Consider adding a technical skills section at the top"
            ],
            interview_questions=InterviewQuestions(
                technical=[
                    "Explain the difference between REST and GraphQL",
                    "How do you handle database migrations in production?",
                    "Describe your experience with Docker and containerization",
                    "What is the GIL in Python and how does it affect concurrency?",
                    "How would you design a rate-limiting system?"
                ],
                hr=[
                    "Tell me about yourself and your background",
                    "Why are you interested in this role?",
                    "Describe a time you had a conflict with a team member"
                ],
                scenario=[
                    "A critical production bug is reported. Walk us through your debugging process",
                    "You need to onboard a new junior developer. How do you approach this?"
                ]
            )
        )

    master_prompt = f"""You are "SmartHire AI", an advanced AI-powered hiring assistant.

Your job is to process a candidate's resume and a job description, then provide a complete hiring analysis including resume evaluation, job matching, ATS optimization, and interview preparation.

=====================
INPUT:
=====================
Resume:
{data.resume}

Job Description:
{data.job_description}

=====================
TASKS:
=====================

1. RESUME PARSING
Extract and structure:
- Name
- Skills (technical + soft)
- Education
- Experience (role, company, duration)
- Projects
- Certifications

2. JOB DESCRIPTION ANALYSIS
Identify:
- Required skills
- Preferred skills
- Experience level
- Key responsibilities

3. MATCHING ANALYSIS
- Compare resume with job description
- Calculate Match Score (0-100%)
- Identify:
  - Strengths (matching skills/experience)
  - Missing Skills
  - Skill Gaps

4. ATS OPTIMIZATION
- Suggest important keywords missing from resume
- Suggest improvements in formatting and content
- Suggest action verbs and impactful phrasing

5. RESUME IMPROVEMENT
- Give 3-5 specific, practical improvements
- Suggest better bullet points if needed

6. INTERVIEW PREPARATION
Generate:
- 5 Technical Interview Questions (based on job role)
- 3 HR Questions
- 2 Scenario-based Questions

=====================
OUTPUT FORMAT (STRICT JSON):
=====================
Return ONLY valid JSON with this exact structure (no markdown, no explanations):

{{
  "match_score": 82.5,
  "strengths": [
    "..."
  ],
  "missing_skills": [
    "..."
  ],
  "improvement_suggestions": [
    "..."
  ],
  "ats_keywords": [
    "..."
  ],
  "resume_feedback": [
    "..."
  ],
  "interview_questions": {{
    "technical": ["1. ...", "2. ...", "3. ...", "4. ...", "5. ..."],
    "hr": ["1. ...", "2. ...", "3. ..."],
    "scenario": ["1. ...", "2. ..."]
  }}
}}

=====================
RULES:
=====================
- Be concise and professional
- Avoid unnecessary explanations outside the JSON
- Ensure realistic match scoring (don't give 100% unless perfect match)
- Do not hallucinate experience not present in resume
- Tailor everything to the given job description
- Return ONLY the JSON object, nothing else before or after
"""

    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional hiring assistant that outputs only valid JSON."},
                {"role": "user", "content": master_prompt}
            ],
            temperature=0.5
        )
        content = response.choices[0].message.content.strip()
        
        # Clean markdown code blocks if present
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        parsed = json.loads(content)
        
        return AnalyzeResponse(
            match_score=parsed.get("match_score", 0.0),
            strengths=parsed.get("strengths", []),
            missing_skills=parsed.get("missing_skills", []),
            improvement_suggestions=parsed.get("improvement_suggestions", []),
            ats_keywords=parsed.get("ats_keywords", []),
            resume_feedback=parsed.get("resume_feedback", []),
            interview_questions=InterviewQuestions(**parsed.get("interview_questions", {
                "technical": [], "hr": [], "scenario": []
            }))
        )
    except json.JSONDecodeError as je:
        logger.error(f"Failed to parse AI JSON response: {je}. Raw: {content[:500]}")
        raise Exception("AI returned invalid JSON format")
    except Exception as e:
        logger.error(f"OpenAI Error (Analyze): {e}")
        raise e
