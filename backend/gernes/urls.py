from django.urls import path, include
from .views import GerneListView, GerneDetailView, GerneSearchView

urlpatterns = [
    path('', GerneListView.as_view()),
    path('search', GerneSearchView.as_view()),
    path('<pk>', GerneDetailView.as_view()),
]
