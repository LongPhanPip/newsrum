from datetime import datetime
from rest_framework import exceptions
from django.db.models import Q
from .models import Account
from .serializers import AccountSerializer

ACCOUNT_FILTER_FIELDS = ['username', 'email', 'join_at', 'is_admin', 'start_at', 'end_at', 'keyword']


class AccountControl():

    def get_account_by_id(self, pk):
        try:
            return Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            raise exceptions.NotFound('Account not found')


    def update_account(self, account, data):
        serializer = AccountSerializer(account, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer


    def delete_account(self, account):
        return account.delete()


    def get_all_accounts(self, filter):
        filter_fields = {field: value for field, value in filter.items() if field in ACCOUNT_FILTER_FIELDS}
        accounts = Account.objects.filter(**filter_fields)

        return accounts


    def search_account(self, filter):
        filter_fields = {field: value for field, value in filter.items() if field in ACCOUNT_FILTER_FIELDS}
        accounts = Account.objects.all()

        if filter_fields.get('keyword', ''):
            keyword = filter_fields['keyword'].lower()
            accounts = accounts.filter(Q(username__icontains=keyword) |
                                       Q(email__icontains=keyword))

        if filter_fields.get('start_at', ''):
            start_at = datetime.strptime(filter_fields['start_at'], '%Y-%m-%d')
            accounts = accounts.filter(Q(join_at__gte=start_at))

        if filter_fields.get('end_at', ''):
            end_at = datetime.strptime(filter_fields['end_at'], '%Y-%m-%d')
            accounts = accounts.filter(Q(join_at__lte=end_at))

        if filter_fields.get('is_admin', ''):
            accounts = accounts.filter(Q(is_admin=filter_fields['is_admin']))

        return accounts
