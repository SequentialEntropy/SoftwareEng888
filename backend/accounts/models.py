from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class UserProfile(models.Model):
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    # user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="profile")
    square_id = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username

class UserGameStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_square = models.IntegerField(default=0)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - Stats"

# Automatically create UserGameStats when a new User is created
@receiver(post_save, sender=User)
def create_user_game_stats(sender, instance, created, **kwargs):
    if created:
        UserGameStats.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_game_stats(sender, instance, **kwargs):
    instance.usergamestats.save()
