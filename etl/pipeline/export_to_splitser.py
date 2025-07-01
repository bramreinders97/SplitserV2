"""Code for exporting financial balance to Splitwise."""

import logging
from typing import Dict, Union

from constants import (
    SPLITWISE_ACCESS_TOKEN,
    SPLITWISE_ACCESS_TOKEN_SECRET,
    SPLITWISE_CONSUMER_KEY,
    SPLITWISE_CONSUMER_SECRET,
    SPLITWISE_GROUP_ID,
    SPLITWISE_USER_ID_ANNE,
    SPLITWISE_USER_ID_BRAM,
)
from splitwise import Splitwise
from splitwise.exception import SplitwiseException
from splitwise.expense import Expense
from splitwise.expense import ExpenseUser as User

logging.basicConfig(level=logging.INFO)


def get_authenticated_splitwise() -> Splitwise:
    """Authenticates and returns a Splitwise client using OAuth credentials.

    Returns:
        Splitwise: Authenticated Splitwise API client
    """
    logging.info("Setting up Splitwise API client...")
    client = Splitwise(SPLITWISE_CONSUMER_KEY, SPLITWISE_CONSUMER_SECRET)
    client.setAccessToken(
        {
            "oauth_token": SPLITWISE_ACCESS_TOKEN,
            "oauth_token_secret": SPLITWISE_ACCESS_TOKEN_SECRET,
        }
    )
    logging.info("Splitwise client authenticated.")
    return client


def validate_balance_data(balance_result: Dict[str, Union[float, str]]) -> None:
    """Validates the balance_result dictionary for required keys and expected values.

    Args:
        balance_result (Dict[str, Union[float, str]]): Dictionary containing balance transfer data

    Raises:
        ValueError: If required fields are missing or contain invalid values
    """
    logging.info("Validating balance result data...")
    if not balance_result.get("balance_to_export"):
        raise ValueError("No balance to export")
    if balance_result.get("payer") not in ("Bram", "Anne"):
        raise ValueError("Invalid payer")
    if balance_result.get("receiver") not in ("Bram", "Anne"):
        raise ValueError("Invalid receiver")
    if balance_result.get("amount", 0) <= 0:
        raise ValueError("Amount must be positive")


def resolve_user_ids(payer: str, receiver: str) -> Dict[str, int]:
    """Maps the given payer and receiver names to their corresponding Splitwise user IDs.

    Args:
        payer (str): Name of the user who owes money
        receiver (str): Name of the user who is owed money

    Returns:
        Dict[str, int]: Dictionary with keys 'debtor_id' and 'creditor_id'
    """
    logging.info(f"Resolving user IDs for {payer} and {receiver}")
    return {
        "debtor_id": (
            int(SPLITWISE_USER_ID_BRAM)
            if payer == "Bram"
            else int(SPLITWISE_USER_ID_ANNE)
        ),
        "creditor_id": (
            int(SPLITWISE_USER_ID_BRAM)
            if receiver == "Bram"
            else int(SPLITWISE_USER_ID_ANNE)
        ),
    }


def build_expense(
    group_id: int, amount: float, description: str, creditor_id: int, debtor_id: int
) -> Expense:
    """Constructs a Splitwise Expense object representing a debt from debtor to creditor.

    Args:
        group_id (int): ID of the Splitwise group
        amount (float): Amount to be settled
        description (str): Description of the expense
        creditor_id (int): Splitwise user ID of the payer
        debtor_id (int): Splitwise user ID of the ower

    Returns:
        Expense: Configured Splitwise expense object
    """
    logging.info("Building expense...")
    expense = Expense()
    expense.setCost(str(amount))
    expense.setDescription(description)
    expense.setGroupId(group_id)

    payer_user = User()
    payer_user.setId(creditor_id)
    payer_user.setPaidShare(str(amount))
    payer_user.setOwedShare("0.00")

    receiver_user = User()
    receiver_user.setId(debtor_id)
    receiver_user.setPaidShare("0.00")
    receiver_user.setOwedShare(str(amount))

    expense.setUsers([payer_user, receiver_user])
    return expense


def post_balance_to_splitwise(
    balance_result: Dict[str, Union[float, str]], splitwise: Splitwise
) -> bool:
    """Posts a financial balance as a Splitwise expense based on input data.

    Args:
        balance_result (Dict[str, Union[float, str]]): Dictionary from transform_data() containing:
            - 'payer': person who owes
            - 'receiver': person who is owed
            - 'amount': amount to be paid
            - 'description': (optional) description of the transaction
            - 'balance_to_export': bool value indicating whether export is desired
        splitwise (Splitwise): Authenticated Splitwise client

    Returns:
        bool: Whether the balance is successfully exported.
    """
    if not balance_result.get("balance_to_export"):
        logging.info("No balance to export.")
        return

    validate_balance_data(balance_result)

    payer = balance_result["payer"]
    receiver = balance_result["receiver"]
    amount = balance_result["amount"]
    description = balance_result.get("description", "Auto-settlement from pipeline")
    group_id = int(SPLITWISE_GROUP_ID)

    ids = resolve_user_ids(payer, receiver)
    expense = build_expense(
        group_id, amount, description, ids["creditor_id"], ids["debtor_id"]
    )

    logging.info(f"Posting expense: {payer} owes €{amount} to {receiver}")

    _, error = splitwise.createExpense(expense)

    if error:
        logging.error(f"Splitwise API error: {error.getErrors()}")
    else:
        logging.info("Expense posted successfully to Splitwise.")

    return error is not None