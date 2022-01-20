from django.urls import path, include
from accounts.views import AccountDetailView, AccountListView, AccountSearchView

urlpatterns = [
    path('', AccountListView.as_view()),
    path('search', AccountSearchView.as_view()),
    path('<pk>', AccountDetailView.as_view()),
]
