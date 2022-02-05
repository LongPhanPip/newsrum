from datetime import datetime, timedelta
from django.db.models import Q, Count
from django.utils import timezone
from rest_framework import exceptions

from .models import Post, UserPost, WebPost
from .serializers import PostSerializer, UserPostSerializer, WebPostSerializer

from recommender.models import RecSys
from recommender.controls import RecommenderControl

from posts.models import Post
from accounts.models import Account

POST_FILTER_FIELDS = ['keyword', 'gerne_id', 'publisher_id', 'start_at', 'end_at']

WEB_POST_FILTER_FIELDS = ['keyword', 'gerne_id', 'publisher_id', 'start_at', 'end_at']
USER_POST_FILTER_FIELDS = ['keyword', 'gerne_id', 'start_at', 'end_at', 'status']

import logging
logger = logging.getLogger('__name__')

TIME_RESET = 12


class PostControl():

    def get_all_posts(self, sort, filter, status):
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


    def get_hot_posts(self, filter):
        gerne_id = filter.get('gerne_id', "")
        all_posts = Post.objects.filter(status='A')
        if(gerne_id):
            all_posts = all_posts.filter(gerne_id=gerne_id)

        posts = all_posts.order_by('-created_at')

        posts = posts.annotate(count=Count('clicks')).order_by('-count')
        return posts[:7]


    def get_recommend_posts(self, user, filter):
        try:
            model = RecSys.objects.get(in_used=1)
            rec_control = RecommenderControl()
            return rec_control.get_recommend(user, model, filter)
        except:
            return self.get_hot_posts(filter)


    def get_all_user_posts(self):
        return UserPost.objects.all()


    def get_all_web_posts(self):
        return WebPost.objects.all()


    def get_post_by_id(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            raise exceptions.NotFound('Post does not exist')


    def get_user_post_by_id(self, pk):
        try:
            return UserPost.objects.get(post_id=pk)
        except UserPost.DoesNotExist:
            raise exceptions.NotFound('Post does not exist')


    def get_web_post_by_id(self, pk):
        try:
            return WebPost.objects.get(post_id=pk)
        except WebPost.DoesNotExist:
            raise exceptions.NotFound('Post does not exist')


    def get_post_by_user(self, user, filter):
        return Post.objects.filter(user_post__account=user)



    def get_user_post_by_user(self, user, filter):
        filter_fields = {field: value for (field, value) in filter.items() if field in USER_POST_FILTER_FIELDS}
        posts = UserPost.objects.filter(account=user)

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


    def create_post(self, post_data):
        serializer = PostSerializer(data=post_data)
        serializer.is_valid(raise_exception=True)
        return serializer.save()


    def create_user_post(self, user_post_data):
        serializer = UserPostSerializer(data=user_post_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer


    def create_web_post(self, web_post_data):
        serializer = WebPostSerializer(data=user_post_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer


    def search_post(self, filter):
        if filter.get('keyword', ''):
            keyword = filter['keyword'].lower()
            posts = Post.objects.filter(Q(title__icontains=keyword) |
                                        Q(description__icontains=keyword) |
                                        Q(gerne__name__icontains=keyword) |
                                        Q(user_post__account__username__icontains=keyword) |
                                        Q(web_post__author__icontains=keyword) |
                                        Q(web_post__publisher__name__icontains=keyword))
            return posts


    def search_web_post(self, filter):
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


    def search_user_post(self, filter):
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


    def update_post_by_id(self, pk, data):
        post = self.get_post_by_id(pk)
        serializer = PostSerializer(post, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer

    def delete_post_by_id(self, pk):
        self.get_post_by_id(pk).delete()
