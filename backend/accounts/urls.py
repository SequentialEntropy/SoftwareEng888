from django.urls import path

from . import views

urlpatterns = [
    path('me/', views.UserDetailView.as_view(), name="user-detail")
]
