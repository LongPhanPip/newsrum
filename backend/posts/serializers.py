from datetime import datetime

from rest_framework import serializers

from accounts.serializers import AccountSerializer
from gernes.serializers import GerneSerializer
from publishers.serializers import PublisherSerializer
from .models import Post, Publisher, UserPost, WebPost, PostClick

import logging
logger = logging.getLogger(__name__)


POST_FIELDS = ['id', 'title', 'description', 'created_at', 'status', 'gerne', 'clicks']
USER_POST_FIELDS = ['post', 'account', 'markdown', 'updated_at', 'image']
WEB_POST_FIELDS = ['post', 'url', 'author', 'publisher', 'image_url']


class PostSerializer(serializers.ModelSerializer):
    gerne = GerneSerializer(read_only=True)
    gerne_id = serializers.IntegerField(write_only=True)
    image = serializers.SerializerMethodField(read_only=True, required=False)
    clicks = serializers.SerializerMethodField(read_only=True)
    publisher = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = [*POST_FIELDS, 'gerne_id', 'image', 'publisher']

    def get_image(self, obj):
        if getattr(obj, "user_post", False):
            return 'http://localhost:8000/api/v1/posts/' + str(obj.pk) + '/image'
        elif getattr(obj, "web_post", False):
            return obj.web_post.image_url

        return None

    def get_clicks(self, obj):
        return PostClick.objects.filter(post=obj).count()


    def get_publisher(self, obj):
        if getattr(obj, "web_post", False):
            return PublisherSerializer(obj.web_post.publisher).data
        return None


class UserPostSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)
    post_id = serializers.UUIDField(write_only=True)
    account = AccountSerializer(read_only=True)
    account_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = UserPost
        fields = [*USER_POST_FIELDS, 'account_id', 'post_id']

    def update(self, instance, validated_data):
        instance.markdown = validated_data.get('markdown', instance.markdown)
        instance.image = validated_data.get('image', instance.image)
        instance.updated_at = datetime.now()
        instance.save()
        return instance


class WebPostSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)
    post_id = serializers.UUIDField(write_only=True)
    publisher = PublisherSerializer(read_only=True)
    publisher_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = WebPost
        fields = [*WEB_POST_FIELDS, 'publisher_id', 'post_id']


class PostClickSerializer(serializers.ModelSerializer):
    post_id = serializers.UUIDField(write_only=True)
    post = PostSerializer(read_only=True)
    account_id = serializers.UUIDField(write_only=True, allow_null=True)
    account = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = PostClick
        fields = ['id', 'post', 'account', 'post_id', 'created_at', 'account_id', 'is_recommended']
