from rest_framework import exceptions
from posts.models import Post
from .models import Comment, Reply

from .serializers import CommentSerializer

COMMENT_FILTER_FIELDS = ['post_id']

class CommentControl():

    def get_all_comments(self, sort, filter):
        filter_fields = {field: value for field, value in filter.items() if field in COMMENT_FILTER_FIELDS}

        try:
            comments = Comment.objects.filter(**filter_fields, is_root=1)
        except Exception:
            raise exceptions.ValidationError('Can\'t find comments')

        try:
            return comments.order_by(sort)
        except:
            raise exceptions.ParseError('Sort field is not found')


    def get_all_comments_by_post_id(self, pk):
        post = Post.objects.get(pk=pk)
        return post.comments.all()


    def get_comment_by_id(self, pk):
        try:
            return Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            raise exceptions.NotFound('Comment does not exist')


    def get_replies_by_comment_id(self, pk):
        return Reply.objects.filter(parent_id=pk)


    def create_comment(self, data):
        serializer = CommentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer


    def update_comment(self, comment, data):
        serializer = CommentSerializer(comment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()


    def delete_comment_by_id(self, pk):
        self.get_comment_by_id(pk).delete()
