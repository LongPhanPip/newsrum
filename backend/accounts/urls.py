from django.urls import path, include

from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope

from accounts.views import RegisterView, LoginView, AccountView

urlpatterns = [
    path('login', LoginView.as_view()),
    path('register', RegisterView.as_view()),
    path('accounts/<username>', AccountView.as_view()),
]
