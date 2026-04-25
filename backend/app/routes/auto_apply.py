import logging
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.services.browser_service import auto_apply_to_job
from app.services.auth_service import get_current_user
from app.models.schemas import UserInDB

logger = logging.getLogger(__name__)
router = APIRouter()


class AutoApplyRequest(BaseModel):
    apply_url: str
    resume_text: str
    job_description: str
    name: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    linkedin: Optional[str] = ""
    portfolio: Optional[str] = ""
    location: Optional[str] = ""
    cover_letter: Optional[str] = ""


class AutoApplyResponse(BaseModel):
    status: str
    message: str
    fields_filled: int
    logs: list[str]
    apply_url: str


@router.post("/auto-apply", response_model=AutoApplyResponse)
async def auto_apply_endpoint(
    request: AutoApplyRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Automatically navigates to a job application page using Playwright
    and fills in the form with the user's profile data.
    
    Returns a log of what fields were detected and filled.
    """
    try:
        user_data = {
            "name": request.name or current_user.username,
            "email": request.email or "",
            "phone": request.phone or "",
            "linkedin": request.linkedin or "",
            "portfolio": request.portfolio or "",
            "location": request.location or "",
            "cover_letter": request.cover_letter or "",
        }

        result = await auto_apply_to_job(
            apply_url=request.apply_url,
            resume_text=request.resume_text,
            job_description=request.job_description,
            user_data=user_data,
            headless=False  # Show browser window for demo effect
        )

        return AutoApplyResponse(
            status=result["status"],
            message=result["message"],
            fields_filled=result["fields_filled"],
            logs=result["logs"],
            apply_url=result["apply_url"]
        )

    except Exception as e:
        logger.error(f"Auto-apply endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"Auto-apply failed: {str(e)}")

