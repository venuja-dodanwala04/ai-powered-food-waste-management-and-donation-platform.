import csv
import io
from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user
from app.api.routes.common import to_storage
from app.db.mongodb import get_database

router = APIRouter(prefix="/reports", tags=["Reports & Analytics"])

# Rough conversion factors (documented, not model output):
CO2E_PER_KG_FOOD = 2.5          # kg CO2e avoided per kg of food rescued
MEALS_PER_KG = 2.5             # ~0.4 kg per served meal


async def _sales_totals(database, user_id, since=None):
    match = {"user_id": user_id}
    if since is not None:
        match["date"] = {"$gte": to_storage(since)}
    rows = await database.sales.aggregate([
        {"$match": match},
        {"$group": {"_id": None, "sold": {"$sum": "$quantity_sold"}, "prepared": {"$sum": "$quantity_prepared"}, "waste": {"$sum": "$waste_quantity"}}},
    ]).to_list(1)
    return rows[0] if rows else {"sold": 0.0, "prepared": 0.0, "waste": 0.0}


@router.get("/summary")
async def summary(range_days: int = Query(30, alias="rangeDays", ge=7, le=365), user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    owner = {"user_id": user["_id"]}
    period_start = date.today() - timedelta(days=range_days - 1)
    prev_start = period_start - timedelta(days=range_days)

    current = await _sales_totals(database, user["_id"], period_start)
    previous_rows = await database.sales.aggregate([
        {"$match": {"user_id": user["_id"], "date": {"$gte": to_storage(prev_start), "$lt": to_storage(period_start)}}},
        {"$group": {"_id": None, "prepared": {"$sum": "$quantity_prepared"}, "waste": {"$sum": "$waste_quantity"}}},
    ]).to_list(1)
    previous = previous_rows[0] if previous_rows else {"prepared": 0.0, "waste": 0.0}

    waste = await database.waste.aggregate([
        {"$match": {**owner, "date": {"$gte": to_storage(period_start)}}},
        {"$group": {"_id": None, "quantity": {"$sum": "$quantity"}, "loss": {"$sum": "$financial_loss"}}},
    ]).to_list(1)
    waste_total = waste[0] if waste else {"quantity": 0.0, "loss": 0.0}

    donations = await database.donations.aggregate([
        {"$match": {"donor_id": user["_id"], "status": "Collected"}},
        {"$group": {"_id": None, "quantity": {"$sum": "$quantity"}}},
    ]).to_list(1)
    donated_kg = donations[0]["quantity"] if donations else 0.0

    inv = await database.inventory.aggregate([
        {"$match": owner}, {"$group": {"_id": None, "avg_cost": {"$avg": "$unit_cost"}}},
    ]).to_list(1)
    avg_cost = (inv[0]["avg_cost"] if inv and inv[0]["avg_cost"] else 400.0)

    cur_rate = (current["waste"] / current["prepared"]) if current["prepared"] else 0.0
    prev_rate = (previous["waste"] / previous["prepared"]) if previous["prepared"] else 0.0
    waste_reduction = round((prev_rate - cur_rate) / prev_rate * 100, 1) if prev_rate else 0.0

    return {
        "rangeDays": range_days,
        "totalSalesVolumeKg": round(current["sold"], 1),
        "totalPreparedKg": round(current["prepared"], 1),
        "totalWasteKg": round(waste_total["quantity"], 1),
        "financialLossLKR": round(waste_total["loss"]),
        "wasteReductionPercent": waste_reduction,
        "foodDonatedKg": round(donated_kg, 1),
        "estimatedFinancialSavingsLKR": round(donated_kg * avg_cost),
        "co2SavedKg": round(donated_kg * CO2E_PER_KG_FOOD, 1),
        "mealsDonated": round(donated_kg * MEALS_PER_KG),
        "donationBeneficiaries": round(donated_kg * MEALS_PER_KG),
    }


@router.get("/dashboard")
async def dashboard(user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    owner = {"user_id": user["_id"]}
    today_start = to_storage(date.today())

    today_sales = await database.sales.aggregate([
        {"$match": {**owner, "date": {"$gte": today_start}}},
        {"$group": {"_id": None, "sold": {"$sum": "$quantity_sold"}, "waste": {"$sum": "$waste_quantity"}}},
    ]).to_list(1)
    today = today_sales[0] if today_sales else {"sold": 0.0, "waste": 0.0}

    yesterday = await database.sales.aggregate([
        {"$match": {**owner, "date": {"$gte": to_storage(date.today() - timedelta(days=1)), "$lt": today_start}}},
        {"$group": {"_id": None, "sold": {"$sum": "$quantity_sold"}}},
    ]).to_list(1)
    prev = yesterday[0] if yesterday else {"sold": 0.0}

    active_collections = await database.donations.count_documents({"donor_id": user["_id"], "status": "Reserved"})
    donated_today = await database.donations.aggregate([
        {"$match": {"donor_id": user["_id"], "status": "Collected", "pickup_date": {"$gte": today_start}}},
        {"$group": {"_id": None, "quantity": {"$sum": "$quantity"}}},
    ]).to_list(1)

    delta = round((today["sold"] - prev["sold"]) / prev["sold"] * 100, 1) if prev.get("sold") else 0.0
    return {
        "todaySalesKg": round(today["sold"], 1),
        "todayWasteKg": round(today["waste"], 1),
        "salesDeltaPercent": delta,
        "donatedTodayKg": round(donated_today[0]["quantity"], 1) if donated_today else 0.0,
        "activeCollections": active_collections,
    }


@router.get("/export.csv")
async def export_csv(user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Date", "Type", "Item", "Quantity", "Unit", "Status/Reason", "FinancialLoss(LKR)"])

    async for row in database.sales.find({"user_id": user["_id"]}).sort("date", -1).limit(2000):
        day = row["date"].date().isoformat() if hasattr(row["date"], "date") else str(row["date"])[:10]
        writer.writerow([day, "Sale", row.get("food_name", ""), row.get("quantity_sold", 0), row.get("unit", ""), row.get("status", "Logged"), ""])
    async for row in database.waste.find({"user_id": user["_id"]}).sort("created_at", -1).limit(2000):
        raw = row.get("date") or row.get("created_at")
        day = raw.date().isoformat() if hasattr(raw, "date") else str(raw)[:10]
        writer.writerow([day, "Waste", row.get("food_name", ""), row.get("quantity", 0), row.get("unit", ""), row.get("reason", ""), round(row.get("financial_loss", 0))])
    async for row in database.donations.find({"donor_id": user["_id"]}).sort("created_at", -1).limit(1000):
        day = row["created_at"].date().isoformat() if hasattr(row.get("created_at"), "date") else ""
        writer.writerow([day, "Donation", row.get("food_item_name", ""), row.get("quantity", 0), row.get("unit", ""), row.get("status", ""), ""])

    buffer.seek(0)
    filename = f"EcoKitchen_Report_{date.today().isoformat()}.csv"
    return StreamingResponse(iter([buffer.getvalue()]), media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})
