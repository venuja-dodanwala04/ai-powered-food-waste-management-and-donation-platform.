from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.api.routes.common import new_id, now, serialize
from app.db.mongodb import get_database
from app.models.schemas import PaginatedResponse, WasteCreate

router = APIRouter(prefix="/waste", tags=["Food Waste"])


@router.get("", response_model=PaginatedResponse)
async def list_waste(skip: int = 0, limit: int = Query(50, le=100), user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    query = {"user_id": user["_id"]}
    items = [serialize(item) async for item in database.waste.find(query).sort("created_at", -1).skip(skip).limit(limit)]
    return {"items": items, "total": await database.waste.count_documents(query)}


@router.post("", status_code=status.HTTP_201_CREATED)
async def log_waste(payload: WasteCreate, user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    item = payload.model_dump()
    item.update({"_id": new_id("waste"), "user_id": user["_id"], "created_at": now()})
    await database.waste.insert_one(item)
    return serialize(item)


@router.get("/analytics/reasons")
async def waste_by_reason(user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    pipeline = [{"$match": {"user_id": user["_id"]}}, {"$group": {"_id": "$reason", "quantity": {"$sum": "$quantity"}, "financial_loss": {"$sum": "$financial_loss"}}}, {"$sort": {"quantity": -1}}]
    return [{"reason": item["_id"], "quantity": item["quantity"], "financial_loss": item["financial_loss"]} async for item in database.waste.aggregate(pipeline)]

