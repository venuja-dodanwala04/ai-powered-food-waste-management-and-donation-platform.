"""Offline generator: turn the raw Mongo export dumps into a small, clean,
LSTM-ready seed dataset committed under ``app/db/seed_data/``.

Run once (re-run only when you want to regenerate the curated files):

    cd food_waste_management_backend
    .venv\\Scripts\\python.exe -m scripts.generate_seed_data

The raw dumps in ``food_waste_management/*.json`` have an inconsistent schema
(role "restaurant", status "completed", every waste reason "Unsold",
``{"$date": ...}`` wrappers, ~10k rows/collection with gaps and duplicate
item-days).  This script:

* keeps the 14 known menu items,
* derives per-item / per-weekday demand statistics from the dump,
* emits a **gap-free one-row-per-(item, day)** daily series for ~365 days,
* derives an internally consistent waste series from that grid,
* emits a compact current-stock inventory snapshot + a handful of
  donations / donation requests / notifications.

Dates in the emitted files are relative markers -- the runtime loader
(``app/db/seed.py``) shifts the sales/waste series so it ends "today" and
materialises inventory / donation dates relative to the seed moment.
"""

from __future__ import annotations

import json
import random
import statistics
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
DUMP_DIR = BACKEND_ROOT / "food_waste_management"
OUT_DIR = BACKEND_ROOT / "app" / "db" / "seed_data"

SERIES_DAYS = 365
RNG = random.Random(20240101)

# Sensible category / unit / storage overrides (the dump's values are noise).
ITEM_META = {
    "Beef Rendang":        ("Prepared Food", "kg", "Refrigerator"),
    "Cendol":              ("Beverages",     "kg", "Refrigerator"),
    "Char Kway Teow":      ("Prepared Food", "kg", "Prepared Food Area"),
    "Chicken Chop":        ("Prepared Food", "kg", "Prepared Food Area"),
    "Chicken Rice":        ("Rice & Grains", "kg", "Prepared Food Area"),
    "Iced Lemon Tea":      ("Beverages",     "kg", "Refrigerator"),
    "Kaya Toast Set":      ("Bakery",        "kg", "Dry Storage"),
    "Laksa":               ("Prepared Food", "kg", "Prepared Food Area"),
    "Mushroom Soup":       ("Prepared Food", "kg", "Prepared Food Area"),
    "Nasi Lemak":          ("Rice & Grains", "kg", "Prepared Food Area"),
    "Roti Canai":          ("Bakery",        "kg", "Dry Storage"),
    "Spaghetti Carbonara": ("Prepared Food", "kg", "Prepared Food Area"),
    "Tandoori Chicken":    ("Prepared Food", "kg", "Refrigerator"),
    "Teh Tarik":           ("Beverages",     "kg", "Refrigerator"),
}

WASTE_REASONS = [
    ("Spoilage / Expired", 0.30),
    ("Overproduction", 0.34),
    ("Preparation Waste", 0.18),
    ("Quality Issue", 0.08),
    ("Storage Failure", 0.05),
    ("Damaged Product", 0.05),
]


def _load_dump(name: str):
    return json.loads((DUMP_DIR / f"food_waste_management.{name}.json").read_text())


def _num(value) -> float:
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, dict):
        value = value.get("$numberInt") or value.get("$numberDouble") or value.get("$numberLong") or 0
    return float(str(value).replace(",", "").strip() or 0)


def _unwrap_date(value) -> str:
    if isinstance(value, dict):
        return value.get("$date", "")[:10]
    return str(value)[:10]


def _weighted_reason() -> str:
    roll = RNG.random()
    cume = 0.0
    for reason, weight in WASTE_REASONS:
        cume += weight
        if roll <= cume:
            return reason
    return WASTE_REASONS[0][0]


