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

from accounts.serializers import AccountSerializer
from accounts.controllers import update_account

from profiles.serializers import ProfileSerializer
from profiles.controllers import get_profile_by_account, update_profile

from posts.serializers import PostSerializer, UserPostSerializer
from posts.controllers import get_user_post_by_user, get_user_post_by_id, create_post, create_user_post, delete_post_by_id

from profiles.controllers import get_profile_by_account


class UserAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = AccountSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        return Response(update_account(request.user, request.data).data)


    def delete(self, request):
        delete_account(request.user)
        return Response('Your account was deleted successfully')


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = get_profile_by_account(request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = get_profile_by_account(request.user)
        return Response(update_profile(profile, request.data).data)


class UserPostListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = get_user_post_by_user(request.user)
        serializer = UserPostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.dict()
        data['status'] = "P"
        post_serializer = create_post(data)
        post = post_serializer

        user_post_data = {**request.data.dict(), 'post_id': post.pk, 'account_id': request.user.pk}
        return Response(create_user_post(user_post_data).data, status=status.HTTP_201_CREATED)



class UserPostDetailView(APIView):
    permission_classes = [IsPostOwner]

    def get(self, request, pk):
        post = get_user_post_by_id(pk)
        serializer = UserPostSerializer(post)
        return Response(serializer.data)

    def put(self, request, pk):
        user_post = get_user_post_by_id(pk)

        serializer = PostSerializer(user_post.post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        self.check_object_permissions(request, user_post.account)

        serializer = UserPostSerializer(user_post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        user_post = get_user_post_by_id(pk)
        self.check_object_permissions(request, user_post.account)

        delete_post_by_id(pk)
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
