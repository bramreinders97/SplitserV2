"""Main functionality which controls the pipeline."""

import logging

from api_handler import fetch_all_expenses, fetch_all_rides, mark_all_exported
from export_to_splitser import get_authenticated_splitwise, post_balance_to_splitwise
from transform import transform_data

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)

logging.info("Start fetching data...")

all_rides = fetch_all_rides()
all_expenses = fetch_all_expenses()

logging.info("Transforming data...")

balance_result = transform_data(all_rides=all_rides, all_expenses=all_expenses)

logging.info(f"Balance results: {balance_result}")

if balance_result.get("balance_to_export"):
    splitwise = get_authenticated_splitwise()
    if post_balance_to_splitwise(balance_result, splitwise):
        mark_all_exported()
else:
    logging.info("No balance to export.")
