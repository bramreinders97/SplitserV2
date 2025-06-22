"""Code for communication with API."""

import logging
from typing import Any

import requests
from constants import API_ACCESS_TOKEN, BASE_URL

logging.basicConfig(level=logging.INFO)


def perform_request(method: str, endpoint: str, **kwargs: Any) -> dict:
    """Sends an HTTP request to the specified endpoint and returns parsed JSON response.

    Args:
        method (str): HTTP method ('get', 'post', etc.).
        endpoint (str): Relative API endpoint.
        **kwargs (Any): Optional arguments passed to requests.request.

    Returns:
        dict: Parsed JSON response, or empty dict on error.
    """
    url = f"{BASE_URL}/{endpoint}"
    headers = kwargs.pop("headers", {})
    headers["X-Access-Token"] = API_ACCESS_TOKEN

    try:
        logging.info(f"{method.upper()} request to {endpoint}")
        response = requests.request(method, url, headers=headers, timeout=10, **kwargs)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(f"Error during {method.upper()} request to {url}: {e}")
        return {}
    except ValueError:
        logging.error(f"Invalid JSON received from {url}")
        return {}


def fetch_endpoint(endpoint: str) -> list:
    """Retrieves a list of items from the given API endpoint.

    Args:
        endpoint (str): Relative API endpoint returning a JSON list.

    Returns:
        list: Parsed list from the response, or empty list on error.
    """
    data = perform_request("get", endpoint)
    if isinstance(data, list):
        logging.info(f"Successfully fetched {len(data)} items from {endpoint}")
        return data
    logging.error(f"Expected list from {endpoint}, got {type(data)}")
    return []


def fetch_all_expenses() -> list:
    """Fetches all expenses from the backend API.

    Returns:
        list: List of expense records.
    """
    return fetch_endpoint("all_expenses")


def fetch_all_rides() -> list:
    """Fetches all ride entries from the backend API.

    Returns:
        list: List of ride records.
    """
    return fetch_endpoint("all_rides")


def mark_all_exported() -> bool:
    """Sends a POST request to mark all unexported rides and expenses as exported.

    Returns:
        bool: True if operation succeeded, False otherwise.
    """
    data = perform_request("post", "mark_exported")
    if data.get("success"):
        logging.info("Successfully marked all items as exported")
        return True
    logging.error(f"Unexpected response from mark_exported: {data}")
    return False
