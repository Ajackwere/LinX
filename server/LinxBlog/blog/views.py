from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from .forms import UserProfileForm
from .models import UserProfile, Tag, Category, Blog, Comment
from rest_framework import viewsets
from rest_framework.response import Response
from .serializers import UserProfileSerializer, CategorySerializer, TagSerializer, CommentSerializer, BlogSerializer, UserSerializer
from rest_framework.decorators import action


def index(request):
    return Response("Welcome to LinX blogsite server. Navigate to /swagger to see the documentation")

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    @action(detail=False, methods=['POST'])
    def update_profile(self, request):
        if request.method == 'POST':
            form = UserProfileForm(request.POST, request.FILES, instance=request.user.userprofile)
            if form.is_valid():
                form.save()
                return redirect('accounts_profile')
        else:
            form = UserProfileForm(instance=request.user.userprofile)
        return render(request, 'update_profile.html', {'form': form})

    @action(detail=False, methods=['GET'])
    def logout_view(self, request):
        logout(request)
        return redirect('login')

    @action(detail=False, methods=['GET'])
    def profile(self, request):
        user = request.user
        return render(request, 'profile.html', {'user': user})

    @action(detail=False, methods=['POST'])
    def register(self, request):
        if request.method == 'POST':
            form = UserCreationForm(request.POST)
            if form.is_valid():
                user = form.save()
                UserProfile.objects.create(user=user)
                username = form.cleaned_data.get('username')
                raw_password = form.cleaned_data.get('password1')
                user = authenticate(username=username, password=raw_password)
                login(request, user)
                return redirect('update_profile')  
        else:
            form = UserCreationForm()
        return render(request, 'registration/register.html', {'form': form})


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
