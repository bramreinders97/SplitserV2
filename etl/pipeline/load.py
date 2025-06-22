from typing import Dict
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
    """
    Initializes and returns an authenticated Splitwise client using credentials from constants.

    Returns:
        Splitwise: authenticated client
    """
    s = Splitwise(SPLITWISE_CONSUMER_KEY, SPLITWISE_CONSUMER_SECRET)
    s.setAccessToken({
        "oauth_token": SPLITWISE_ACCESS_TOKEN,
        "oauth_token_secret": SPLITWISE_ACCESS_TOKEN_SECRET
    })
    return s


def post_balance_to_splitwise(balance_result: Dict[str, object], splitwise: Splitwise) -> None:
    """
    Posts the financial balance transfer as a Splitwise expense, using fixed user IDs from constants.

    Args:
        balance_result: Output dictionary from transform_data(), including 'description'
        splitwise: Authenticated Splitwise instance

    Raises:
        ValueError: if balance_result is incomplete or malformed
    """
    if not balance_result.get("balance_to_export"):
        return

    debtor_name = balance_result.get("payer")
    creditor_name = balance_result.get("receiver")
    amount = balance_result.get("amount")

    if debtor_name not in ("Bram", "Anne") or creditor_name not in ("Bram", "Anne") or amount <= 0:
        raise ValueError("Invalid balance result data")

    group_id = int(SPLITWISE_GROUP_ID)
    bram_id = int(SPLITWISE_USER_ID_BRAM)
    anne_id = int(SPLITWISE_USER_ID_ANNE)

    debtor_id = bram_id if debtor_name == "Bram" else anne_id
    creditor_id = bram_id if creditor_name == "Bram" else anne_id

    description = balance_result.get("description", "Auto-settlement from pipeline")

    expense = Expense()
    expense.setCost(str(amount))
    expense.setDescription(description)
    expense.setGroupId(group_id)

    payer_user = User()  # The person who paid (creditor)
    payer_user.setId(creditor_id)
    payer_user.setPaidShare(str(amount))
    payer_user.setOwedShare("0.00")

    receiver_user = User()  # The person who owes (debtor)
    receiver_user.setId(debtor_id)
    receiver_user.setPaidShare("0.00")
    receiver_user.setOwedShare(str(amount))

    expense.setUsers([payer_user, receiver_user])

    print(f"Posting expense: {debtor_name} owes €{amount} to {creditor_name} in group {group_id}")
    splitwise.createExpense(expense)
