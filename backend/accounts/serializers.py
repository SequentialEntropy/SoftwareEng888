from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    # square_id = serializers.IntegerField(source="profile.square_id", allow_null=True)

    class Meta:
        model = User
        # fields = ["id", "username", "password", "square_id"]
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}} # Nobody can read the password

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
        )
        return user
    
    # def update(self, instance, validated_data):
    #     profile_data = validated_data.pop("profile", {})
    #     square_id = profile_data.get("square_id")

    #     instance.username = validated_data.get("username", instance.username)
    #     instance.email = validated_data.get("email", instance.email)
    #     instance.save()

    #     if square_id:
    #         instance.profile.square_id = square_id
    #         instance.profile.save()

    #     return instance
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "user", "square_id"],
        extra_kwargs = {"user": {"read_only": True}}