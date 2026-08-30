# Missing Data Assessment — AI Features (LSTM Demand Prediction & Related)

**Scope:** data-collection check only. No implementation. Reviews whether the system
currently captures the data needed for:

1. AI food demand prediction
2. Smart food preparation
3. Demand trend & pattern analysis
4. Surplus food detection
5. AI-based inventory recommendation
6. Food waste prediction

**Verdict:** The system collects the *core transactional signals* (daily sales,
inventory, waste, forecasts) but **does not collect the data in the shape an LSTM
needs**, and is **missing every external / contextual driver** of demand. Roughly
50–60% of what is needed exists; the rest must be added before models can be
trained reliably.

> **Update — LSTM-ready write path implemented.** The P0 storage-shape gaps and the
> P1 nullable driver columns below are now handled in code (`app/models/schemas.py`,
> `app/api/routes/sales.py`, `app/db/seed.py`). Each sale is stored as **one
> canonical row per `(user, food_item, day)`** (upsert, unique index
> `sales_daily_series`) carrying persisted `day_of_week`, `is_weekend`,
> `week_of_year`, `month`, `sold_out`, plus **nullable** `unit_price`, `promotion`,
> `customer_count`, `meal_period`, `weather`, `temperature_c`, `is_holiday`.
> `waste` now stores an incident `date` and optional `waste_stage`. The external
> drivers still have to be *populated* (weather feed, holiday calendar, POS price /
> covers) — the schema just no longer blocks it. AI endpoints return **501** until
> the model ships. Everything in §3 P2/P3 (inventory ledger, recipe BOM, item
> master, multi-branch) is still outstanding.

---

## 1. What is collected today

Source: `food_waste_management_backend/app/models/schemas.py` and the seed data in
`food_waste_management_backend/food_waste_management/*.json`.

| Collection | Fields captured | Volume in seed data |
|---|---|---|
| `sales` | `food_item_id`, `food_name`, `date` (day only), `quantity_prepared`, `quantity_sold`, `waste_quantity`, `unit`, `status`, `created_at` | 10,000 rows, 2024‑01‑01 → 2025‑01‑01, 14 items, 1 business |
| `inventory` | `food_name`, `category`, `quantity`, `unit`, `purchase_date`, `expiry_date`, `storage_location`, `unit_cost` | 10,000 rows, same date span |
| `waste` | `food_name`, `quantity`, `unit`, `reason`, `financial_loss`, `created_at` | 10,000 rows; **every `reason` = "Unsold"** |
| `forecasts` | `food_name`, `forecast_date`, `current_stock`, `predicted_demand`, `recommended_preparation`, `unit`, `model` | 20 rows (baseline `historical-average`) |
| `donations` / `donation_requests` | food, qty, pickup address/date/time, expiry_time, status | 20 rows each |
| `users` | `name`, `email`, `phone`, `address`, `role`, `organization_name`, `verification_status` | 1 user |
| `notifications` | `title`, `message`, `type`, `is_read` | — |

Current forecast logic (`app/api/routes/forecasts.py`) is a plain historical
average of `quantity_sold`; `/forecasts/train` is a stub that returns
`"pending_data"`.

---

## 2. Data-readiness per AI feature

| Feature | Needs | Have now? | Gap |
|---|---|---|---|
| **1. AI food demand prediction (LSTM)** | Regular per-item daily time series of demand + calendar/weather/price context | ⚠️ Partial | Series is event-logged not daily-regular; no calendar/weather/price features; demand is censored on stockout days |
| **2. Smart food preparation** | Predicted demand + prep lead time, batch size, shelf life, meal-period split, sell-through history | ⚠️ Partial | Have `quantity_prepared` vs `quantity_sold`; missing item prep metadata and meal-period granularity |
| **3. Demand trend & pattern analysis** | Long, continuous history; day-of-week / seasonality / holiday / event labels | ⚠️ Partial | 1 year only; no holiday/event/season labels; gaps in series |
| **4. Surplus food detection** | Stock-on-hand over time vs forecast demand; expiry timeline; production vs sales | ⚠️ Partial | Inventory is never decremented by sales — no on-hand time series; no link between inventory batch and sales |
| **5. AI-based inventory recommendation** | Demand forecast + current stock + reorder lead time + supplier/pack size + shelf life + waste rate | ⚠️ Partial | Have `current_stock`, `unit_cost`; missing lead time, pack/min-order size, shelf life, per-item waste rate over time |
| **6. Food waste prediction** | Waste labelled by cause/stage/time, tied to production batch, plus the drivers that caused it | ❌ Weak | `reason` is a single constant ("Unsold"); no stage (prep/spoilage/plate), no batch link, no timestamp beyond day |

