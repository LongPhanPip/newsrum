from django.urls import include, path

from .views import GetWebDataView
urlpatterns = [
    path('get_web_data', GetWebDataView.as_view()),
]
