from collections import defaultdict
from typing import List, Dict, Tuple, Optional


def filter_unexported(entries: List[Dict]) -> List[Dict]:
    """Filters entries where 'exported' is equal to '0'."""
    return [e for e in entries if e.get('exported') == '0']


def parse_float(value: Optional[str]) -> float:
    """Parses a string into a float. Returns 0.0 if parsing fails."""
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0


def compute_kilometers(rides: List[Dict]) -> Dict[str, float]:
    """Aggregates total kilometers driven per driver."""
    km = defaultdict(float)
    for ride in rides:
        driver = ride.get("driver")
        distance = parse_float(ride.get("distance"))
        if driver:
            km[driver] += distance
    return dict(km)


def compute_expenses(expenses: List[Dict]) -> Dict[str, float]:
    """Aggregates total amount paid per payer."""
    amounts = defaultdict(float)
    for expense in expenses:
        payer = expense.get("payer")
        amount = parse_float(expense.get("amount"))
        if payer:
            amounts[payer] += amount
    return dict(amounts)


def compute_balances(
    km: Dict[str, float], expenses: Dict[str, float]
) -> Dict[str, float]:
    """
    Computes financial balance per person, based on km share and payments.
    Positive balance means overpaid, negative means underpaid.
    Assumes fair distribution of costs based on distance driven.
    """
    total_km = sum(km.values())
    total_expenses = sum(expenses.values())
    cost_per_km = total_expenses / total_km if total_km > 0 else 0.0

    balances = {}
    for person in ["Bram", "Anne"]:
        driven_km = km.get(person, 0.0)
        paid = expenses.get(person, 0.0)
        should_pay = driven_km * cost_per_km
        balances[person] = round(paid - should_pay, 2)
    return balances


def determine_transfer(balances: Dict[str, float]) -> Tuple[str, str, float]:
    """
    Calculates the required money transfer to equalize expense contributions.

    Assumes exactly two participants: 'Bram' and 'Anne'.
    Uses the difference in their balances to compute a single transfer that resolves the imbalance.
    Transfers only half the difference, as that suffices to balance both parties.

    Returns:
        payer (str): person who must send money
        receiver (str): person who must receive money
        amount (float): amount to transfer to balance accounts (always positive)
    """
    bram_balance = balances.get("Bram", 0.0)
    anne_balance = balances.get("Anne", 0.0)

    difference = round((bram_balance - anne_balance) / 2, 2)

    if difference > 0:
        return "Anne", "Bram", abs(difference)
    else:
        return "Bram", "Anne", abs(difference)


def transform_data(
    all_rides: List[Dict], all_expenses: List[Dict]
) -> Dict[str, object]:
    """
    Orchestrates the transformation pipeline.
    Returns a dictionary with transfer info and export flag.
    """
    unexported_rides = filter_unexported(all_rides)
    unexported_expenses = filter_unexported(all_expenses)

    if not unexported_rides or not unexported_expenses:
        return {
            "balance_to_export": False,
            "payer": None,
            "receiver": None,
            "amount": 0.0,
        }

    km = compute_kilometers(unexported_rides)
    expenses = compute_expenses(unexported_expenses)
    balances = compute_balances(km, expenses)
    payer, receiver, amount = determine_transfer(balances)

    return {
        "balance_to_export": True,
        "payer": payer,
        "receiver": receiver,
        "amount": amount,
    }
