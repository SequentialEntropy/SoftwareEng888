"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
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
