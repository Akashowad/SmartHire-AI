from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.resume_parser import extract_text_from_pdf, extract_text_from_docx, parse_resume
from app.models.schemas import ResumeSchema
from app.utils.database import db
import uuid

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc",
}

@router.post("/upload-resume", response_model=ResumeSchema)
async def upload_resume(file: UploadFile = File(...)):
    file_type = ALLOWED_TYPES.get(file.content_type)
    if file_type is None:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and Word (.docx) files are supported."
        )
        
    try:
        contents = await file.read()

        if file_type == "pdf":
            text = extract_text_from_pdf(contents)
        else:
            text = extract_text_from_docx(contents)

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
