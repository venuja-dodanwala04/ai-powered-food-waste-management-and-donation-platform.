from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.api.routes.common import serialize
from app.db.mongodb import get_database
from app.models.schemas import NotificationUpdate, PaginatedResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=PaginatedResponse)
async def list_notifications(skip: int = 0, limit: int = Query(50, le=100), user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    query = {"user_id": user["_id"]}
    items = [serialize(item) async for item in database.notifications.find(query).sort("created_at", -1).skip(skip).limit(limit)]
    return {"items": items, "total": await database.notifications.count_documents(query)}


@router.patch("/{notification_id}")
async def mark_notification(notification_id: str, payload: NotificationUpdate, user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    result = await database.notifications.update_one({"_id": notification_id, "user_id": user["_id"]}, {"$set": payload.model_dump()})
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Notification not found")
    return serialize(await database.notifications.find_one({"_id": notification_id}))


@router.post("/mark-all-read")
async def mark_all_read(user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    result = await database.notifications.update_many({"user_id": user["_id"], "is_read": False}, {"$set": {"is_read": True}})
    return {"updated": result.modified_count}

