from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope

from paginations import PaginationHandlerMixin, Pagination

from accounts.serializers import AccountSerializer, TokenSerializer
from accounts.controllers import get_account_by_id

from profiles.controllers import get_profile_by_account
from profiles.serializers import ProfileSerializer

from permissions import IsAccountOwner

from .controllers import get_account_by_name, search_account, update_account, get_all_accounts, delete_account

import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)


class AccountListView(APIView, PaginationHandlerMixin):
    permission_classes = [IsAdminUser]
    pagination_class = Pagination

    def get(self, request):
        accounts = get_all_accounts(request.query_params.dict())
        page = self.paginate_queryset(accounts)
        serializer = AccountSerializer(accounts, many=True)
        if page is not None:
            serializer = self.get_paginated_response(AccountSerializer(page, many=True).data)
        return Response(serializer.data)


class AccountSearchView(APIView, PaginationHandlerMixin):
    permission_classes = [IsAdminUser]
    pagination_class = Pagination

    def get(self, request):
        accounts = search_account(request.query_params.dict())
        page = self.paginate_queryset(accounts)
        serializer = AccountSerializer(accounts, many=True)
        if page is not None:
            serializer = self.get_paginated_response(AccountSerializer(page, many=True).data)
        return Response(serializer.data)


class AccountDetailView(APIView):
    permission_classes = [IsAccountOwner | IsAdminUser]

    def get(self, request, pk):
        account = get_account_by_id(pk)
        self.check_object_permissions(request, account)

        serializer = AccountSerializer(account)
        return Response(serializer.data)

    def put(self, request, pk):
        account = get_account_by_id(pk)
        self.check_object_permissions(request, account)

        serializer = update_account(account, request.data)
        return Response(serializer.data)

    def delete(self, request, pk):
        delete_account(get_account_by_id(pk))
        return Response("Account was deleted successfully")
