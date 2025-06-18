import requests

BASE_URL = "https://amsterbram.eu/api"

def fetch_endpoint(endpoint: str) -> list:
    url = f"{BASE_URL}/{endpoint}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return []
    except ValueError:
        print(f"Invalid JSON received from {url}")
        return []

def fetch_all_expenses() -> list:
    return fetch_endpoint("all_expenses")

def fetch_all_rides() -> list:
    return fetch_endpoint("all_rides")
