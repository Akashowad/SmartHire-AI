from pydantic import BaseModel, ConfigDict
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
    publication_date: str
    skills_required: List[str]
    apply_url: Optional[str] = ""
    category: Optional[str] = ""
    salary: Optional[str] = ""
    source: Optional[str] = "Remotive"
    source_region: Optional[str] = "Global"

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

class UserSchema(BaseModel):
    id: Optional[str] = None
    username: str
    email: str
    hashed_password: str
    created_at: datetime = datetime.utcnow()

class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

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
