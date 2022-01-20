from uuid import uuid4
from django.db import models
from accounts.models import Account
from posts.models import Post


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    text = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True)
    is_root = models.IntegerField(default=1)

    class Meta:
        db_table = 'comment'


class Reply(models.Model):
    reply = models.OneToOneField(Comment, primary_key=True, on_delete=models.CASCADE, related_name='parent')
    parent = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='replies')

    class Meta:
        db_table = 'reply'
