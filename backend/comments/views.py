from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from permissions import IsCommentOwner, IsAuthenticatedOrReadOnly
from paginations import Pagination, PaginationHandlerMixin

from .controllers import get_all_comments, get_comment_by_id, get_replies_by_comment_id, create_comment, delete_comment_by_id
from .serializers import CommentSerializer, ReplySerializer

import logging

logger = logging.getLogger('__name__')



class CommentListView(APIView, PaginationHandlerMixin):
    permission_classes = [IsAuthenticatedOrReadOnly | IsAdminUser]
    pagination_class = Pagination

    def get(self, request):
        sort = request.query_params.get('sort', '-created_at')
        logger.error(request.query_params.dict())
        comments = get_all_comments(sort, filter=request.query_params.dict())

        page = self.paginate_queryset(comments)

        serializer = CommentSerializer(comments, many=True)
        if page is not None:
            serializer = self.get_paginated_response(CommentSerializer(page, many=True).data)

        return Response(serializer.data)

    def post(self, request):
        comment_data = {**request.data, 'account_id': request.user.pk}
        logger.error(comment_data)
        return Response(create_comment(comment_data).data, status=status.HTTP_201_CREATED)


class CommentDetailView(APIView):
    permission_classes = [IsCommentOwner | IsAdminUser]

    def get(self, request, pk):
        comment = get_comment_by_id(pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    def put(self, request, pk):
        comment = get_comment_by_id(pk)
        self.check_object_permissions(request, comment.account)
        update_comment(comment, request.data)
        return Response(serializer.data)

    def delete(self, request, pk):
        self.check_object_permissions(request, comment.account)
        delete_comment_by_id(pk)
        return Response('Comment was deleted successful')


class ReplyListView(APIView):

    def get(self, request, pk):
        comment = get_comment_by_id(pk)
        replies = [rep.reply for rep in comment.replies.all()]
        serializer = CommentSerializer(replies, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        parent = get_comment_by_id(pk)
        reply = CommentSerializer(data={**request.data, 'post_id': parent.post.pk, 'account_id': request.user.pk, 'is_root': 0})
        reply.is_valid(raise_exception=True)
        reply = reply.save()

        serializer = ReplySerializer(data={'parent_id': parent.pk, 'reply_id': reply.pk})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
