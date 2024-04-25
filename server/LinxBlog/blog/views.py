from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from .forms import UserProfileForm
from .models import UserProfile, Tag, Category, Blog, Comment, User, LoginLogoutLog
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import UserProfileSerializer, CategorySerializer, TagSerializer, CommentSerializer, BlogSerializer, UserSerializer
from rest_framework.decorators import action, api_view
from django.contrib.auth.models import User
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Count
from django.utils import timezone



def index(request):
    return Response("Welcome to LinX blogsite server. Navigate to /swagger to see the documentation")

class UserViewSet(viewsets.ViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='User username'),
                'password1': openapi.Schema(type=openapi.TYPE_STRING, description='User password'),
                'password2': openapi.Schema(type=openapi.TYPE_STRING, description='Password confirmation'),
            },
            required=['username', 'password1', 'password2']
        )
    )
    def get_serializer(self, *args, **kwargs):
        if 'data' in kwargs:
            data = kwargs['data']
            if isinstance(data, list):
                kwargs['many'] = True
        return self.serializer_class(*args, **kwargs)


    @action(detail=False, methods=['POST'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password1']
            user = User.objects.create_user(username=username, password=password)
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['POST'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({'error_message': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['POST'])
    def logout(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
    
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
    def profile(self, request):
        user = request.user
        return render(request, 'profile.html', {'user': user})


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

    def create(self, request, *args, **kwargs):
        author = request.user  # This assumes the author is the logged in user

        request.data['author'] = author.id
        
        return super().create(request, *args, **kwargs)
    


@api_view(['GET'])
def total_signed_users(request):
    total_users = User.objects.count()
    return Response({'total_signed_users': total_users})

@api_view(['GET'])
def total_users_logged_in_today(request):
    today = timezone.now().date()
    total_logged_in_users = LoginLogoutLog.objects.filter(timestamp__date=today).values('user').distinct().count()
    return Response({'total_logged_in_users_today': total_logged_in_users})

@api_view(['GET'])
def total_posts(request):
    total_posts = Blog.objects.count()
    return Response({'total_posts': total_posts})

@api_view(['GET'])
def total_authors(request):
    total_authors = Blog.objects.values('author').distinct().count()
    return Response({'total_authors': total_authors})

@api_view(['GET'])
def list_of_posts(request):
    posts = Blog.objects.all()
    serializer = BlogSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def list_of_authors(request):
    authors = User.objects.filter(blog__isnull=False).distinct()
    serializer = UserSerializer(authors, many=True)
    return Response(serializer.data)
