import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.validators import EmailValidator
from django.utils import timezone

from .managers import CustomAccountManager

class Account(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField('username',
        max_length=255,
        unique=True,
        help_text="Username is required. Fewer than 256 character",
        validators=[UnicodeUsernameValidator()],
        error_messages={'unique': 'Username already exists'})

    email = models.CharField('email', max_length=320, validators=[EmailValidator()])
    is_admin = models.BooleanField('admin', default=False)
    is_active = models.BooleanField('active', default=True)
    join_at = models.DateTimeField('join_at', default=timezone.now)

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    objects = CustomAccountManager()

    class Meta:
        db_table = 'account'

    @property
    def is_staff(self):
        return self.is_admin

    @property
    def is_superuser(self):
        return self.is_admin

    def __str__(self):
        return self.username
