from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserGameStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_square = models.IntegerField(default=0)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - Stats"
