from django.urls import path

from . import views

urlpatterns = [
    path("me/", views.RetrieveUserView.as_view(), name="user-detail"),
    path("ranked-users/", views.RankedUsersView.as_view(), name="ranked-users")
]
