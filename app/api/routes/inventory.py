from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.api.routes.common import get_owned_or_404, new_id, now, serialize, to_storage
from app.db.mongodb import get_database
from app.models.schemas import InventoryCreate, PaginatedResponse

router = APIRouter(prefix="/inventory", tags=["Inventory & Expiry"])


def inventory_status(item: dict) -> str:
    expiry_date = item["expiry_date"].date() if hasattr(item["expiry_date"], "date") else item["expiry_date"]
    days = (expiry_date - date.today()).days
    if days < 0: return "Expired"
    if days <= 1: return "Critical Expiry"
    if days <= 3: return "Expiring Soon"
    return "Fresh"


@router.get("", response_model=PaginatedResponse)
async def list_inventory(skip: int = 0, limit: int = Query(50, le=100), user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    query = {"user_id": user["_id"]}
    items = [serialize(item) async for item in database.inventory.find(query).sort("expiry_date", 1).skip(skip).limit(limit)]
    for item in items: item["status"] = inventory_status(item)
    return {"items": items, "total": await database.inventory.count_documents(query)}


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_inventory(payload: InventoryCreate, user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    item = to_storage(payload.model_dump())
    item.update({"_id": new_id("food"), "user_id": user["_id"], "created_at": now()})
    await database.inventory.insert_one(item)
    return serialize(item)


@router.patch("/{item_id}")
async def update_inventory(item_id: str, payload: InventoryCreate, user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    await get_owned_or_404(database.inventory, item_id, user["_id"])
    await database.inventory.update_one({"_id": item_id}, {"$set": to_storage(payload.model_dump())})
    return serialize(await database.inventory.find_one({"_id": item_id}))


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inventory(item_id: str, user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    await get_owned_or_404(database.inventory, item_id, user["_id"])
    await database.inventory.delete_one({"_id": item_id})


@router.get("/alerts/expiring")
async def expiry_alerts(days: int = Query(3, ge=0, le=30), user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    items = [serialize(item) async for item in database.inventory.find({"user_id": user["_id"]})]
    return [item for item in items if ((item["expiry_date"].date() if hasattr(item["expiry_date"], "date") else item["expiry_date"]) - date.today()).days <= days]
