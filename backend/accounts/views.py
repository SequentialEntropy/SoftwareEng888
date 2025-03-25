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
    def post(self, request):
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
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class RetrieveUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class RankedUsersView(generics.ListAPIView):
    queryset = User.objects.select_related("usergamestats").order_by("-usergamestats__score")
    serializer_class = UserSerializer

class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Admin ViewSet to manage users and their game stats.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]  # Only admins can access this

    def get(self, request):
        print(request.user)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUser()]


class ChanceViewSet(viewsets.ModelViewSet):
    queryset = Chance.objects.all()
    serializer_class = ChanceSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUser()]


class SignUpView(APIView):
    permission_classes = [AllowAny]
    template_name = 'registration/signup.html'

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not check_password(old_password, user.password):
            return Response({"error": "Incorrect old password"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
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