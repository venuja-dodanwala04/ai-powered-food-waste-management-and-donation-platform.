from fastapi import APIRouter

from app.api.routes import auth, charities, donations, forecasts, inventory, notifications, reports, sales, users, waste

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(inventory.router)
api_router.include_router(sales.router)
api_router.include_router(waste.router)
api_router.include_router(forecasts.router)
api_router.include_router(donations.router)
api_router.include_router(charities.router)
api_router.include_router(notifications.router)
api_router.include_router(reports.router)

