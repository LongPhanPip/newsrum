from datetime import datetime, timedelta
from django.db.models import Q, Count
from django.utils import timezone
from rest_framework import exceptions

from .models import Post, UserPost, WebPost
from .serializers import PostSerializer, UserPostSerializer, WebPostSerializer

POST_FILTER_FIELDS = ['keyword', 'gerne_id', 'publisher_id', 'start_at', 'end_at']

WEB_POST_FILTER_FIELDS = ['keyword', 'gerne_id', 'publisher_id', 'start_at', 'end_at']
USER_POST_FILTER_FIELDS = ['keyword', 'gerne_id', 'start_at', 'end_at', 'status']

import logging
logger = logging.getLogger('__name__')

TIME_RESET = 12


def get_all_posts(sort, filter, status):
    filter_fields = {field: value for (field, value) in filter.items() if field in POST_FILTER_FIELDS}
    posts = Post.objects.all()
    if filter_fields.get('keyword', ''):
        keyword = filter_fields['keyword'].lower().strip()
        posts = posts.filter(Q(title__icontains=keyword) |
                             Q(description__icontains=keyword))

    if filter_fields.get('gerne_id', ''):
        posts = posts.filter(gerne_id=filter_fields['gerne_id'])

    if filter_fields.get('publisher_id', ''):
        if filter_fields['publisher_id'] == 0:
            posts = posts.filter(user_post__isnull=False)
        else:
            posts = posts.filter(web_post__publisher=filter_fields['publisher_id'])

    if filter_fields.get('start_at', ''):
        posts = posts.filter(Q(created_at__gte=filter_fields['start_at']))

    if filter_fields.get('end_at', ''):
        posts = posts.filter(Q(created_at__lte=filter_fields['end_at']))

    if status:
        posts = posts.filter(status=status)

    try:
        return posts.order_by(sort)
    except:
        raise exceptions.ParseError('Sort field is not found')


def get_hot_posts(filter):
    gerne_id = filter.get('gerne_id', "")
    all_posts = Post.objects.all()
    if(gerne_id):
        all_posts = all_posts.filter(gerne_id=gerne_id)
    posts = []
    i = 1
    while(len(posts) < 7):
        now = timezone.now() - timedelta(hours=TIME_RESET * i)
        posts = all_posts.filter(Q(created_at__gte=now))
        i += 1

    return posts.annotate(count=Count('clicks')).order_by('-count')



def get_all_user_posts():
    return UserPost.objects.all()


def get_all_web_posts():
    return WebPost.objects.all()


def get_post_by_id(pk):
    try:
        return Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        raise exceptions.NotFound('Post does not exist')


def get_user_post_by_id(pk):
    try:
        return UserPost.objects.get(post_id=pk)
    except UserPost.DoesNotExist:
        raise exceptions.NotFound('Post does not exist')


def get_web_post_by_id(pk):
    try:
        return WebPost.objects.get(post_id=pk)
    except WebPost.DoesNotExist:
        raise exceptions.NotFound('Post does not exist')


def get_post_by_user(user):
    return Post.objects.filter(user_post__account=user)


def get_user_post_by_user(user):
    return UserPost.objects.filter(account=user)


def create_post(post_data):
    serializer = PostSerializer(data=post_data)
    serializer.is_valid(raise_exception=True)
    return serializer.save()


def create_user_post(user_post_data):
    serializer = UserPostSerializer(data=user_post_data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return serializer


def create_web_post(web_post_data):
    serializer = WebPostSerializer(data=user_post_data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return serializer


def search_post(filter):
    if filter.get('keyword', ''):
        keyword = filter['keyword'].lower()
        posts = Post.objects.filter(Q(title__icontains=keyword) |
                                    Q(description__icontains=keyword) |
                                    Q(gerne__name__icontains=keyword) |
                                    Q(user_post__account__username__icontains=keyword) |
                                    Q(web_post__author__icontains=keyword) |
                                    Q(web_post__publisher__name__icontains=keyword))
        return posts


def search_web_post(filter):
    filter_fields = {field: value for (field, value) in filter.items() if field in WEB_POST_FILTER_FIELDS}
    posts = WebPost.objects.all()
    if filter_fields.get('keyword', ''):
        keyword = filter_fields['keyword'].lower()
        posts = posts.filter(Q(post__title__icontains=keyword) |
                             Q(post__description__icontains=keyword))

    if filter_fields.get('gerne_id', ''):
        posts = posts.filter(post__gerne_id=filter_fields['gerne_id'])

    if filter_fields.get('publisher_id', ''):
        posts = posts.filter(publisher_id=filter_fields['publisher_id'])

    if filter_fields.get('start_at', ''):
        start_at = datetime.strptime(filter_fields['start_at'], '%Y-%m-%d')
        posts = posts.filter(Q(post__created_at__gte=start_at))

    if filter_fields.get('end_at', ''):
        end_at = datetime.strptime(filter_fields['end_at'], '%Y-%m-%d')
        posts = posts.filter(Q(post__created_at__lte=end_at))


    return posts


def search_user_post(filter):
    filter_fields = {field: value for (field, value) in filter.items() if field in USER_POST_FILTER_FIELDS}
    posts = UserPost.objects.all()

    if filter_fields.get('keyword', ''):
        keyword = filter_fields['keyword'].lower()
        posts = posts.filter(Q(post__title__icontains=keyword) |
                             Q(post__description__icontains=keyword))

    if filter_fields.get('gerne_id', ''):
        posts = posts.filter(post__gerne_id=filter_fields['gerne_id'])

    if filter_fields.get('start_at', ''):
        start_at = datetime.strptime(filter_fields['start_at'], '%Y-%m-%d')
        posts = posts.filter(Q(post__created_at__gte=start_at))

    if filter_fields.get('end_at', ''):
        end_at = datetime.strptime(filter_fields['end_at'], '%Y-%m-%d')
        posts = posts.filter(Q(post__created_at__lte=end_at))

    if filter_fields.get('status', ''):
        posts = posts.filter(Q(post__status=filter_fields['status']))

    return posts


def delete_post_by_id(pk):
    get_post_by_id(pk).delete()
