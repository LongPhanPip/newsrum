from django.db import models

class Gerne(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'gerne'
