from django.urls import path, include

from .views import PostListView, PostDetailView, PostSearchView, get_post_image, WebPostListView, WebPostDetailView, WebPostSearchView, PostClickView, PostHotListView, UserPostSearchView


urlpatterns = [
    path('', PostListView.as_view()),
    path('hot', PostHotListView.as_view()),
    path('search', PostSearchView.as_view()),
    path('web', WebPostListView.as_view()),
    path('web/search', WebPostSearchView.as_view()),
    path('web/<pk>', WebPostDetailView.as_view()),
    path('user/search', UserPostSearchView.as_view()),
    path('click', PostClickView.as_view()),
    path('<pk>', PostDetailView.as_view()),
    path('<pk>/image', get_post_image),
]