---

## 3. Missing data — grouped by priority

### P0 — blocks LSTM training

1. **Regular daily time series.** Data must be (or be resampled to) exactly one
   row per `(food_item, calendar_day)` with no gaps and no duplicates. Seed data
   has only 4,187 of 5,138 possible item‑day combinations, up to 9 rows for the
   same item‑day, and items like "Laksa" appear on only 237 of 367 days. LSTM
   input must be a fixed-interval sequence.
2. **Stockout / censoring flag.** When `quantity_sold ≈ quantity_prepared` (or the
   item sold out), true demand is unknown and higher than recorded. There is no
   `sold_out` / `stockout_time` field, so the model would learn suppressed demand.
3. **Calendar features / labels:** `day_of_week`, `is_weekend`, `month`,
   `week_of_year`, `is_public_holiday`, `is_festival`, `school_term`, `payday`,
   `is_closed`. The Forecast page has weather/holiday toggles, but they are
   client-side multipliers only (`ForecastPage.tsx`) — never persisted.
4. **Longer history.** ~1 year per item ≈ 240–370 usable points after
   regularizing — thin for a per-item LSTM. Need 2+ years, or a pooled/global
   model across items/branches. Only 1 business and 14 items exist today.

### P1 — external demand drivers (materially improve accuracy)

5. **Weather:** daily `temperature`, `rainfall_mm`, `condition`. Not stored.
6. **Footfall / covers:** number of customers, covers, transactions or
   reservations per day (and per meal period). Only `quantity_sold` exists — no
   traffic denominator, so per-capita demand can't be modelled.
7. **Menu & pricing:** `selling_price` per item per day, `on_menu` flag,
   `promotion` / `discount` / `combo` flags. Price and promo are primary demand
   drivers and are completely absent.
8. **Local events:** festivals, sports events, nearby conferences, holidays
   specific to the location.
9. **Meal-period / time-of-day:** breakfast / lunch / dinner / service split.
   Everything is day-level only (`date` has no time component).

### P2 — needed for prep, inventory & waste features (not demand LSTM itself)

10. **Item master / metadata:** `shelf_life_days`, `prep_lead_time`,
    `batch_size` / `min_prep_qty`, `perishability_class`, `is_prepared_dish` vs
    raw ingredient, `recipe_id`. Needed for Smart Preparation and Inventory
    Recommendation.
11. **Recipe → ingredient mapping (BOM).** `Recipe` / `RecipeIngredient` types
    exist in `frontend/src/types/index.ts` but there is no backend model, no
    endpoint, and no data. Without it, a prepared-dish forecast can't be turned
    into raw-ingredient purchase recommendations.
12. **Inventory movement ledger.** Inventory is insert-only; it is never reduced
    when sales/waste happen. No `stock_on_hand` time series, no
    receiving/consumption/adjustment events, no supplier, no reorder lead time,
    no pack size. Surplus detection and reorder recommendations need this.
13. **Production/prep log.** `quantity_prepared` rides on the sales row. There is
    no separate planned-vs-actual production record, batch timestamp, or
    prep-time, so "was surplus caused by over-production or low turnout?" cannot
    be answered.
14. **Waste granularity.** Add `waste_stage` (pre-service prep trim / spoilage /
    expired / plate waste / storage failure), event `timestamp`, `batch_id` /
    `inventory_id` link, and `disposition` (bin / compost / donation). The
    frontend `WasteReason` enum already lists richer reasons than the backend
    stores.

### P3 — data quality issues in current capture

15. `users.json` seed has `password_hash` as an integer and `phone` as an
    integer; backend `UserCreate` has no `business_type` although the frontend
    `User` type does. Business type (Restaurant / Hotel / Bakery / Catering)
    is a useful model feature and is dropped on the backend.
16. `sales.status` values in seed (`"completed"`) don't match the enum the code
    writes (`"Logged"`, `"Sold Out"`) or the frontend (`Logged` / `Donated` /
    `Wasted` / `Sold Out`) — inconsistent labelling.
17. No `branch_id` / location on transactional records — all rows are one
    `user_id`. Multi-branch businesses can't be modelled or pooled.
18. Timezone: `date` stored as UTC midnight `datetime`; day boundaries for a
    Sri Lanka business (LKR pricing) may shift.

