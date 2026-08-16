from fastapi import Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import bearer_scheme, decode_token
from app.db.mongodb import get_database


async def get_current_user(
    token=Depends(bearer_scheme), database: AsyncIOMotorDatabase = Depends(get_database)
) -> dict:
    claims = decode_token(token)
    user = await database.users.find_one({"_id": claims["sub"]})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account not found")
    return user


def require_roles(*roles: str):
    async def dependency(user: dict = Depends(get_current_user)) -> dict:
        if user["role"] not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user
    return dependency

