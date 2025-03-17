from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserGameStats, Task, Chance
from rest_framework.serializers import Serializer, CharField

class UserGameStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGameStats
        fields = ["current_square", "current_task", "task_completed", "score"]

class UserSerializer(serializers.ModelSerializer):
    usergamestats = UserGameStatsSerializer(required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "usergamestats"]  # Removed password & is_staff
        extra_kwargs = {
            "username": {"required": False}, 
            "email": {"required": False}
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)  # Ensure password is handled separately
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        validated_data.pop("password", None)  # Prevent accidental password overwrites
        validated_data.pop("is_staff", None)  # Prevent permission issues

        # Update User fields
        if "username" in validated_data:
            instance.username = validated_data["username"]
        if "email" in validated_data:
            instance.email = validated_data["email"]

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
    class Meta:
        model = Task
        fields = "__all__"

class ChanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chance
        fields = "__all__"

class ChangePasswordSerializer(Serializer):
    old_password = CharField(required=True)
    new_password = CharField(required=True)
