from django.urls import path, include


urlpatterns = [
    path('accounts/', include('accounts.urls')),
    path('profiles/', include('profiles.urls')),
    path('posts/', include('posts.urls')),
    path('comments/', include('comments.urls')),
    path('gernes/', include('gernes.urls')),
    path('publishers/', include('publishers.urls')),
    path('utils/', include('utils.urls')),
    path('recommenders/', include('recommender.urls')),
]
