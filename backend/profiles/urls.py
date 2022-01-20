from django.urls import include, path
from .views import ProfileDetailView, get_avatar

urlpatterns = [
    path('<pk>', ProfileDetailView.as_view()),
    path('<pk>/avatar', get_avatar)
]
