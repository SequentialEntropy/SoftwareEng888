from django.contrib.auth.models import User
from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class RankedUsersView(generics.ListAPIView):
    queryset = User.objects.select_related("usergamestats").order_by("-usergamestats__score")
    serializer_class = UserSerializer

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
