from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from .forms import UserProfileForm
from .models import UserProfile, Tag, Category, Blog, Comment, User, LoginLogoutLog, Ad
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import UserProfileSerializer, CategorySerializer, TagSerializer, CommentSerializer, BlogSerializer, UserSerializer, AdSerializer
from rest_framework.decorators import action, api_view
from django.contrib.auth.models import User
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Sum
from django.utils import timezone
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from django.views.decorators.csrf import csrf_exempt


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
    def logout(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['POST'])
    def make_author(self, request):
        username = request.data.get('username')
        user = User.objects.get(username=username)
        if user:
            user.userprofile.is_author = True
            user.userprofile.save()
            return Response({'message': 'User is now an author.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error_message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

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
    
    @action(detail=True, methods=['POST'])
    def like_comment(self, request, pk=None):
        comment = self.get_object()
        comment.likes += 1
        comment.save()
        return Response({'message': 'Comment liked successfully'})

    @action(detail=True, methods=['POST'])
    def dislike_comment(self, request, pk=None):
        comment = self.get_object()
        comment.dislikes += 1
        comment.save()
        return Response({'message': 'Comment disliked successfully'})
    


class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        comments_count = Comment.objects.filter(blog=instance).count()
        data = serializer.data
        data['comments_count'] = comments_count
        return Response(data)
    

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'User is not authenticated.'}, status=status.HTTP_401_UNAUTHORIZED)

        user_profile = request.user.userprofile

        if user_profile.is_author:
            request.data['author_id'] = request.user.id
            return super().create(request, *args, **kwargs)
        else:
            raise PermissionDenied(detail='User is not authorized to create a blog.')
        
@api_view(['GET'])
def total_signed_users(request):
    total_users = User.objects.count()
    return Response({'total_signed_users': total_users})

@api_view(['GET'])
def total_users_logged_in_today(request):
    today = timezone.now().date()
    total_logged_in_users = LoginLogoutLog.objects.filter(login_time__date=today).values('user').distinct().count()
    return Response({'total_logged_in_users_today': total_logged_in_users})

@api_view(['GET'])
def total_posts(request):
    total_posts = Blog.objects.count()
    return Response({'total_posts': total_posts})

@api_view(['GET'])
def total_authors(request):
    total_authors = UserProfile.objects.filter(is_author=True).count()
    return Response({'total_authors': total_authors})

@api_view(['GET'])
def list_of_posts(request):
    posts = Blog.objects.all()
    serializer = BlogSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def list_of_authors(request):
    authors = UserProfile.objects.filter(is_author=True)
    serializer = UserProfileSerializer(authors, many=True)
    return Response(serializer.data)

class AdViewSet(viewsets.ModelViewSet):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

@api_view(['GET'])
def author_details(request, author_id):
    try:
        author = User.objects.get(id=author_id)
    except User.DoesNotExist:
        return Response({'error_message': 'Author not found.'}, status=status.HTTP_404_NOT_FOUND)

    total_blogs = Blog.objects.filter(author=author).count()
    total_likes = Comment.objects.filter(blog__author=author).aggregate(total_likes=Sum('likes'))['total_likes']
    first_name = author.first_name
    last_name = author.last_name
    email = author.email

    data = {
        'total_blogs': total_blogs,
        'total_likes': total_likes,
        'first_name': first_name,
        'last_name': last_name,
        'email': email
    }
    return Response(data)
