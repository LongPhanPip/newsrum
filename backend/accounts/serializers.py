from django.core.validators import validate_email
from django.contrib.auth import get_user_model, password_validation
from django.core.exceptions import ValidationError

from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Account
from profiles.models import Profile


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'username', 'email', 'password', 'is_admin', 'join_at', 'is_active']
        extra_kwargs = {'id': {'read_only': True}, 'username': {'required': True}, 'email': {'required': True}, 'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        # profile = Profile.objects.create(account=user)
        # profile.save()
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        if validated_data.get('password', ''):
            instance.set_password(validated_data.get('password'))

        instance.save()
        return instance

    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError('Your email format is wrong')
        return value

    # def validate_username(self, value):
    #     account = Account.objects.filter(username=value)
    #     if account.exists():
    #         raise serializers.ValidationError('This username is already taken')
    #     return value

    def validate_password(self, value):
        try:
            password_validation.validate_password(value)
        except ValidationError:
            raise serializers.ValidationError('Your password is not strong enough')
        return value


class TokenSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ['token']

    def get_token(self, user):
        token = RefreshToken.for_user(user)
        token['username'] = user.username
        token['is_admin'] = user.is_admin
        return {
            'refresh': str(token),
            'access': str(token.access_token),
        }