---

## 4. What can be derived now — no new collection needed

From the existing `sales` + `inventory` data you can already engineer:

- **Calendar features:** `day_of_week`, `is_weekend`, `month`, `week_of_year`,
  `day_of_year`, cyclical sin/cos encodings — all from `sales.date`.
- **Lag & window features on `quantity_sold`:** lag‑1/7/14, rolling
  mean/std/min/max over 7/14/28 days, expanding mean, last-4-same-weekday mean.
- **Sell-through rate** = `quantity_sold / quantity_prepared`.
- **Waste rate** = `waste_quantity / quantity_prepared`; **over-production** =
  `quantity_prepared − quantity_sold`.
- **Likely-stockout heuristic** (proxy until a real flag exists):
  `quantity_sold >= 0.98 * quantity_prepared`.
- **Expiry risk** = `expiry_date − today` bucketed (already done in
  `inventory.py::inventory_status`).
- **Financial loss per item / per reason** (already aggregated in
  `waste.py::/analytics/reasons`).
- **Surplus proxy** = `inventory.quantity` (or `forecasts.current_stock`) minus
  rolling-mean demand for the item.
- **Trend / seasonality decomposition** (STL) per item for the trend & pattern
  feature — 1 year is just enough for weekly seasonality, not annual.

These let you build a first LSTM baseline on `quantity_sold` while the P0/P1
gaps are being closed.

---

## 5. LSTM-specific data requirements

| Requirement | Status | Action |
|---|---|---|
| One target series per item, fixed daily interval, no gaps | ❌ | Resample/aggregate `sales` to `(food_item_id, date)` → `sum(quantity_sold)`; fill missing days with 0 **and** a `was_open`/`on_menu` mask |
| Target definition | ⚠️ | Decide: raw `quantity_sold` vs censor-corrected demand vs `quantity_prepared` when sold out. Add stockout flag to enable this |
| Minimum history / sequence length | ⚠️ | ~52 weeks available. Use lookback ≤ 28–56 days; prefer a **global** model over all items (and branches, once present) rather than 14 tiny per-item models |
| Exogenous inputs aligned to each day | ❌ | Add weather, holiday, price, promo, footfall as parallel daily series (P1 list) |
| Normalization inputs | ✅ (derivable) | Per-item scaling stats from history |
| Train/val/test split without leakage | ✅ | Time-ordered split on `date` (last N weeks = test) |
| Multiple entities for generalization | ❌ | Only 1 business, 14 items. Add `branch_id`; onboard more businesses/items |

---

## 6. Recommended additions (data only — implementation later)

**New fields on `sales` (or a new `daily_demand` collection):**
`branch_id`, `meal_period`, `sold_out` (bool), `stockout_time`, `on_menu` (bool),
`selling_price`, `promotion_flag`, `covers`/`customer_count`.

**New `context_daily` collection** keyed by `(branch_id, date)`:
`temp_avg`, `rainfall_mm`, `weather_condition`, `is_public_holiday`,
`holiday_name`, `is_festival`, `local_event`, `is_closed`.

**New `item_master` collection:** `food_item_id`, `category`, `shelf_life_days`,
`prep_lead_time_hours`, `batch_size`, `min_order_qty`, `supplier_id`,
`reorder_lead_time_days`, `perishability_class`, `recipe_id`.

**New `inventory_movements` collection:** `inventory_id`, `food_item_id`,
`type` (receive / consume / waste / adjust), `quantity`, `timestamp`,
`unit_cost`, `batch_id` — so stock-on-hand is reconstructable over time.

**Extend `waste`:** `waste_stage`, `timestamp`, `batch_id`/`inventory_id`,
`disposition`, plus keep the richer `reason` set the frontend already defines.

**Extend `users`:** persist `business_type`, add `branch_id` / locations.

---

## 7. Quick wins / suggested order

1. Add `sold_out` + `on_menu` flags to sales capture (unblocks correct LSTM target).
2. Add a daily `context_daily` feed (holiday calendar first — free; weather next).
3. Regularize sales into a clean `(item, day)` series job (can be a view/ETL).
4. Capture `selling_price` and `promotion_flag` on the sales form.
5. Add `item_master` (shelf life, lead time, batch size) — small, high value for
   features 2 & 5.
6. Introduce `inventory_movements` so surplus/reorder logic has a real
   stock-on-hand history.
7. Backfill `branch_id` and onboard more history for a pooled model.
