"""
Connects the views in views.py to the database, as an intermediary to serialise data
"""
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserGameStats, Task, Chance
from rest_framework.serializers import Serializer, CharField

class UserGameStatsSerializer(serializers.ModelSerializer):
    """
    Serialises all fields in UserGameStats for each user's game progress to be saved in the database
    """
    class Meta:
        """
        Defines which fields are exposed
        """
        model = UserGameStats
        fields = ["current_square", "current_task", "task_completed", "score"]

class UserSerializer(serializers.ModelSerializer):
    """
    Serialises the user's details to be stored in the database
    """
    usergamestats = UserGameStatsSerializer(required=False)

    class Meta:
        """
        Defines only the required features of the User class to be exposed, and access rights.
        Users should not be able to read their password (as they are hashed)
        """
        model = User
        fields = ["id", "username", "password", "is_staff", "email", "usergamestats"]
        extra_kwargs = {
            "username": {"required": False},
            "password": {"write_only": True, "required": False},
        }

    def create(self, validated_data):
        """
        Creates a new user upon signup
        """
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data["email"],
        )
        return user

    def update(self, instance, validated_data):
        """
        Updates the user's fields, as well as fields in UserGameStats if provided
        """
        # Update User fields
        if "username" in validated_data:
            instance.username = validated_data["username"]
        if "email" in validated_data:
            instance.email = validated_data["email"]
        if "is_staff" in validated_data:
            instance.is_staff = validated_data["is_staff"]
        if "password" in validated_data:
            instance.set_password(validated_data["password"])

        instance.save()

        # Update UserGameStats fields if provided
        usergamestats_data = validated_data.pop("usergamestats", None)
        if usergamestats_data:
            user_game_stats = instance.usergamestats
            for attr, value in usergamestats_data.items():
                setattr(user_game_stats, attr, value)
            user_game_stats.save()

        return instance

class TaskSerializer(serializers.ModelSerializer):
    """
    Serialises the task details for tasks to be stored in the database.
    """
    class Meta:
        """
        Defines which fields are exposed
        """
        model = Task
        fields = "__all__"

class ChanceSerializer(serializers.ModelSerializer):
    """
    Serialises the chance details for tasks to be stored in the database.
    """
    class Meta:
        """
        Defines which fields are exposed
        """
        model = Chance
        fields = "__all__"

class ChangePasswordSerializer(Serializer):
    """
    Defines mandatory old and new password fields to change a user's password
    """
    old_password = CharField(required=True)
    new_password = CharField(required=True)
