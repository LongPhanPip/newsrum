from django.urls import include, path

from .views import UserAccountView, UserProfileView, UserPostListView, UserPostDetailView, get_avatar

urlpatterns = [
    path('account', UserAccountView.as_view()),
    path('profile', UserProfileView.as_view()),
    path('profile/avatar', get_avatar),
    path('posts', UserPostListView.as_view()),
    path('posts/<pk>', UserPostDetailView.as_view()),
]
