from datetime import date, datetime
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field

# Alias so models can have a field literally named ``date`` (which shadows the
# imported type inside the class body) while still typing other date fields.
DateType = date


class APIModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class UserRole(StrEnum):
    BUSINESS = "BUSINESS"
    CHARITY = "CHARITY"
    ADMIN = "ADMIN"


class UserCreate(APIModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    phone: str = Field(min_length=7, max_length=30)
    address: str = Field(min_length=3, max_length=300)
    role: UserRole
    organization_name: str | None = Field(default=None, max_length=150)


class UserPublic(APIModel):
    id: str
    name: str
    email: EmailStr
    phone: str
    address: str
    role: UserRole
    organization_name: str | None = None
    verification_status: str = "PENDING"
    created_at: datetime


class LoginRequest(APIModel):
    email: EmailStr
    password: str


class TokenResponse(APIModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class InventoryCreate(APIModel):
    food_name: str
    category: str
    quantity: float = Field(gt=0)
    unit: str
    purchase_date: date
    expiry_date: date
    storage_location: str
    unit_cost: float = Field(ge=0)


class SalesCreate(APIModel):
    food_item_id: str | None = None
    food_name: str
    date: date
    quantity_prepared: float = Field(ge=0)
    quantity_sold: float = Field(ge=0)
    waste_quantity: float = Field(default=0, ge=0)
    unit: str
    # Optional demand-driver signals. Nullable now so the write path is stable
    # once the LSTM forecaster starts consuming them (see missingdata.md).
    unit_price: float | None = Field(default=None, ge=0)
    promotion: bool = False
    customer_count: int | None = Field(default=None, ge=0)
    meal_period: str | None = None
    weather: str | None = None
    temperature_c: float | None = None
    is_holiday: bool | None = None


class WasteCreate(APIModel):
    food_item_id: str | None = None
    food_name: str
    quantity: float = Field(gt=0)
    unit: str
    reason: str
    financial_loss: float = Field(ge=0)
    date: DateType | None = None
    waste_stage: str | None = None


class ForecastRequest(APIModel):
    food_name: str
    forecast_date: date
    current_stock: float = Field(ge=0)
    unit: str = "kg"


class DonationCreate(APIModel):
    food_item_name: str
    category: str
    quantity: float = Field(gt=0)
    unit: str
    pickup_address: str
    pickup_date: date
    pickup_time: str
    expiry_time: datetime
    is_prepared: bool = False


class DonationRequestCreate(APIModel):
    donation_id: str
    requested_quantity: float = Field(gt=0)
    unit: str
    pickup_time: str
    notes: str | None = Field(default=None, max_length=500)


class StatusUpdate(APIModel):
    status: str


class NotificationUpdate(APIModel):
    is_read: bool = True


class PaginatedResponse(APIModel):
    items: list[dict[str, Any]]
    total: int

