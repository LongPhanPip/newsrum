from rest_framework import exceptions

from .models import Profile
from .serializers import ProfileSerializer


def get_profile_by_id(pk):
    return Profile.objects.get(pk=pk)


def get_profile_by_account(account):
    return Profile.objects.get(account=account)


def update_profile(profile, data):
    serializer = ProfileSerializer(profile, data=data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return serializer
