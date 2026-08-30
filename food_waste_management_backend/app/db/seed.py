"""Development bootstrap: default accounts + curated, LSTM-ready demo data.

Runs on startup from ``app/main.py`` whenever ``settings.is_production`` is false
(i.e. ``ENVIRONMENT`` unset / empty / anything other than ``production``).

Everything here is idempotent:

* ``ensure_default_users`` skips accounts that already exist.
* ``ensure_seed_data`` no-ops once the default organization already owns sales.
* ``write_credentials_file`` never overwrites an existing ``credentials.md``.

Use ``python -m scripts.seed_dev --reset`` to wipe the default org and reload.
"""

from __future__ import annotations

import json
import logging
from datetime import UTC, date, datetime, time, timedelta
from pathlib import Path

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import hash_password

logger = logging.getLogger("app.seed")

SEED_DIR = Path(__file__).resolve().parent / "seed_data"
REPO_ROOT = Path(__file__).resolve().parents[3]
CREDENTIALS_FILE = REPO_ROOT / "credentials.md"

DEFAULT_PASSWORD = "Ecokitchen#2024"
BUSINESS_ID = "usr_default_business"
CHARITY_ID = "usr_default_charity"
ADMIN_ID = "usr_default_admin"

DEFAULT_USERS: list[dict] = [
    {
        "_id": BUSINESS_ID,
        "name": "Default Organization",
        "email": "business@ecokitchen.local",
        "role": "BUSINESS",
        "organization_name": "Default Organization",
        "phone": "+94112000001",
        "address": "142 Peradeniya Rd, Kandy",
    },
    {
        "_id": CHARITY_ID,
        "name": "Default Charity",
        "email": "charity@ecokitchen.local",
        "role": "CHARITY",
        "organization_name": "Default Charity Foundation",
        "phone": "+94112000002",
        "address": "5 Temple Rd, Kandy",
    },
    {
        "_id": ADMIN_ID,
        "name": "Default Admin",
        "email": "admin@ecokitchen.local",
        "role": "ADMIN",
        "organization_name": None,
        "phone": "+94112000003",
        "address": "142 Peradeniya Rd, Kandy",
    },
]

CREDENTIALS_TEMPLATE = f"""# Default test credentials

These accounts and their demo data are **auto-created on startup** whenever the
backend runs with `ENVIRONMENT` unset / empty / anything other than `production`.
They do **not** exist in a production deployment.

| Role     | Email                        | Password           |
|----------|------------------------------|--------------------|
| Business | `business@ecokitchen.local`  | `{DEFAULT_PASSWORD}` |
| Charity  | `charity@ecokitchen.local`   | `{DEFAULT_PASSWORD}` |
| Admin    | `admin@ecokitchen.local`     | `{DEFAULT_PASSWORD}` |

- Frontend: http://localhost:5173  (log in via the Login page)
- API docs: http://127.0.0.1:8000/docs

The **Business** account owns the seeded organization ("Default Organization"):
~1 year of gap-free daily sales for 14 menu items, a current-stock inventory
snapshot, a recent waste history, and a few donations / notifications. The
**Charity** account can request the business's available donations. The **Admin**
account is API/docs only (no admin UI yet).

## Reset / reload the demo data

```bash
cd food_waste_management_backend
.venv/Scripts/python.exe -m scripts.seed_dev --reset
```

Regenerate the curated seed files from the raw dumps:

```bash
.venv/Scripts/python.exe -m scripts.generate_seed_data
```
"""


def _load(name: str):
    return json.loads((SEED_DIR / name).read_text())


def _dt(value: date) -> datetime:
    return datetime.combine(value, time.min, tzinfo=UTC)


def _date_shift(rows: list[dict]) -> timedelta:
    """Shift the seed series so its last day lands on today."""
    latest = max(date.fromisoformat(row["date"]) for row in rows)
    return date.today() - latest


async def ensure_default_users(database: AsyncIOMotorDatabase) -> None:
    for spec in DEFAULT_USERS:
        exists = await database.users.find_one(
            {"$or": [{"_id": spec["_id"]}, {"email": spec["email"]}]}
        )
        if exists:
            continue
        await database.users.insert_one(
            {
                **spec,
                "password_hash": hash_password(DEFAULT_PASSWORD),
                "verification_status": "VERIFIED",
                "created_at": datetime.now(UTC),
            }
        )
        logger.info("seed: created default %s account %s", spec["role"], spec["email"])


async def _seed_inventory(database: AsyncIOMotorDatabase) -> None:
    today = date.today()
    docs = []
    for row in _load("inventory.json"):
        purchase = today - timedelta(days=row["purchase_days_ago"])
        expiry = purchase + timedelta(days=row["shelf_life_days"])
        docs.append(
            {
                # inventory _id == food code so the frontend's selected item id
                # matches sales.food_item_id and the daily-series upsert dedupes.
                "_id": row["food_item_id"],
                "user_id": BUSINESS_ID,
                "food_item_id": row["food_item_id"],
                "food_name": row["food_name"],
                "category": row["category"],
                "quantity": row["quantity"],
                "unit": row["unit"],
                "purchase_date": _dt(purchase),
                "expiry_date": _dt(expiry),
                "storage_location": row["storage_location"],
                "unit_cost": row["unit_cost"],
                "created_at": datetime.now(UTC),
            }
        )
    await database.inventory.insert_many(docs)