def build() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    food_items = _load_dump("food_item_ids")
    id_by_name = {row["food_name"]: row["food_item_id"] for row in food_items}
    names = list(ITEM_META)

    sales_dump = _load_dump("sales")
    inv_dump = _load_dump("inventory")

    unit_cost = {}
    for row in inv_dump:
        unit_cost.setdefault(row["food_name"], round(_num(row["unit_cost"])))

    # ---- per-item demand statistics from the dump --------------------------------
    sold_by_item_day: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
    prep_ratio: dict[str, list[float]] = defaultdict(list)
    for row in sales_dump:
        name = row["food_name"]
        if name not in ITEM_META:
            continue
        day = _unwrap_date(row["date"])
        sold = _num(row["quantity_sold"])
        prepared = _num(row["quantity_prepared"])
        sold_by_item_day[name][day].append(sold)
        if sold > 0:
            prep_ratio[name].append(max(prepared, sold) / sold)

    weekday_factor: dict[str, list[float]] = {}
    item_mean: dict[str, float] = {}
    item_cv: dict[str, float] = {}
    for name in names:
        # the dump re-logs the same item-day up to ~9 times; average the
        # duplicates rather than summing so magnitudes stay realistic.
        daily_totals = {d: statistics.fmean(v) for d, v in sold_by_item_day[name].items()}
        values = list(daily_totals.values()) or [50.0]
        mean = statistics.fmean(values)
        item_mean[name] = mean
        item_cv[name] = (statistics.pstdev(values) / mean) if mean else 0.15
        buckets: dict[int, list[float]] = defaultdict(list)
        for day_str, total in daily_totals.items():
            wd = date.fromisoformat(day_str).weekday()
            buckets[wd].append(total / mean if mean else 1.0)
        weekday_factor[name] = [
            round(statistics.fmean(buckets[wd]), 4) if buckets.get(wd) else 1.0
            for wd in range(7)
        ]

    # ---- gap-free daily sales grid ---------------------------------------------
    start = date.today() - timedelta(days=SERIES_DAYS - 1)
    sales_rows: list[dict] = []
    waste_rows: list[dict] = []
    for name in names:
        fid = id_by_name.get(name, ITEM_META and f"FOOD-{name[:3].upper()}")
        base = item_mean[name]
        cv = min(max(item_cv[name], 0.06), 0.4)
        ratio = statistics.fmean(prep_ratio[name]) if prep_ratio[name] else 1.08
        ratio = min(max(ratio, 1.02), 1.25)
        for offset in range(SERIES_DAYS):
            day = start + timedelta(days=offset)
            wd = day.weekday()
            seasonal = 1.0 + 0.08 * (1 if day.month in (4, 12) else 0)
            noise = RNG.gauss(1.0, cv)
            demand = max(1.0, base * weekday_factor[name][wd] * seasonal * noise)
            prepared = round(demand * RNG.uniform(1.0, ratio), 1)
            sold = round(min(prepared, demand * RNG.uniform(0.9, 1.02)), 1)
            waste = round(max(0.0, prepared - sold), 1)
            sales_rows.append(
                {
                    "food_item_id": fid,
                    "food_name": name,
                    "unit": ITEM_META[name][1],
                    "date": day.isoformat(),
                    "quantity_prepared": prepared,
                    "quantity_sold": sold,
                    "waste_quantity": waste,
                }
            )
            # recent, non-trivial waste only -> keeps the waste collection small
            if waste >= 1.0 and offset >= SERIES_DAYS - 120:
                waste_rows.append(
                    {
                        "food_item_id": fid,
                        "food_name": name,
                        "unit": ITEM_META[name][1],
                        "date": day.isoformat(),
                        "quantity": waste,
                        "reason": _weighted_reason(),
                        "financial_loss": round(waste * unit_cost.get(name, 400)),
                    }
                )

    # ---- current-stock inventory snapshot ------------------------------------
    inventory_rows: list[dict] = []
    for idx, name in enumerate(names):
        category, unit, storage = ITEM_META[name]
        # a few short-dated items so Expiry / Dashboard alerts have content
        shelf_life = [1, 2, 3][idx] if idx < 3 else RNG.choice([4, 5, 6, 7, 10, 14])
        purchase_days_ago = RNG.choice([0, 1, 1, 2, 3])
        inventory_rows.append(
            {
                "food_item_id": id_by_name.get(name),
                "food_name": name,
                "category": category,
                "quantity": round(item_mean[name] * RNG.uniform(0.4, 1.3), 1),
                "unit": unit,
                "unit_cost": unit_cost.get(name, 400),
                "storage_location": storage,
                "purchase_days_ago": purchase_days_ago,
                "shelf_life_days": shelf_life,
            }
        )

    # ---- donations / requests / notifications ------------------------------
    donation_specs = [
        ("Nasi Lemak", 6.0, "Available", 1),
        ("Roti Canai", 12.0, "Available", 1),
        ("Chicken Rice", 8.5, "Available", 2),
        ("Kaya Toast Set", 4.0, "Available", 2),
        ("Laksa", 5.0, "Reserved", 1),
        ("Char Kway Teow", 7.5, "Reserved", 1),
        ("Beef Rendang", 3.0, "Collected", -1),
        ("Mushroom Soup", 9.0, "Collected", -2),
    ]
    donations_rows = []
    for name, qty, status, pickup_in in donation_specs:
        category, unit, _ = ITEM_META[name]
        donations_rows.append(
            {
                "food_item_id": id_by_name.get(name),
                "food_item_name": name,
                "category": category,
                "quantity": qty,
                "unit": unit,
                "pickup_address": "142 Peradeniya Rd, Kandy",
                "pickup_days_from_now": pickup_in,
                "pickup_time": "18:00-20:00",
                "expiry_hours_from_now": 8 if pickup_in >= 0 else -12,
                "is_prepared": True,
                "status": status,
            }
        )

    donation_requests_rows = [
        {"donation_index": 4, "requested_quantity": 5.0, "unit": "kg",
         "pickup_time": "18:00-20:00", "notes": "Can collect with refrigerated van.",
         "status": "Pending"},
        {"donation_index": 5, "requested_quantity": 7.5, "unit": "kg",
         "pickup_time": "18:30-19:30", "notes": "Serving evening meal program.",
         "status": "Accepted"},
        {"donation_index": 6, "requested_quantity": 3.0, "unit": "kg",
         "pickup_time": "12:00-13:00", "notes": "", "status": "Collected"},
        {"donation_index": 7, "requested_quantity": 9.0, "unit": "kg",
         "pickup_time": "11:00-12:00", "notes": "Weekly pickup.", "status": "Collected"},
    ]

    notifications_rows = [
        {"title": "Critical expiry", "message": "Beef Rendang expires within 24 hours.",
         "type": "EXPIRY", "is_read": False, "action_url": "/business/expiry", "days_ago": 0},
        {"title": "Critical expiry", "message": "Cendol expires within 48 hours.",
         "type": "EXPIRY", "is_read": False, "action_url": "/business/expiry", "days_ago": 0},
        {"title": "Surplus detected", "message": "Roti Canai prep exceeded sales by 12 kg today.",
         "type": "SYSTEM", "is_read": False, "action_url": "/business/waste", "days_ago": 0},
        {"title": "Donation reserved", "message": "A charity reserved 5.0 kg of Laksa.",
         "type": "DONATION_REQUEST", "is_read": False, "action_url": "/business/donation-requests", "days_ago": 1},
        {"title": "Donation collected", "message": "3.0 kg of Beef Rendang was collected.",
         "type": "DONATION_REQUEST", "is_read": True, "action_url": "/business/donation-requests", "days_ago": 1},
        {"title": "Weekly report ready", "message": "Your food-waste report for last week is available.",
         "type": "SYSTEM", "is_read": True, "action_url": "/business/reports", "days_ago": 2},
        {"title": "Donation request", "message": "New request for Char Kway Teow (7.5 kg).",
         "type": "DONATION_REQUEST", "is_read": True, "action_url": "/business/donation-requests", "days_ago": 3},
        {"title": "Low stock", "message": "Chicken Chop stock is below one day of demand.",
         "type": "SYSTEM", "is_read": True, "action_url": "/business/inventory", "days_ago": 4},
    ]

    _write("food_items.json", food_items)
    _write("inventory.json", inventory_rows)
    _write("sales.json", sales_rows)
    _write("waste.json", waste_rows)
    _write("donations.json", donations_rows)
    _write("donation_requests.json", donation_requests_rows)
    _write("notifications.json", notifications_rows)

    print(f"items={len(food_items)} inventory={len(inventory_rows)} "
          f"sales={len(sales_rows)} waste={len(waste_rows)} "
          f"donations={len(donations_rows)} requests={len(donation_requests_rows)} "
          f"notifications={len(notifications_rows)}")


def _write(name: str, payload) -> None:
    (OUT_DIR / name).write_text(json.dumps(payload, indent=1))


if __name__ == "__main__":
    build()
