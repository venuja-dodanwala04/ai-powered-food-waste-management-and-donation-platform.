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

1. Run `npm run dev` in folder

## API areas

`/api/v1/auth`, `/users`, `/inventory`, `/sales`, `/waste`, `/forecasts`, `/donations`, `/notifications`, `/reports`, and `/charities`.

## Data needed for real forecasting

Provide a CSV with at least `date`, `food_name`, `quantity_sold`, and ideally `quantity_prepared`, `waste_quantity`, `holiday`, and `price`. Historical daily data for each food item is needed before a Prophet/scikit-learn model can be trained reliably.

