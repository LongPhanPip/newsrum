from rest_framework import serializers
import json
from .models import RecSys, RecResult
import logging
logger = logging.getLogger('__name__')

from .train import train_model


class RecSysSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecSys
        fields = ['id', 'location', 'in_used', 'params', 'test_hit_7']
        extra_kwargs = {'data': {'required': False},
                        'location': {'required': False},
                        'params': {'required': False}}


    def create(self, validated_data):
        params = json.loads(validated_data.get('params', '') or '{}')
        model_dir, params, test_hit_7 = train_model(params)
        rec = RecSys.objects.create(location=model_dir, params=json.dumps(params), test_hit_7=test_hit_7)
        rec.save()
        return rec



class RecResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecResult
        fields = ['id', 'model', 'user', 'is_hit', 'created_at']
