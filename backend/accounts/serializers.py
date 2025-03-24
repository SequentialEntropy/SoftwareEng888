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
        fields = ["id", "username", "password", "is_staff", "email", "usergamestats"]
        extra_kwargs = {
            "username": {"required": False},
            "password": {"write_only": True, "required": False},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data["email"],
        )
        return user

    def update(self, instance, validated_data):
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
