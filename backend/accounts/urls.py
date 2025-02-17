from django.urls import path

from .views import SignUpView
from . import views

urlpatterns = [
    # path("signup/", SignUpView.as_view(), name="signup"),
    path("profiles/", views.UserProfileListCreate.as_view(), name="user-profile-list"),
    path("profiles/delete/<int:pk>/", views.UserProfileDelete.as_view(), name="delete-user-profile")
]