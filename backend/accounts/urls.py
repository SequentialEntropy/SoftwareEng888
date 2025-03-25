"""
Defines all endpoints and its corresponding views to serve and respond to requests to /accounts/
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import SignUpView, RetrieveUserView, RankedUsersView, ChangePasswordView, ForgotPwdRequestView, ResetPasswordView

urlpatterns = [
    path("user/register/", SignUpView.as_view(), name="register"),
    path("me/", RetrieveUserView.as_view(), name="user-detail"),
    path("ranked-users/", RankedUsersView.as_view(), name="ranked-users"),

    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),

    path("forgot-password-request/", ForgotPwdRequestView.as_view(), name="forgot-password-request"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),

]


