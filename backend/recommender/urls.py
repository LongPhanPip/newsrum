from django.urls import path, include
from .views import RecommenderListView, RecommenderUseView, RecommenderDetailView

urlpatterns = [
    path('', RecommenderListView.as_view()),
    path('use/<pk>', RecommenderUseView.as_view()),
    path('<pk>', RecommenderDetailView.as_view()),

]
