from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserGameStats, Task, Chance

class UserGameStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGameStats
        fields = ["current_square", "current_task", "task_completed", "score"]

class UserSerializer(serializers.ModelSerializer):
    usergamestats = UserGameStatsSerializer(required=False)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "password2", "usergamestats"]
        extra_kwargs = {"password": {"write_only": True}} # Nobody can read the password

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
        )
        UserGameStats.objects.get_or_create(user=user)
        return user

    def update(self, instance, validated_data):
        usergamestats_data = validated_data.pop('usergamestats', None)

        # Update User fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Update UserGameStats fields
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
