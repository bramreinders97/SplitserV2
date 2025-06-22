from transform import transform_data
from load import get_authenticated_splitwise, post_balance_to_splitwise

# Sample data
all_expenses = [
    {
        'id': '1',
        'amount': '100.00',
        'payer': 'Anne',
        'description': 'test',
        'date': '2025-06-10',
        'created_at': '2025-06-17 20:33:43',
        'exported': '0'
    }
]

all_rides = [
    {
        'id': '1',
        'driver': 'Anne',
        'distance': '100',
        'description': 'test',
        'date': '2025-06-12',
        'created_at': '2025-06-17 20:29:20',
        'exported': '0'
    },
    {
        'id': '2',
        'driver': 'Bram',
        'distance': '6',
        'description': 'hoi',
        'date': '2025-06-07',
        'created_at': '2025-06-17 20:40:50',
        'exported': '0'
    }
]

balance_result = transform_data(all_rides, all_expenses)
print("Balance Result:")
print(balance_result)

splitwise = get_authenticated_splitwise()
post_balance_to_splitwise(balance_result, splitwise)
