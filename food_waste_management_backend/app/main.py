from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.db.mongodb import mongodb


@asynccontextmanager
async def lifespan(_: FastAPI):
    await mongodb.connect()
    database = mongodb.database()
    await database.users.create_index("email", unique=True)
    await database.inventory.create_index([("user_id", 1), ("expiry_date", 1)])
    await database.sales.create_index([("user_id", 1), ("food_name", 1), ("date", -1)])
    await database.donations.create_index([("status", 1), ("created_at", -1)])
    yield
    await mongodb.close()


settings = get_settings()
app = FastAPI(title=settings.app_name, version="0.1.0", description="Food waste management, donation, and AI demand forecasting API.", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "healthy", "service": settings.app_name, "environment": settings.environment}

