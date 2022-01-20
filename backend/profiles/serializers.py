from rest_framework import serializers
from .models import Profile
from accounts.serializers import AccountSerializer


class ProfileSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['account', 'first_name', 'last_name', 'gender', 'date_of_birth', 'interest', 'avatar', 'address']


    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.interest = validated_data.get('interest', instance.interest)
        instance.address = validated_data.get('address', instance.address)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance
