from django.contrib.auth.models import User
from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
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

class RetrieveTasksView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Task.objects.all()

class RetrieveChancesView(generics.ListAPIView):
    serializer_class = ChanceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Chance.objects.all()

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
