from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from ..models.schemas import UserSchema, LoginRequest, SignupRequest, TokenResponse
from ..utils.database import get_database
from ..core.config import settings

router = APIRouter()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    db = get_database()
    user = await db.users.find_one({"username": username})
    if user is None:
        raise credentials_exception
    return UserSchema(**user)

@router.post("/signup", response_model=TokenResponse)
async def signup(request: SignupRequest):
    try:
        db = get_database()
        existing_user = await db.users.find_one({"$or": [{"username": request.username}, {"email": request.email}]})
        if existing_user:
            raise HTTPException(status_code=400, detail="Username or email already registered")
        
        hashed_password = get_password_hash(request.password)
        user_data = {
            "username": request.username,
            "email": request.email,
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow()
        }
        result = await db.users.insert_one(user_data)
        user_data["id"] = str(result.inserted_id)
        
        access_token = create_access_token(data={"sub": request.username})
        return TokenResponse(access_token=access_token, user={"id": user_data["id"], "username": request.username, "email": request.email})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    db = get_database()
    user = await db.users.find_one({"username": request.username})
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": request.username})
    return TokenResponse(access_token=access_token, user={"id": str(user["_id"]), "username": user["username"], "email": user["email"]})

@router.get("/me")
async def read_users_me(current_user: UserSchema = Depends(get_current_user)):
    return {"id": current_user.id, "username": current_user.username, "email": current_user.email}