from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserGameStats

@receiver(post_save, sender=User)
def create_user_game_stats(sender, instance, created, **kwargs):
    """
    Automatically create UserGameStats when a new User is created.
    Works for both normal users and superusers.
    """
    if created:
        UserGameStats.objects.create(user=instance)
