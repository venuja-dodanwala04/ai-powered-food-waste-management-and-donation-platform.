from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.db.mongodb import get_database

router = APIRouter(prefix="/reports", tags=["Reports & Analytics"])


@router.get("/summary")
async def summary(user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    owner = {"user_id": user["_id"]}
    sales = await database.sales.aggregate([{"$match": owner}, {"$group": {"_id": None, "sold": {"$sum": "$quantity_sold"}, "prepared": {"$sum": "$quantity_prepared"}}}]).to_list(1)
    waste = await database.waste.aggregate([{"$match": owner}, {"$group": {"_id": None, "quantity": {"$sum": "$quantity"}, "loss": {"$sum": "$financial_loss"}}}]).to_list(1)
    donations = await database.donations.aggregate([{"$match": {"donor_id": user["_id"], "status": "Collected"}}, {"$group": {"_id": None, "quantity": {"$sum": "$quantity"}}}]).to_list(1)
    return {"total_sales_volume": sales[0]["sold"] if sales else 0, "total_prepared": sales[0]["prepared"] if sales else 0, "total_waste": waste[0]["quantity"] if waste else 0, "financial_loss": waste[0]["loss"] if waste else 0, "food_donated": donations[0]["quantity"] if donations else 0}

