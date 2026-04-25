from fastapi import APIRouter
from app.routes.resumes import router as resumes_router
from app.routes.jobs import router as jobs_router
from app.routes.matches import router as matches_router
from app.routes.ai import router as ai_router
from app.routes.applications import router as applications_router
from app.routes.auth import router as auth_router
from app.routes.auto_apply import router as auto_apply_router

api_router = APIRouter()

api_router.include_router(resumes_router, prefix="/resumes", tags=["Resumes"])
api_router.include_router(jobs_router, prefix="/jobs", tags=["Jobs"])
api_router.include_router(matches_router, prefix="/matches", tags=["Matches"])
api_router.include_router(ai_router, prefix="/ai", tags=["AI Assistant"])
api_router.include_router(applications_router, prefix="/applications", tags=["Applications"])
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(auto_apply_router, prefix="/auto-apply", tags=["Auto Apply"])
