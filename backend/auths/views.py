from django.contrib.auth import get_user_model, authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.serializers import TokenSerializer, AccountSerializer


class LoginView(APIView):
    def post(self, request):
        account = authenticate(**request.data)
        if account != None:
            serializer = TokenSerializer(account)
            return Response(serializer.data)
        else:
            return Response('Không thể đăng nhập', status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(APIView):
    def post(self, request):
        serializer = AccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
