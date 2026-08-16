from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.api.routes.common import new_id, now, serialize
from app.core.security import create_access_token, hash_password, verify_password
from app.db.mongodb import get_database
from app.models.schemas import LoginRequest, TokenResponse, UserCreate, UserPublic

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, database: AsyncIOMotorDatabase = Depends(get_database)):
    if await database.users.find_one({"email": payload.email.lower()}):
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user = payload.model_dump(exclude={"password"})
    user.update({"_id": new_id("usr"), "email": payload.email.lower(), "password_hash": hash_password(payload.password), "verification_status": "PENDING", "created_at": now()})
    await database.users.insert_one(user)
    public_user = UserPublic(**serialize(user.copy()))
    return TokenResponse(access_token=create_access_token(public_user.id, public_user.role), user=public_user)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, database: AsyncIOMotorDatabase = Depends(get_database)):
    user = await database.users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    public_user = UserPublic(**serialize(user))
    return TokenResponse(access_token=create_access_token(public_user.id, public_user.role), user=public_user)


@router.get("/me", response_model=UserPublic)
async def current_profile(user: dict = Depends(get_current_user)):
    return UserPublic(**serialize(user.copy()))

