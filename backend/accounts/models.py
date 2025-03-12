from django.db import models
from django.contrib.auth.models import User

class UserGameStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_square = models.IntegerField(default=0)
    current_task = models.IntegerField(default=-1)
    task_completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - Stats"

class Task(models.Model):
    description = models.TextField()
    applicable_squares = models.JSONField(default=list)
    score_to_award = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.description}"

class Chance(models.Model):
    description = models.TextField()
    score_to_award = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.description}"
