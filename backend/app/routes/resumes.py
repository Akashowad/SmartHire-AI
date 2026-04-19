import uuid
import logging
from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.resume_service import extract_text_from_pdf, extract_text_from_docx, parse_resume
from app.models.schemas import ResumeSchema
from app.utils.database import db

logger = logging.getLogger(__name__)
router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
}

@router.post("/upload-resume", response_model=ResumeSchema)
async def upload_resume(file: UploadFile = File(...)):
    """Handles resume upload, parsing, and storage with robust error handling."""
    file_type = ALLOWED_TYPES.get(file.content_type)
    if not file_type:
        logger.error(f"Unsupported file type: {file.content_type}")
        raise HTTPException(status_code=400, detail="Only PDF and Word (.docx) files are supported.")
        
    try:
        logger.info(f"Processing upload for file: {file.filename}")
        contents = await file.read()

        if file_type == "pdf":
            text = extract_text_from_pdf(contents)
        else:
            text = extract_text_from_docx(contents)

        if not text:
            raise ValueError("No text could be extracted from the file.")

        parsed_data = parse_resume(text)
        
        resume = ResumeSchema(
            id=str(uuid.uuid4()),
            user_id="user_1", # Mock user ID for now
            original_filename=file.filename,
            text_content=text,
            extracted_skills=parsed_data.get("skills", []),
            education=parsed_data.get("education", []),
            experience=parsed_data.get("experience", [])
        )
        
        # Persistent storage
        if db.db is not None:
            await db.db["resumes"].insert_one(resume.model_dump())
            logger.info("Resume saved successfully to database.")
            
        return resume
    except Exception as e:
        logger.error(f"Resume upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")
