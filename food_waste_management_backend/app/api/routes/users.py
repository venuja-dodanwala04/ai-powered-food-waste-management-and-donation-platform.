from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.api.routes.common import serialize
from app.db.mongodb import get_database
from app.models.schemas import UserPublic

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserPublic)
async def get_me(user: dict = Depends(get_current_user)):
    return UserPublic(**serialize(user.copy()))


@router.patch("/me", response_model=UserPublic)
async def update_me(payload: dict, user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    allowed = {key: value for key, value in payload.items() if key in {"name", "phone", "address", "organization_name"}}
    await database.users.update_one({"_id": user["_id"]}, {"$set": allowed})
    updated = await database.users.find_one({"_id": user["_id"]})
    return UserPublic(**serialize(updated))

