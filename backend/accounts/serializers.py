from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, UserGameStats

class UserGameStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGameStats
        fields = ["current_square", "score"]

class UserSerializer(serializers.ModelSerializer):
    usergamestats = UserGameStatsSerializer()

    class Meta:
        model = User
        fields = ["id", "username", "password", "usergamestats"]
        extra_kwargs = {"password": {"write_only": True}} # Nobody can read the password

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
        )
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "user", "square_id"],
        extra_kwargs = {"user": {"read_only": True}}
