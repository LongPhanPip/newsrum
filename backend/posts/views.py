import os
import mimetypes
import logging
from datetime import datetime

from django.http import HttpResponse

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view

from newsrum import settings
from paginations import Pagination, PaginationHandlerMixin
from permissions import IsAuthenticatedOrReadOnly, ReadOrPostOwner

from .serializers import PostSerializer, UserPostSerializer, WebPostSerializer, PostClickSerializer

from .controls import PostControl


logger = logging.getLogger(__name__)


class PostListView(APIView, PaginationHandlerMixin):
    pagination_class = Pagination
    control = PostControl()

    def get(self, request):
        sort = request.query_params.get('sort', '-created_at')
        status = "A"
        posts = self.control.get_all_posts(sort=sort,
                                           filter=request.query_params.dict(),
                                           status=status)

        page = self.paginate_queryset(posts)
        serializer = PostSerializer(posts, many=True)
        if page is not None:
            serializer = self.get_paginated_response(PostSerializer(page, many=True).data)
        return Response(serializer.data)


class PostDetailView(APIView):
    permission_classes = [ReadOrPostOwner]
    control = PostControl()

    def get(self, request, pk):
        post = self.control.get_post_by_id(pk)
        if getattr(post, "user_post", False):
            if post.status == "P" and not request.user.is_admin:
                self.check_object_permissions(request, post.user_post.account)
            serializer = UserPostSerializer(post.user_post)
        else:
            serializer = WebPostSerializer(post.web_post)
        return Response(serializer.data)

    def put(self, request, pk):
        serializer = self.control.update_post_by_id(pk, request.data)
        return Response(serializer.data)

    def delete(self, request, pk):
        self.control.delete_post_by_id(pk)
        return Response('Post was deleted successfully')



class PostRecommendView(APIView):
    control = PostControl()

    def get(self, request):
        if not request.user.is_anonymous:
            if not request.user.is_admin:
                posts = self.control.get_recommend_posts(request.user, request.query_params)
            else:
                posts = self.control.get_hot_posts(request.query_params)

        else:
            posts = self.control.get_hot_posts(request.query_params)

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)


class PostSearchView(APIView, PaginationHandlerMixin):
    pagination_class = Pagination
    control = PostControl()

    def get(self, request):
        posts = self.control.search_post(request.query_params.dict())
        page = self.paginate_queryset(posts)
        serializer = WebPostSerializer(posts, many=True)
        if page is not None:
            serializer = self.get_paginated_response(WebPostSerializer(page, many=True).data)

        return Response(serializer.data)


class WebPostListView(APIView, PaginationHandlerMixin):
    pagination_class = Pagination
    permission_classes = [IsAdminUser]
    control = PostControl()

    def get(self, request):
        posts = self.control.get_all_web_posts()
        page = self.paginate_queryset(posts)
        serializer = WebPostSerializer(posts, many=True)
        if page is not None:
            serializer = self.get_paginated_response(WebPostSerializer(page, many=True).data)

        return Response(serializer.data)

    def post(self, request):
        data = request.data
        data['status'] = "A"
        post = self.control.create_post(data)
        web_post_data = {**request.data, 'post_id': post.pk}
        serializer = WebPostSerializer(data=web_post_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class WebPostDetailView(APIView):
    permission_classes = [IsAdminUser]
    control = PostControl()

    def get(self, request, pk):
        post = self.control.get_web_post_by_id(pk)
        serializer = WebPostSerizlier(post)
        return Response(serializer.data)

    def put(self, request, pk):
        web_post = self.control.get_web_post_by_id(pk)

        serializer = PostSerializer(web_post.post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        serializer = WebPostSerializer(web_post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class WebPostSearchView(APIView, PaginationHandlerMixin):
    pagination_class = Pagination
    permission_classes = [IsAdminUser]
    control = PostControl()

    def get(self, request):
        posts = self.control.search_web_post(request.query_params.dict())
        page = self.paginate_queryset(posts)
        serializer = WebPostSerializer(posts, many=True)
        if page is not None:
            serializer = self.get_paginated_response(WebPostSerializer(page, many=True).data)

        return Response(serializer.data)


class UserPostSearchView(APIView, PaginationHandlerMixin):
    pagination_class = Pagination
    permission_classes = [IsAdminUser]

    control = PostControl()

    def get(self, request):
        posts = self.control.search_user_post(request.query_params.dict())
        page = self.paginate_queryset(posts)
        serializer = UserPostSerializer(posts, many=True)
        if page is not None:
            serializer = self.get_paginated_response(UserPostSerializer(page, many=True).data)

        return Response(serializer.data)


class PostClickView(APIView):
    def post(self, request):
        data = {**request.data, 'account_id': request.user.pk}
        serializer = PostClickSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)



@api_view(['GET', ])
def get_post_image(request, pk):
    post_ctl = PostControl()
    post = post_ctl.get_post_by_id(pk)
    filepath = os.path.join(settings.BASE_DIR, post.user_post.image.path)
    if os.path.exists(filepath):
        filename = os.path.basename(filepath)
        mimetype = mimetypes.guess_type(filepath)
        logger.error(mimetype)
        with open(filepath, 'rb') as f:
            response = HttpResponse(f.read(), content_type=mimetype[0])
            # response['Content-Disposition'] = f'inline; filename="{filename}"'
            response['Cache-Control'] = "max-age=0"
            return response
    else:
        return Response({'File not found'}, status=status.HTTP_404_NOT_FOUND)
