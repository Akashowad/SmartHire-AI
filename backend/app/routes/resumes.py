from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.resume_parser import extract_text_from_pdf, parse_resume
from app.models.schemas import ResumeSchema
from app.utils.database import db
import uuid

router = APIRouter()

@router.post("/upload-resume", response_model=ResumeSchema)
async def upload_resume(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        contents = await file.read()
        text = extract_text_from_pdf(contents)
        parsed_data = parse_resume(text)
        
        resume = ResumeSchema(
            id=str(uuid.uuid4()),
            user_id="user_1", # Mock user id
            original_filename=file.filename,
            text_content=text,
            extracted_skills=parsed_data.get("skills", []),
            education=parsed_data.get("education", []),
            experience=parsed_data.get("experience", [])
        )
        
        # Save to database gracefully
        if db.db is not None:
            try:
                await db.db["resumes"].insert_one(resume.model_dump())
            except Exception as e:
                print(f"Database error (MongoDB may not be running): {e}")
            
        return resume
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
