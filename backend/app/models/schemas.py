from pydantic import BaseModel, ConfigDict, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class JobSchema(BaseModel):
    id: str
    title: str
    company: str
    company_logo: Optional[str] = ""
    description: str
    excerpt: Optional[str] = ""
    location: str
    posting_date: str
    skills_required: List[str]
    apply_url: Optional[str] = ""
    category: Optional[str] = ""
    salary: Optional[str] = ""
    source: Optional[str] = ""
    source_region: Optional[str] = ""
    job_type: Optional[str] = ""

class ResumeSchema(BaseModel):
    id: Optional[str] = None
    user_id: str
    original_filename: str
    text_content: str
    extracted_skills: List[str] = []
    education: List[str] = []
    experience: List[str] = []

class MatchSchema(BaseModel):
    id: Optional[str] = None
    user_id: str
    resume_id: str
    job_id: str
    match_percentage: float
    matching_skills: List[str]
    missing_skills: List[str]

class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str

class CoverLetterResponse(BaseModel):
    cover_letter: str
    email_template: str

class RecommendationResponse(BaseModel):
    why_matches: str
    skills_to_improve: List[str]

class InterviewQuestions(BaseModel):
    technical: List[str]
    hr: List[str]
    scenario: List[str]

class AnalyzeRequest(BaseModel):
    resume: str
    job_description: str

class AnalyzeResponse(BaseModel):
    match_score: float
    strengths: List[str]
    missing_skills: List[str]
    improvement_suggestions: List[str]
    ats_keywords: List[str]
    resume_feedback: List[str]
    interview_questions: InterviewQuestions

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserInDB(BaseModel):
    id: Optional[str] = None
    username: str
    email: str
    hashed_password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ApplicationSchema(BaseModel):
    id: Optional[str] = None
    user_id: str
    job_id: str
    resume_id: str
    applied_at: datetime
    status: str = "Applied"
    cover_letter: str
    job_title: str
    company_name: str

class ApplicationResponse(BaseModel):
    application: ApplicationSchema
    message: str
