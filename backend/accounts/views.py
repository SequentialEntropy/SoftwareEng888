"""
This file defines all the views to deliver data to endpoints defined in urls.py
"""
from django.contrib.auth.models import User
from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import generics, status, viewsets, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password

from .models import Task, Chance, PasswordResetToken
from .serializers import UserSerializer, TaskSerializer, ChanceSerializer, ChangePasswordSerializer

from django.core.mail import send_mail
from django.conf import settings
import json
import yagmail

@method_decorator(csrf_exempt, name="dispatch")
class ForgotPwdRequestView(View):
    """
    Handles forgot password queries
    """
    def post(self, request):
        """
        Receives a request to the forgot password endpoint,
        then generates a link for the user to reset their password.
        The link is then sent to the user via email.
        """
        print("✅ ForgotPwdRequestView HIT")

        body = json.loads(request.body.decode("utf-8"))
        username = body.get("username")
        print("🔍 Username received:", username)

        try:
            user = User.objects.get(username=username)
            print("✅ User found:", user)

            reset_token = PasswordResetToken.objects.create(user=user)
            print("🪪 Reset token created:", reset_token.token)

            reset_link = f"{settings.FRONTEND_URL}/forgot-password?user_id={user.id}&token={reset_token.token}"
            print("🔗 Reset link:", reset_link)

            try:
                subject = "Password Reset"
                message = f"Click the link to reset your password: {reset_link}"

                yag = yagmail.SMTP(settings.EMAIL_USER, settings.EMAIL_PASSWORD)
                yag.send(to=user.email, subject=subject, contents=message)

                print(f"📨 Email sent to: {user.email}")
            except Exception as e:
                print("❌ Error sending email:", e)

        except User.DoesNotExist:
            print("⚠️ Username not found")

        return JsonResponse({"message": "If the username exists, a reset link has been sent."})


class CreateUserView(generics.CreateAPIView):
    """
    Allows users to be created.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class RetrieveUserView(generics.RetrieveUpdateAPIView):
    """
    Allows users to view and update their own data.
    Users can only access their own data.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Returns the user instance to process account data
        """
        return self.request.user


class RankedUsersView(generics.ListAPIView):
    """
    Allows users to view a list of all users, ordered by highest score.
    All users can call access this view.
    Used for displaying the leaderboard.
    """
    queryset = User.objects.select_related("usergamestats").order_by("-usergamestats__score")
    serializer_class = UserSerializer

class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Admin ViewSet to manage users and their game stats.
    Only admins can access this view.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]  # Only admins can access this

class TaskViewSet(viewsets.ModelViewSet):
    """
    Task ViewSet to manage tasks and their fields.
    All users can retrieve using this view.
    Only admins can edit or delete using this view.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_permissions(self):
        """
        Set different permissions for viewing and editing.
        """
        if self.action in ["list", "retrieve"]: # Viewing - All Users (GET)
            return [AllowAny()]
        return [IsAdminUser()] # Editing - Admin Only (POST, PUT, DELETE)


class ChanceViewSet(viewsets.ModelViewSet):
    """
    Task ViewSet to manage chances and their fields.
    All users can retrieve using this view.
    Only admins can edit or delete using this view.
    """
    queryset = Chance.objects.all()
    serializer_class = ChanceSerializer

    def get_permissions(self):
        """
        Set different permissions for viewing and editing.
        """
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUser()]


class SignUpView(APIView):
    """
    Handles users signing up by creating new accounts.
    """
    permission_classes = [AllowAny]
    template_name = 'registration/signup.html'

    def get(self, request):
        """
        Handle GET request to render the signup form.
        """
        return render(request, self.template_name)

    def post(self, request):
        """
        Handle POST request to create a new user.
        """
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    Handles users changing passwords
    """
    permission_classes = [permissions.IsAuthenticated]  # Require authentication

    def post(self, request):
        """
        Verifies if the old password is correct, then sets the new password.
        """
        user = request.user  # Get the logged-in user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        # Verify if the provided old password is correct
        if not check_password(old_password, user.password):
            return Response({"error": "Incorrect old password"}, status=status.HTTP_400_BAD_REQUEST)

        # If correct, update the password
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    """
    Uses a password reset link to set a new password for the user.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Checks if the user entered the correct token in the password reset url.
        Resets password is the token is valid.
        """
        user_id = request.data.get("user_id")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not all([user_id, token, new_password]):
            return Response({"error": "Missing data"}, status=400)

        try:
            user = User.objects.get(id=user_id)
            reset_token = PasswordResetToken.objects.get(user=user, token=token)

            if not reset_token.is_valid():
                return Response({"error": "Token expired"}, status=400)

            user.set_password(new_password)
            user.save()
            reset_token.delete()

            return Response({"message": "Password reset successful"}, status=200)

        except (User.DoesNotExist, PasswordResetToken.DoesNotExist):
            return Response({"error": "Invalid token or user"}, status=400)


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        username = user.username
        user.delete()
        return Response({"message": f"User '{username}' deleted successfully."})