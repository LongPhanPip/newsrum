from django.urls import path, include

from .views import CommentListView, CommentDetailView, ReplyListView

urlpatterns = [
    path('', CommentListView.as_view()),
    path('<pk>', CommentDetailView.as_view()),
    path('<pk>/replies', ReplyListView.as_view()),
]
