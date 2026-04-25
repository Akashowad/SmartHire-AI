import uuid
import logging
from datetime import timedelta
from fastapi import APIRouter, HTTPException, Depends, status
from app.models.schemas import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import (
    get_password_hash, authenticate_user, create_access_token,
    get_current_user, get_user
)
from app.utils.database import db
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/signup", response_model=Token)
async def signup(user_data: UserCreate):
    """Register a new user and return an access token."""
    if db.db is not None:
        existing = await db.db["users"].find_one({"username": user_data.username})
        if existing:
            raise HTTPException(status_code=400, detail="Username already registered")
        existing_email = await db.db["users"].find_one({"email": user_data.email})
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")

    hashed = get_password_hash(user_data.password)
    user_doc = {
        "id": str(uuid.uuid4()),
        "username": user_data.username,
        "email": user_data.email,
        "hashed_password": hashed
    }

    if db.db is not None:
        await db.db["users"].insert_one(user_doc)
        logger.info(f"User registered: {user_data.username}")
    else:
        logger.warning("DB unavailable. User registered in-memory only.")

    access_token = create_access_token(data={"sub": user_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """Authenticate user and return an access token."""
    user = await authenticate_user(user_data.username, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email
    )
