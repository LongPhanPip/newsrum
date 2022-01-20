from django.db import models


class Publisher(models.Model):
    id = models.AutoField(primary_key=True)
    url = models.URLField()
    name = models.CharField(max_length=128)
    logo = models.URLField(blank=True)

    class Meta:
        db_table = 'publisher'


class Feed(models.Model):
    id = models.AutoField(primary_key=True)
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE, related_name='feeds')
    url = models.URLField()

    class Meta:
        db_table = 'feed'
