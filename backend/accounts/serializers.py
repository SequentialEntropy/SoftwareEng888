from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserGameStats

class UserGameStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGameStats
        fields = ["current_square", "score"]

class UserSerializer(serializers.ModelSerializer):
    usergamestats = UserGameStatsSerializer(required=False)

    class Meta:
        model = User
        fields = ["id", "username", "password", "usergamestats"]
        extra_kwargs = {"password": {"write_only": True}} # Nobody can read the password

    def create(self, validated_data):
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
