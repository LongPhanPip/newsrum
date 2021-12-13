from uuid import uuid4
from django.db import models

from accounts.models import Account


USER_POST_STATUS = [
    ('P', 'Pending'),
    ('A', 'Accepted'),
    ('H', 'Hidden')
]

def post_image_path(instance, filename):
    return f'posts/{instance.id}/images/{filename}'

def publisher_logo_path(instance, filename):
    return f'publishers/{instance.name}/logo/{filename}'


class Gerne(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'gerne'


class Publisher(models.Model):
    id = models.AutoField(primary_key=True)
    url = models.URLField()
    name = models.CharField(max_length=128)
    logo = models.FileField(upload_to=publisher_logo_path)

    class Meta:
        db_table = 'publisher'

class Post(models.Model):
    id = models.AutoField(default=uuid4, primary_key=True)
    title = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    description = models.CharField(max_length=255)
    image = models.FileField(upload_to=post_image_path)
    gerne = models.ForeignKey(Gerne, on_delete=models.CASCADE, related_name="posts")

    class Meta:
        db_table = 'post'

class UserPost(models.Model):
    id = models.OneToOneField(Post, primary_key=True, on_delete=models.CASCADE, related_name="user_post")
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="posts")
    markdown = models.TextField()
    status = models.CharField(max_length=64, choices=USER_POST_STATUS)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = 'user_post'


class WebPost(models.Model):
    id = models.OneToOneField(Post, primary_key=True, on_delete=models.CASCADE, related_name="web_post")
    url = models.URLField()
    author = models.CharField(max_length=128)
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE, related_name='posts')

    class Meta:
        db_table = 'web_post'
