# Default test credentials

These accounts and their demo data are **auto-created on startup** whenever the
backend runs with `ENVIRONMENT` unset / empty / anything other than `production`.
They do **not** exist in a production deployment.

| Role     | Email                        | Password           |
|----------|------------------------------|--------------------|
| Business | `business@ecokitchen.local`  | `Ecokitchen#2024` |
| Charity  | `charity@ecokitchen.local`   | `Ecokitchen#2024` |
| Admin    | `admin@ecokitchen.local`     | `Ecokitchen#2024` |

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
