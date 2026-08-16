from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.api.routes.common import new_id, now, serialize, to_storage
from app.db.mongodb import get_database
from app.models.schemas import ForecastRequest, PaginatedResponse

router = APIRouter(prefix="/forecasts", tags=["AI Demand Forecasting"])


@router.get("", response_model=PaginatedResponse)
async def list_forecasts(user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    query = {"user_id": user["_id"]}
    items = [serialize(item) async for item in database.forecasts.find(query).sort("generated_at", -1).limit(100)]
    return {"items": items, "total": await database.forecasts.count_documents(query)}


@router.post("/predict", status_code=status.HTTP_201_CREATED)
async def predict_demand(payload: ForecastRequest, user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    """Baseline predictor. Replace the calculation with Prophet after historical data is supplied."""
    history = [row async for row in database.sales.find({"user_id": user["_id"], "food_name": payload.food_name})]
    average_demand = sum(row["quantity_sold"] for row in history) / len(history) if history else 0
    forecast = to_storage(payload.model_dump())
    forecast.update({"_id": new_id("forecast"), "user_id": user["_id"], "predicted_demand": round(average_demand, 2), "recommended_preparation": round(max(average_demand - payload.current_stock, 0), 2), "model": "historical-average-baseline", "generated_at": now()})
    await database.forecasts.insert_one(forecast)
    return serialize(forecast)


@router.post("/train")
async def train_model(user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    count = await database.sales.count_documents({"user_id": user["_id"]})
    return {"status": "pending_data", "message": "Connect the Prophet training pipeline when historical sales data is available.", "sales_records_available": count}
