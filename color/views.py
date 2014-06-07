from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404


def home(request):
    
    template_name = "color/home.html"
    context = dict()

    return render(request, template_name, context)
