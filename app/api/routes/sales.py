from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.api.routes.common import new_id, now, serialize, to_storage
from app.db.mongodb import get_database
from app.models.schemas import PaginatedResponse, SalesCreate

router = APIRouter(prefix="/sales", tags=["Sales"])


@router.get("", response_model=PaginatedResponse)
async def list_sales(skip: int = 0, limit: int = Query(50, le=100), user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    query = {"user_id": user["_id"]}
    items = [serialize(item) async for item in database.sales.find(query).sort("date", -1).skip(skip).limit(limit)]
    return {"items": items, "total": await database.sales.count_documents(query)}


@router.post("", status_code=status.HTTP_201_CREATED)
async def log_sales(payload: SalesCreate, user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    item = to_storage(payload.model_dump())
    item.update({"_id": new_id("sale"), "user_id": user["_id"], "created_at": now(), "status": "Logged"})
    await database.sales.insert_one(item)
    return serialize(item)
