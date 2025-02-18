from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserProfile(models.Model):
    # user = models.OneToOneField(User, on_delete=models.CASCADE)
    # user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="profile")
    square_id = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username