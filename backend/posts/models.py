from uuid import uuid4
from django.db import models

from accounts.models import Account
from gernes.models import Gerne
from publishers.models import Publisher


POST_STATUS = [
    ('P', 'Pending'),
    ('A', 'Accept'),
    ('H', 'Hidden'),
]


def post_image_path(instance, filename):
    return f'posts/{instance.post.id}/images/{filename}'


def post_markdown_path(instance, filename):
    return f'posts/{instance.id}/markdown/{filename}'


class Post(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    description = models.CharField(max_length=1024)
    gerne = models.ForeignKey(Gerne, on_delete=models.CASCADE, related_name="posts")
    status = models.CharField(max_length=32, choices=POST_STATUS)

    class Meta:
        db_table = 'post'


class UserPost(models.Model):
    post = models.OneToOneField(Post, primary_key=True, on_delete=models.CASCADE, related_name="user_post")
    image = models.FileField(upload_to=post_image_path)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="posts")
    markdown = models.TextField()
    updated_at = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        db_table = 'user_post'


class WebPost(models.Model):
    post = models.OneToOneField(Post, primary_key=True, on_delete=models.CASCADE, related_name="web_post")
    url = models.URLField(max_length=500)
    image_url = models.URLField(max_length=500, blank=True)
    author = models.CharField(max_length=128, blank=True)
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE, related_name='posts')

    class Meta:
        db_table = 'web_post'


class PostClick(models.Model):
    id = models.AutoField(primary_key=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="clicks", blank=True, null=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="clicks")
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    is_recommended = models.IntegerField(default=0)

    class Meta:
        db_table = 'post_click'
