from typing import Dict, Union
from splitwise import Splitwise
from splitwise.expense import Expense, ExpenseUser as User

from constants import (
    SPLITWISE_CONSUMER_KEY,
    SPLITWISE_CONSUMER_SECRET,
    SPLITWISE_ACCESS_TOKEN,
    SPLITWISE_ACCESS_TOKEN_SECRET,
    SPLITWISE_GROUP_ID,
    SPLITWISE_USER_ID_BRAM,
    SPLITWISE_USER_ID_ANNE,
)


def get_authenticated_splitwise() -> Splitwise:
    """Authenticates and returns a Splitwise client using OAuth credentials.

    Returns:
        Splitwise: Authenticated Splitwise API client
    """
    splitwise_api_client = Splitwise(SPLITWISE_CONSUMER_KEY, SPLITWISE_CONSUMER_SECRET)
    splitwise_api_client.setAccessToken({
        "oauth_token": SPLITWISE_ACCESS_TOKEN,
        "oauth_token_secret": SPLITWISE_ACCESS_TOKEN_SECRET
    })
    return splitwise_api_client


def validate_balance_data(balance_result: Dict[str, Union[float, str]]) -> None:
    """Validates the balance_result dictionary for required keys and expected values.

    Args:
        balance_result (Dict[str, Union[float, str]]): Dictionary containing balance transfer data

    Raises:
        ValueError: If required fields are missing or contain invalid values
    """
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
    bram_id = int(SPLITWISE_USER_ID_BRAM)
    anne_id = int(SPLITWISE_USER_ID_ANNE)

    return {
        "debtor_id": bram_id if payer == "Bram" else anne_id,
        "creditor_id": bram_id if receiver == "Bram" else anne_id
    }


def build_expense(group_id: int, amount: float, description: str, creditor_id: int, debtor_id: int) -> Expense:
    """
    Constructs a Splitwise Expense object representing a debt from debtor to creditor.

    Args:
        group_id (int): ID of the Splitwise group
        amount (float): Amount to be settled
        description (str): Description of the expense
        creditor_id (int): Splitwise user ID of the payer
        debtor_id (int): Splitwise user ID of the ower

    Returns:
        Expense: Configured Splitwise expense object
    """
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


def post_balance_to_splitwise(balance_result: Dict[str, Union[float, str]], splitwise: Splitwise) -> None:
    """
    Posts a financial balance as a Splitwise expense based on input data.

    Args:
        balance_result (Dict[str, Union[float, str]]): Dictionary from transform_data() containing:
            - 'payer': person who owes
            - 'receiver': person who is owed
            - 'amount': amount to be paid
            - 'description': (optional) description of the transaction
            - 'balance_to_export': bool value indicating whether export is desired
        splitwise (Splitwise): Authenticated Splitwise client
    """
    if not balance_result.get("balance_to_export"):
        return

    validate_balance_data(balance_result)

    payer = balance_result["payer"]
    receiver = balance_result["receiver"]
    amount = balance_result["amount"]
    description = balance_result.get("description", "Auto-settlement from pipeline")
    group_id = int(SPLITWISE_GROUP_ID)

    ids = resolve_user_ids(payer, receiver)
    expense = build_expense(group_id, amount, description, ids["creditor_id"], ids["debtor_id"])

    print(f"Posting expense: {payer} owes €{amount} to {receiver} in group {group_id}")
    splitwise.createExpense(expense)
