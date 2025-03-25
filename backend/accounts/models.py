"""
Defines all custom models used in the application
"""
import uuid
from django.db import models
from django.contrib.auth.models import User

class UserGameStats(models.Model):
    """
    Stores custom game data in a one-to-one with the django's built-in User model
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_square = models.IntegerField(default=0)
    current_task = models.IntegerField(default=-1)
    task_completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)

    def __str__(self):
        """
        String summary of the model
        """
        return f"{self.user.username} - Stats"

class PasswordResetToken(models.Model):
    """
    Generates unique password reset tokens with a UUID generator
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        """
        Checks if the token is valid
        """
        from datetime import timedelta, timezone, datetime
        return datetime.now(timezone.utc) - self.created_at < timedelta(hours=1)

class Task(models.Model):
    """
    Represents the tasks the users need to complete in each square
    """
    description = models.TextField()
    applicable_squares = models.JSONField(default=list)
    score_to_award = models.IntegerField(default=10)

    def __str__(self):
        """
        String summary of the model
        """
        return f"{self.description}"

class Chance(models.Model):
    """
    Represents the random chance cards when the player lands the spinner on a 6
    """
    description = models.TextField()
    score_to_award = models.IntegerField(default=0)

    def __str__(self):
        """
        String summary of the model
        """
        return f"{self.description}"
