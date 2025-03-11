from django.contrib import admin
from .models import UserGameStats, Task, Chance

# Register your models here.
admin.site.register(UserGameStats)
admin.site.register(Task)
admin.site.register(Chance)
