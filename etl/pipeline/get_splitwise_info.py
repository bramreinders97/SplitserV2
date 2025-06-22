from splitwise import Splitwise
from constants import (
    SPLITWISE_CONSUMER_KEY,
    SPLITWISE_CONSUMER_SECRET,
    SPLITWISE_ACCESS_TOKEN,
    SPLITWISE_ACCESS_TOKEN_SECRET,
)


def get_authenticated_splitwise() -> Splitwise:
    s = Splitwise(SPLITWISE_CONSUMER_KEY, SPLITWISE_CONSUMER_SECRET)
    s.setAccessToken({
        "oauth_token": SPLITWISE_ACCESS_TOKEN,
        "oauth_token_secret": SPLITWISE_ACCESS_TOKEN_SECRET
    })
    return s



def print_groups_and_members(splitwise: Splitwise) -> None:
    groups = splitwise.getGroups()
    for group in groups:
        print(f"\nGroup: {group.getName()} | ID: {group.getId()}")
        print("Members:")
        for member in group.getMembers():
            print(f"  Name: {member.getFirstName()} | ID: {member.getId()}")


if __name__ == "__main__":
    s = get_authenticated_splitwise()
    print_groups_and_members(s)
