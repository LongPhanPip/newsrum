import os
import mimetypes
import sys
from datetime import datetime

from django.http import HttpResponse

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from permissions import IsPostOwner

from paginations import PaginationHandlerMixin, Pagination

from accounts.serializers import AccountSerializer
from accounts.controls import AccountControl

from profiles.serializers import ProfileSerializer
from profiles.controls import ProfileControl

from posts.serializers import PostSerializer, UserPostSerializer
from posts.controls import PostControl



class UserAccountView(APIView):
    permission_classes = [IsAuthenticated]
    control = AccountControl()

    def get(self, request):
        serializer = AccountSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        return Response(self.control.update_account(request.user, request.data).data)

    def delete(self, request):
        self.control.delete_account(request.user)
        return Response('Your account was deleted successfully')


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    control = ProfileControl()

    def get(self, request):
        profile = self.control.get_profile_by_account(request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = self.control.get_profile_by_account(request.user)
        return Response(self.control.update_profile(profile, request.data).data)


class UserPostListView(APIView, PaginationHandlerMixin):
    pagination_class = Pagination
    permission_classes = [IsAuthenticated]
    control = PostControl()

    def get(self, request):
        posts = self.control.get_user_post_by_user(request.user, request.query_params.dict())
        serializer = UserPostSerializer(posts, many=True)
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_paginated_response(UserPostSerializer(page, many=True).data)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.dict()
        data['status'] = "P"
        post_serializer = self.control.create_post(data)
        post = post_serializer

        user_post_data = {**request.data.dict(), 'post_id': post.pk, 'account_id': request.user.pk}
        return Response(self.control.create_user_post(user_post_data).data, status=status.HTTP_201_CREATED)



class UserPostDetailView(APIView):
    permission_classes = [IsPostOwner]
    control = PostControl()

    def get(self, request, pk):
        post = self.control.get_user_post_by_id(pk)
        serializer = UserPostSerializer(post)
        return Response(serializer.data)

    def put(self, request, pk):
        user_post = self.control.get_user_post_by_id(pk)

        serializer = PostSerializer(user_post.post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        self.check_object_permissions(request, user_post.account)

        serializer = UserPostSerializer(user_post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        user_post = self.control.get_user_post_by_id(pk)
        self.check_object_permissions(request, user_post.account)

        self.control.delete_post_by_id(pk)
        return Response('Delete post successful')


@api_view(['GET', ])
@permission_classes([IsAuthenticated])
def get_avatar(request):
    person_info = get_profile_by_account(request.user)
    filepath = os.path.join(settings.BASE_DIR, person_info.avatar.path)
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
