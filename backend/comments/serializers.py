from datetime import datetime
from rest_framework import serializers
from accounts.serializers import AccountSerializer
from .models import Comment, Reply

import logging
logger = logging.getLogger('__name__')

class CommentSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    account_id = serializers.UUIDField(write_only=True)
    replies = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    post_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post_id', 'account', 'account_id', 'text', 'created_at', 'updated_at', 'replies', 'is_root']

    def create(self, validated_data):
        comment = Comment.objects.create(**validated_data)
        comment.save()
        return comment

    def update(self, instance, validated_data):
        instance.text = validated_data.get('text', instance.text)
        instance.updated_at = datetime.now()
        instance.save()
        return instance


class ReplySerializer(serializers.ModelSerializer):
    parent_id = serializers.UUIDField(write_only=True)
    parent = CommentSerializer(read_only=True)
    reply_id = serializers.UUIDField(write_only=True)
    reply = CommentSerializer(read_only=True)

    class Meta:
        model = Reply
        fields = ['parent', 'parent_id', 'reply', 'reply_id']

    def create(self, validated_data):
        reply = Reply.objects.create(**validated_data)
        reply.save()
        return reply
