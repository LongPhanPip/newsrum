from rest_framework import exceptions

from .models import Account
from .serializers import AccountSerializer

def get_account_by_name(username):
    try:
        return Account.objects.get(username=username)
    except Account.DoesNotExist:
        raise exceptions.NotFound('Account not found')


def update_account(account, data):
    serializer = AccountSerializer(account, data=data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return serializer
