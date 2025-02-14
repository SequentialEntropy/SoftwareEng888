from django.shortcuts import render


# Create your views here.

from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

def dashboard(request):
    return render(request, 'dashboard.html')