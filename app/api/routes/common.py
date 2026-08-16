from datetime import UTC, date, datetime, time
from uuid import uuid4

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorCollection


def now() -> datetime:
    return datetime.now(UTC)


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex}"


def serialize(document: dict | None) -> dict | None:
    if document is None:
        return None
    document["id"] = str(document.pop("_id"))
    return document


def to_storage(value):
    """Convert Pydantic date values to BSON-compatible UTC datetimes."""
    if isinstance(value, datetime):
        return value
    if isinstance(value, date):
        return datetime.combine(value, time.min, tzinfo=UTC)
    if isinstance(value, dict):
        return {key: to_storage(item) for key, item in value.items()}
    if isinstance(value, list):
        return [to_storage(item) for item in value]
    return value


async def get_owned_or_404(collection: AsyncIOMotorCollection, record_id: str, owner_id: str) -> dict:
    item = await collection.find_one({"_id": record_id, "user_id": owner_id})
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    return item
