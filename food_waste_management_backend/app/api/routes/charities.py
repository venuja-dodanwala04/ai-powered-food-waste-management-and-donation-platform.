from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.api.routes.common import serialize
from app.db.mongodb import get_database
from app.models.schemas import PaginatedResponse

router = APIRouter(prefix="/charities", tags=["Charity Mapping"])


@router.get("", response_model=PaginatedResponse)
async def list_charities(skip: int = 0, limit: int = Query(50, le=100), _: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    query = {"role": "CHARITY"}
    users = [serialize(item) async for item in database.users.find(query, {"password_hash": 0}).skip(skip).limit(limit)]
    return {"items": users, "total": await database.users.count_documents(query)}

