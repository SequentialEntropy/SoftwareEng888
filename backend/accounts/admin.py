"""
This file ensures that all our models are accessible through django's built-in admin page
"""
from django.contrib import admin
from .models import UserGameStats, Task, Chance

admin.site.register(UserGameStats)
admin.site.register(Task)
admin.site.register(Chance)
