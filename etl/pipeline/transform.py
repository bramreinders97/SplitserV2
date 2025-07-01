"""Code to transform raw input to financial balance."""

from collections import defaultdict
from datetime import date
from typing import Dict, List, Optional, Tuple, Union


def _filter_unexported(entries: List[Dict]) -> List[Dict]:
    """Filters entries where 'exported' is equal to '0'."""
    return [e for e in entries if e.get("exported") == "0"]


def _parse_float(value: Optional[str]) -> float:
    """Parses a string into a float. Returns 0.0 if parsing fails."""
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0


def _compute_kilometers(rides: List[Dict]) -> Dict[str, float]:
    """Aggregates total kilometers driven per driver."""
    km = defaultdict(float)
    for ride in rides:
        driver = ride.get("driver")
        distance = _parse_float(ride.get("distance"))
        if driver:
            km[driver] += distance
    return dict(km)


def _compute_expenses(expenses: List[Dict]) -> Dict[str, float]:
    """Aggregates total amount paid per payer."""
    amounts = defaultdict(float)
    for expense in expenses:
        payer = expense.get("payer")
        amount = _parse_float(expense.get("amount"))
        if payer:
            amounts[payer] += amount
    return dict(amounts)


def _compute_balances(
    km: Dict[str, float], expenses: Dict[str, float]
) -> Dict[str, float]:
    """Computes financial balance per person, based on km share and payments.

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


def _determine_transfer(balances: Dict[str, float]) -> Tuple[str, str, float]:
    """Calculates the required money transfer to equalize expense contributions.

    Assumes exactly two participants: 'Bram' and 'Anne'.
    Uses the difference in their balances to compute a single transfer that resolves the imbalance.
    Transfers only half the difference, as that suffices to balance both parties.

    Returns:
        debtor (str): person who must send money
        creditor (str): person who must receive money
        amount (float): amount to transfer to balance accounts (always positive)
    """
    bram_balance = balances.get("Bram", 0.0)
    anne_balance = balances.get("Anne", 0.0)

    difference = round((bram_balance - anne_balance) / 2, 2)

    if difference > 0:
        return "Anne", "Bram", abs(difference)
    else:
        return "Bram", "Anne", abs(difference)


def _create_description_message(
    km: Dict[str, float],
    expenses: Dict[str, float],
    balances: Dict[str, float],
    debtor: str,
    creditor: str,
    amount: float,
) -> str:
    """Constructs a detailed textual summary of the financial computation.

    Includes:
    - Total kilometers and total expenses
    - Cost per kilometer with full precision
    - Individual breakdowns: kilometers driven, expected payment, actual payment, balance
    - Final transfer required to balance contributions

    Args:
        km: Dictionary of kilometers driven per person
        expenses: Dictionary of amounts paid per person
        balances: Dictionary of financial balances per person
        debtor: Name of the person who must transfer money
        creditor: Name of the person receiving the transfer
        amount: Exact amount to be transferred

    Returns:
        A string description with all key values and derived computations
    """
    total_km = sum(km.values())
    total_exp = sum(expenses.values())
    cost_per_km = total_exp / total_km if total_km > 0 else 0.0

    bram_km = km.get("Bram", 0.0)
    anne_km = km.get("Anne", 0.0)
    bram_paid = expenses.get("Bram", 0.0)
    anne_paid = expenses.get("Anne", 0.0)

    bram_should_pay = bram_km * cost_per_km
    anne_should_pay = anne_km * cost_per_km

    desc_lines = [
        f"Export {date.today():%b} {date.today().day}",
        f"KM: {round(total_km, 1)}, €: {round(total_exp, 2)}, €/km: {round(cost_per_km, 4)}",
        f"B: {bram_km}km → €{round(bram_should_pay, 2)} | paid €{round(bram_paid, 2)}",
        f"A: {anne_km}km → €{round(anne_should_pay, 2)} | paid €{round(anne_paid, 2)}",
        f"{debtor}→{creditor} €{amount}" if amount > 0 else "No transfer"
    ]
    return "\n".join(desc_lines)


def transform_data(
    all_rides: List[Dict], all_expenses: List[Dict]
) -> Dict[str, Union[bool, float, str, None]]:
    """Orchestrates the transformation pipeline.

    Returns a dictionary with transfer info, export flag, and description.
    """
    unexported_rides = _filter_unexported(all_rides)
    unexported_expenses = _filter_unexported(all_expenses)

    if not unexported_rides or not unexported_expenses:
        return {
            "balance_to_export": False,
            "payer": None,
            "receiver": None,
            "amount": 0.0,
            "description": "No unexported rides or expenses found.",
        }

    km = _compute_kilometers(unexported_rides)
    expenses = _compute_expenses(unexported_expenses)
    balances = _compute_balances(km, expenses)
    debtor, creditor, amount = _determine_transfer(balances)

    should_export = amount > 0.0

    return {
        "balance_to_export": should_export,
        "payer": debtor if should_export else None,
        "receiver": creditor if should_export else None,
        "amount": amount if should_export else 0.0,
        "description": (
            _create_description_message(
                km, expenses, balances, debtor, creditor, amount
            )
            if should_export
            else None
        ),
    }
