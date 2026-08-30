"""Manually (re)seed the default development organization.

    cd food_waste_management_backend
    .venv/Scripts/python.exe -m scripts.seed_dev            # ensure users + demo data
    .venv/Scripts/python.exe -m scripts.seed_dev --reset    # wipe default org, then reload

Honours the same MongoDB settings as the app (``app/core/config.py`` / ``.env``).
"""

from __future__ import annotations

import argparse
import asyncio
import logging

from app.db.mongodb import mongodb
from app.db.seed import bootstrap_dev_environment, reset_default_org


async def _run(reset: bool) -> None:
    await mongodb.connect()
    database = mongodb.database()
    try:
        if reset:
            await reset_default_org(database)
        await bootstrap_dev_environment(database)
        counts = {
            name: await database[name].count_documents({})
            for name in ("users", "inventory", "sales", "waste", "donations", "donation_requests", "notifications")
        }
        print("seed complete:", counts)
    finally:
        await mongodb.close()


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    parser = argparse.ArgumentParser(description="Seed the default development organization.")
    parser.add_argument("--reset", action="store_true", help="Delete the default org's data before reseeding.")
    args = parser.parse_args()
    asyncio.run(_run(args.reset))


if __name__ == "__main__":
    main()
