from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.api.routes.common import new_id, now, serialize, to_storage
from app.db.mongodb import get_database
from app.models.schemas import PaginatedResponse, SalesCreate

router = APIRouter(prefix="/sales", tags=["Sales"])


def _derive_temporal(day: date) -> dict:
    iso = day.isocalendar()
    return {
        "day_of_week": day.weekday(),
        "is_weekend": day.weekday() >= 5,
        "week_of_year": iso.week,
        "month": day.month,
    }


@router.get("", response_model=PaginatedResponse)
async def list_sales(skip: int = 0, limit: int = Query(50, le=100), user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    query = {"user_id": user["_id"]}
    items = [serialize(item) async for item in database.sales.find(query).sort("date", -1).skip(skip).limit(limit)]
    return {"items": items, "total": await database.sales.count_documents(query)}


@router.get("/analytics/weekly")
async def weekly_sales(days: int = Query(35, ge=7, le=180), user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    """Actual daily sold / prepared totals for the last ``days`` days (no forecast)."""
    since = to_storage(date.today() - timedelta(days=days - 1))
    pipeline = [
        {"$match": {"user_id": user["_id"], "date": {"$gte": since}}},
        {"$group": {"_id": "$date", "sold": {"$sum": "$quantity_sold"}, "prepared": {"$sum": "$quantity_prepared"}, "waste": {"$sum": "$waste_quantity"}}},
        {"$sort": {"_id": 1}},
    ]
    return [
        {"date": row["_id"].date().isoformat() if hasattr(row["_id"], "date") else str(row["_id"]),
         "sold": round(row["sold"], 1), "prepared": round(row["prepared"], 1), "waste": round(row["waste"], 1)}
        async for row in database.sales.aggregate(pipeline)
    ]


@router.post("", status_code=status.HTTP_201_CREATED)
async def log_sales(payload: SalesCreate, user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    item = to_storage(payload.model_dump())
    item.update(_derive_temporal(payload.date))
    item["sold_out"] = payload.quantity_sold >= payload.quantity_prepared
    item["user_id"] = user["_id"]
    item["status"] = "Logged"

    # One canonical row per (user, item, day) keeps each item a regular daily
    # series for the forecaster instead of accumulating duplicate entries.
    key = {"user_id": user["_id"], "date": item["date"]}
    key["food_item_id" if payload.food_item_id else "food_name"] = payload.food_item_id or payload.food_name
    existing = await database.sales.find_one(key)
    if existing:
        await database.sales.update_one({"_id": existing["_id"]}, {"$set": {**item, "updated_at": now()}})
        return serialize(await database.sales.find_one({"_id": existing["_id"]}))

    item["_id"] = new_id("sale")
    item["created_at"] = now()
    await database.sales.insert_one(item)
    return serialize(item)
