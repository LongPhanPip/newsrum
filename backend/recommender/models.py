from django.db import models
from uuid import uuid4

from accounts.models import Account


class RecSys(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True)
    location = models.CharField(max_length=255)
    in_used = models.IntegerField(default=0)
    params = models.CharField(max_length=255)
    test_hit_7 = models.FloatField(blank=True, null=True)

    class Meta:
        db_table = 'rec_sys'


class RecResult(models.Model):
    id = models.AutoField(primary_key=True)
    model = models.ForeignKey(RecSys, on_delete=models.CASCADE, related_name='rec_results')
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='rec_results')
    is_hit = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = 'rec_result'
