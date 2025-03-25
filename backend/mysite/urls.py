"""
Defines all endpoints and its corresponding views to serve and respond to requests to the application
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.shortcuts import render
from django.views.generic.base import TemplateView
from rest_framework.routers import DefaultRouter

from accounts.views import TaskViewSet, ChanceViewSet, AdminUserViewSet

task_router = DefaultRouter()
task_router.register("", TaskViewSet)

chance_router = DefaultRouter()
chance_router.register("", ChanceViewSet)

admin_router = DefaultRouter()
admin_router.register("", AdminUserViewSet)

def react_app(request):
    """
    Send the react bundled file to forward unmatched endpoints to be handled by react's router
    """
    try:
        return render(request, "index.html")  # Always return React's index.html
    except:
        return render(request, "not_found.html")

urlpatterns = [
    path('djangoadmin/', admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),

    path("tasks/", include(task_router.urls)),
    path("chances/", include(chance_router.urls)),
    path("admin/users/", include(admin_router.urls)),

    path("accounts/", include("accounts.urls")),
    path("accounts/", include("django.contrib.auth.urls")),

    re_path(r"^(?!api/).*", react_app),
]