async def _seed_sales(database: AsyncIOMotorDatabase) -> None:
    rows = _load("sales.json")
    shift = _date_shift(rows)
    now = datetime.now(UTC)
    docs = []
    for row in rows:
        day = date.fromisoformat(row["date"]) + shift
        prepared = float(row["quantity_prepared"])
        sold = float(row["quantity_sold"])
        iso = day.isocalendar()
        docs.append(
            {
                "_id": f"sale_seed_{row['food_item_id']}_{day.isoformat()}",
                "user_id": BUSINESS_ID,
                "food_item_id": row["food_item_id"],
                "food_name": row["food_name"],
                "date": _dt(day),
                "quantity_prepared": prepared,
                "quantity_sold": sold,
                "waste_quantity": float(row["waste_quantity"]),
                "unit": row["unit"],
                # derived temporal features (persisted for stable downstream use)
                "day_of_week": day.weekday(),
                "is_weekend": day.weekday() >= 5,
                "week_of_year": iso.week,
                "month": day.month,
                "sold_out": sold >= prepared,
                # nullable external-driver columns (captured going forward)
                "unit_price": None,
                "promotion": False,
                "customer_count": None,
                "meal_period": None,
                "weather": None,
                "temperature_c": None,
                "is_holiday": None,
                "status": "Logged",
                "created_at": now,
            }
        )
    await database.sales.insert_many(docs, ordered=False)


async def _seed_waste(database: AsyncIOMotorDatabase) -> None:
    rows = _load("waste.json")
    shift = _date_shift(rows)
    docs = []
    for index, row in enumerate(rows):
        day = date.fromisoformat(row["date"]) + shift
        docs.append(
            {
                "_id": f"waste_seed_{index}",
                "user_id": BUSINESS_ID,
                "food_item_id": row["food_item_id"],
                "food_name": row["food_name"],
                "quantity": float(row["quantity"]),
                "unit": row["unit"],
                "reason": row["reason"],
                "waste_stage": None,
                "financial_loss": float(row["financial_loss"]),
                "date": _dt(day),
                "created_at": _dt(day),
            }
        )
    await database.waste.insert_many(docs, ordered=False)


async def _seed_donations(database: AsyncIOMotorDatabase) -> None:
    now = datetime.now(UTC)
    today = date.today()
    donation_ids: list[str] = []
    for index, row in enumerate(_load("donations.json")):
        donation_id = f"don_seed_{index}"
        donation_ids.append(donation_id)
        await database.donations.insert_one(
            {
                "_id": donation_id,
                "donor_id": BUSINESS_ID,
                "donor_name": "Default Organization",
                "donor_phone": "+94112000001",
                "food_item_id": row["food_item_id"],
                "food_item_name": row["food_item_name"],
                "category": row["category"],
                "quantity": row["quantity"],
                "unit": row["unit"],
                "pickup_address": row["pickup_address"],
                "pickup_date": _dt(today + timedelta(days=row["pickup_days_from_now"])),
                "pickup_time": row["pickup_time"],
                "expiry_time": now + timedelta(hours=row["expiry_hours_from_now"]),
                "is_prepared": row["is_prepared"],
                "status": row["status"],
                "created_at": now,
            }
        )
    for index, row in enumerate(_load("donation_requests.json")):
        await database.donation_requests.insert_one(
            {
                "_id": f"req_seed_{index}",
                "donation_id": donation_ids[row["donation_index"]],
                "charity_id": CHARITY_ID,
                "charity_name": "Default Charity",
                "requested_quantity": row["requested_quantity"],
                "unit": row["unit"],
                "pickup_time": row["pickup_time"],
                "notes": row["notes"],
                "status": row["status"],
                "created_at": now,
            }
        )


async def _seed_notifications(database: AsyncIOMotorDatabase) -> None:
    now = datetime.now(UTC)
    docs = []
    for index, row in enumerate(_load("notifications.json")):
        docs.append(
            {
                "_id": f"not_seed_{index}",
                "user_id": BUSINESS_ID,
                "title": row["title"],
                "message": row["message"],
                "type": row["type"],
                "is_read": row["is_read"],
                "action_url": row["action_url"],
                "created_at": now - timedelta(days=row["days_ago"], minutes=index),
            }
        )
    await database.notifications.insert_many(docs)


async def ensure_seed_data(database: AsyncIOMotorDatabase) -> None:
    if await database.sales.count_documents({"user_id": BUSINESS_ID}):
        return
    await _seed_inventory(database)
    await _seed_sales(database)
    await _seed_waste(database)
    await _seed_donations(database)
    await _seed_notifications(database)
    logger.info("seed: curated demo dataset loaded for %s", BUSINESS_ID)


async def reset_default_org(database: AsyncIOMotorDatabase) -> None:
    ids = [BUSINESS_ID, CHARITY_ID, ADMIN_ID]
    await database.users.delete_many({"_id": {"$in": ids}})
    await database.inventory.delete_many({"user_id": BUSINESS_ID})
    await database.sales.delete_many({"user_id": BUSINESS_ID})
    await database.waste.delete_many({"user_id": BUSINESS_ID})
    await database.donations.delete_many({"donor_id": BUSINESS_ID})
    await database.donation_requests.delete_many({"charity_id": CHARITY_ID})
    await database.notifications.delete_many({"user_id": BUSINESS_ID})
    logger.info("seed: cleared default organization data")


def write_credentials_file() -> None:
    if CREDENTIALS_FILE.exists():
        return
    CREDENTIALS_FILE.write_text(CREDENTIALS_TEMPLATE, encoding="utf-8")
    logger.info("seed: wrote %s", CREDENTIALS_FILE)


async def bootstrap_dev_environment(database: AsyncIOMotorDatabase) -> None:
    await ensure_default_users(database)
    await ensure_seed_data(database)
    write_credentials_file()
