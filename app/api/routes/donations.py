from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_current_user, require_roles
from app.api.routes.common import new_id, now, serialize, to_storage
from app.db.mongodb import get_database
from app.models.schemas import DonationCreate, DonationRequestCreate, PaginatedResponse, StatusUpdate

router = APIRouter(prefix="/donations", tags=["Donations"])


@router.get("", response_model=PaginatedResponse)
async def list_donations(mine: bool = False, skip: int = 0, limit: int = Query(50, le=100), user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    query = {"donor_id": user["_id"]} if mine else {"status": "Available"}
    items = [serialize(item) async for item in database.donations.find(query).sort("created_at", -1).skip(skip).limit(limit)]
    return {"items": items, "total": await database.donations.count_documents(query)}


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_donation(payload: DonationCreate, user: dict = Depends(require_roles("BUSINESS", "ADMIN")), database: AsyncIOMotorDatabase = Depends(get_database)):
    item = to_storage(payload.model_dump())
    item.update({"_id": new_id("don"), "donor_id": user["_id"], "donor_name": user["name"], "donor_phone": user["phone"], "status": "Available", "created_at": now()})
    await database.donations.insert_one(item)
    return serialize(item)


@router.post("/requests", status_code=status.HTTP_201_CREATED)
async def request_donation(payload: DonationRequestCreate, user: dict = Depends(require_roles("CHARITY", "ADMIN")), database: AsyncIOMotorDatabase = Depends(get_database)):
    donation = await database.donations.find_one({"_id": payload.donation_id, "status": "Available"})
    if not donation:
        raise HTTPException(status_code=404, detail="Available donation not found")
    item = payload.model_dump()
    item.update({"_id": new_id("req"), "charity_id": user["_id"], "charity_name": user["name"], "status": "Pending", "created_at": now()})
    await database.donation_requests.insert_one(item)
    await database.donations.update_one({"_id": donation["_id"]}, {"$set": {"status": "Reserved"}})
    return serialize(item)


@router.get("/requests", response_model=PaginatedResponse)
async def list_requests(user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    query = {"charity_id": user["_id"]} if user["role"] == "CHARITY" else {}
    items = [serialize(item) async for item in database.donation_requests.find(query).sort("created_at", -1).limit(100)]
    return {"items": items, "total": await database.donation_requests.count_documents(query)}


@router.patch("/requests/{request_id}/status")
async def update_request(request_id: str, payload: StatusUpdate, user: dict = Depends(get_current_user), database: AsyncIOMotorDatabase = Depends(get_database)):
    request = await database.donation_requests.find_one({"_id": request_id})
    if not request:
        raise HTTPException(status_code=404, detail="Donation request not found")
    if user["role"] == "CHARITY" and request["charity_id"] != user["_id"]:
        raise HTTPException(status_code=403, detail="Not allowed to update this request")
    await database.donation_requests.update_one({"_id": request_id}, {"$set": {"status": payload.status}})
    if payload.status in {"Rejected", "Collected"}:
        donation_status = "Available" if payload.status == "Rejected" else "Collected"
        await database.donations.update_one({"_id": request["donation_id"]}, {"$set": {"status": donation_status}})
    return serialize(await database.donation_requests.find_one({"_id": request_id}))
