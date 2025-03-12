from django.contrib.auth.models import User
from django.shortcuts import render

from rest_framework import generics, status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task, Chance
from .serializers import UserSerializer, TaskSerializer, ChanceSerializer

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

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_permissions(self):
        """
        Set different permissions for viewing and editing.
        """
        if self.action in ["list", "retrieve"]:  # Viewing - GET requests
            return [AllowAny()]
        return [IsAdminUser()]  # Editing - POST, PUT, PATCH, DELETE

class ChanceViewSet(viewsets.ModelViewSet):
    queryset = Chance.objects.all()
    serializer_class = ChanceSerializer

    def get_permissions(self):
        """
        Set different permissions for viewing and editing.
        """
        if self.action in ["list", "retrieve"]:  # Viewing - GET requests
            return [AllowAny()]
        return [IsAdminUser()]  # Editing - POST, PUT, PATCH, DELETE

class SignUpView(APIView):
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
