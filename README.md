# EcoKitchen AI Backend

FastAPI and MongoDB API foundation for food inventory, sales, waste tracking, demand forecasts, donations, notifications, reports, and charity discovery.

## Run backend locally

1. Create a virtual environment: `python -m venv .venv`
2. Activate it in PowerShell: `.\.venv\Scripts\Activate.ps1`
3. Install packages: `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and set `JWT_SECRET_KEY`.
5. Start MongoDB, then run: `uvicorn app.main:app --reload`

The interactive API documentation is available at `http://127.0.0.1:8000/docs` and OpenAPI JSON at `/openapi.json`.


## Run Frontend

1. Run `npm run dev` in `food_waste_management_frontend`

## Default test environment

When the backend starts with `ENVIRONMENT` unset / empty / anything other than
`production`, it auto-creates three default accounts plus a curated, LSTM-ready
demo dataset for a "Default Organization" and writes the logins to
[`credentials.md`](credentials.md) in the repo root. Re-seed anytime with:

```bash
cd food_waste_management_backend
.venv/Scripts/python.exe -m scripts.seed_dev --reset
```

Regenerate the curated seed files from the raw dumps with
`python -m scripts.generate_seed_data`.

## API areas

`/api/v1/auth`, `/users`, `/inventory`, `/sales`, `/waste`, `/forecasts` (501 —
not implemented yet), `/donations`, `/notifications`, `/reports`, and `/charities`.

## Data needed for real forecasting

Sales are already persisted one row per `(food_item, day)` with `day_of_week`,
`is_weekend`, `week_of_year`, `month` and a `sold_out` flag, plus nullable
columns for the external drivers an LSTM needs (`unit_price`, `promotion`,
`customer_count`, `meal_period`, `weather`, `temperature_c`, `is_holiday`).
See [`missingdata.md`](missingdata.md) for the full gap analysis and what still
needs to be collected before a model can be trained reliably.

