from django.urls import path

from . import views

urlpatterns = [
    # path("signup/", SignUpView.as_view(), name="signup"),
    path("profiles/", views.UserProfileListCreate.as_view(), name="user-profile-list"),
    path("profiles/delete/<int:pk>/", views.UserProfileDelete.as_view(), name="delete-user-profile"),
    path('me/', views.UserDetailView.as_view(), name="user-detail"),
    path("ranked-users/", views.RankedUsersView.as_view(), name="ranked-users")
]