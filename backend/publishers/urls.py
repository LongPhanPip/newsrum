from django.urls import path, include
from .views import PublisherListView, PublisherDetailView, FeedListView, FeedDetailView, PostListView, PublisherSearchView


urlpatterns = [
    path('', PublisherListView.as_view()),
    path('search', PublisherSearchView.as_view()),
    path('<pk>', PublisherDetailView.as_view()),
    path('<pk>/feeds', FeedListView.as_view()),
    path('feeds/<pk>', FeedDetailView.as_view()),
    path('feeds/<pk>/posts', PostListView.as_view()),
]
