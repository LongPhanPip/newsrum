from rest_framework import exceptions

from .models import Profile
from .serializers import ProfileSerializer


class ProfileControl():

    def get_profile_by_id(self, pk):
        return Profile.objects.get(pk=pk)


    def get_profile_by_account(self, account):
        return Profile.objects.get(account=account)


    def update_profile_by_id(self, pk, data):
        profile = self.get_profile_by_id(pk)
        serializer = ProfileSerializer(profile, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer

    def update_profile(self, profile, data):
        serializer = ProfileSerializer(profile, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer
