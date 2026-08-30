from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.api.routes.common import new_id, now, serialize, to_storage
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
    incident = payload.date or date.today()
    item = to_storage(payload.model_dump())
    item["date"] = to_storage(incident)
    item.update({"_id": new_id("waste"), "user_id": user["_id"], "created_at": now()})
    await database.waste.insert_one(item)
    return serialize(item)


@router.get("/analytics/reasons")
async def waste_by_reason(user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    pipeline = [{"$match": {"user_id": user["_id"]}}, {"$group": {"_id": "$reason", "quantity": {"$sum": "$quantity"}, "financial_loss": {"$sum": "$financial_loss"}}}, {"$sort": {"quantity": -1}}]
    return [{"reason": item["_id"], "quantity": round(item["quantity"], 1), "financial_loss": round(item["financial_loss"])} async for item in database.waste.aggregate(pipeline)]


@router.get("/analytics/top-items")
async def top_wasted_items(limit: int = Query(5, ge=1, le=20), user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    pipeline = [
        {"$match": {"user_id": user["_id"]}},
        {"$group": {
            "_id": "$food_name",
            "quantity": {"$sum": "$quantity"},
            "financial_loss": {"$sum": "$financial_loss"},
            "reasons": {"$push": "$reason"},
        }},
        {"$sort": {"quantity": -1}},
        {"$limit": limit},
    ]
    out = []
    async for row in database.waste.aggregate(pipeline):
        reasons = row.get("reasons") or []
        primary = max(set(reasons), key=reasons.count) if reasons else "Unknown"
        out.append({
            "food_name": row["_id"],
            "quantity": round(row["quantity"], 1),
            "financial_loss": round(row["financial_loss"]),
            "primary_reason": primary,
        })
    return out


@router.get("/analytics/weekly-loss")
async def weekly_loss(weeks: int = Query(7, ge=1, le=26), user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    """Financial loss and wasted quantity grouped by ISO week for the last N weeks."""
    since = to_storage(date.today() - timedelta(weeks=weeks))
    pipeline = [
        {"$match": {"user_id": user["_id"], "date": {"$gte": since}}},
        {"$group": {
            "_id": {"year": {"$isoWeekYear": "$date"}, "week": {"$isoWeek": "$date"}},
            "financial_loss": {"$sum": "$financial_loss"},
            "quantity": {"$sum": "$quantity"},
        }},
        {"$sort": {"_id.year": 1, "_id.week": 1}},
    ]
    return [
        {"week": f"{row['_id']['year']}-W{row['_id']['week']:02d}",
         "financial_loss": round(row["financial_loss"]), "quantity": round(row["quantity"], 1)}
        async for row in database.waste.aggregate(pipeline)
    ]
