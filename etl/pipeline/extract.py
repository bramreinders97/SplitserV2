import requests
import logging

logging.basicConfig(level=logging.INFO)
BASE_URL = "https://amsterbram.eu/api"

def fetch_endpoint(endpoint: str) -> list:
    url = f"{BASE_URL}/{endpoint}"
    try:
        logging.info(f"Fetching data from {endpoint}")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        logging.info(f"Successfully fetched {len(data)} items from {endpoint}")
        return data
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching {url}: {e}")
        return []
    except ValueError:
        logging.error(f"Invalid JSON received from {url}")
        return []

def fetch_all_expenses() -> list:
    return fetch_endpoint("all_expenses")

def fetch_all_rides() -> list:
    return fetch_endpoint("all_rides")
