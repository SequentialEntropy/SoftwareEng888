from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import SignUpView, RetrieveUserView, RankedUsersView, RetrieveTasksView, RetrieveChancesView

urlpatterns = [
    path("user/register/", SignUpView.as_view(), name="register"),
    path("me/", RetrieveUserView.as_view(), name="user-detail"),
    path("ranked-users/", RankedUsersView.as_view(), name="ranked-users"),
    path("tasks/", RetrieveTasksView.as_view(), name="tasks"),
    path("chances/", RetrieveChancesView.as_view(), name="chances"),

    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
]
