from rest_framework import serializers

from .models import Gerne


class GerneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gerne
        fields = ['id', 'name', 'description']

    def create(self, validated_data):
        gerne = Gerne.objects.create(**validated_data)
        gerne.save()
        return gerne

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance
