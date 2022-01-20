from django.db import models
from accounts.models import Account

GENDER_CHOICES = [
    ('M', 'male'),
    ('F', 'female')
]


def avatar_path(instance, filename):
    return f'profile/{instance.account.pk}/avatar/{filename}'


class Profile(models.Model):
    account = models.OneToOneField(Account, primary_key=True, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=128, blank=True)
    last_name = models.CharField(max_length=128, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=255, blank=True)
    gender = models.CharField(max_length=2, choices=GENDER_CHOICES, blank=True)
    interest = models.CharField(max_length=255, blank=True)
    avatar = models.FileField(upload_to=avatar_path, null=True, blank=True)

    class Meta:
        db_table = 'profile'
