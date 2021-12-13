from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser

from accounts.serializers import AccountSerializer, TokenSerializer

from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope

from .permissions import IsAccountOwner
from .utils import get_account_by_name, update_account

import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

class LoginView(APIView):
    def post(self, request):
        account = authenticate(**request.data)
        if account != None:
            serializer = TokenSerializer(account)
            return Response(serializer.data)
        else:
            return Response('Wrong credentials infomation', status.HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    def post(self, request):
        serializer = AccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AccountView(APIView):
    permission_classes = [IsAccountOwner]

    def get(self, request, username):
        account = get_account_by_name(username)
        self.check_object_permissions(request, account)

        serializer = AccountSerializer(self.account)
        return Response(serializer.data)

    def put(self, request, username):
        account = get_account_by_name(username)
        self.check_object_permissions(request, account)

        serializer = update_account(account, request.data)
        return Response(serializer.data)

