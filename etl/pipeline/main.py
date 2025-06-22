from transform import transform_data
from export_to_splitser import get_authenticated_splitwise, post_balance_to_splitwise
from api_handler import fetch_all_rides, fetch_all_expenses, mark_all_exported
import logging


# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

logging.info("Start fetching data...")

all_rides = fetch_all_rides()
all_expenses = fetch_all_expenses()

logging.info("Transforming data...")

balance_result = transform_data(
    all_rides=all_rides,
    all_expenses=all_expenses
)

print("Balance Result:")
print(balance_result)

if balance_result.get("balance_to_export"):
    splitwise = get_authenticated_splitwise()
    if post_balance_to_splitwise(balance_result, splitwise):
        mark_all_exported()
else:
    logging.info("No balance to export.")
