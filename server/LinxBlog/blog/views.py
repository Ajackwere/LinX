from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from .forms import UserProfileForm
from .models import UserProfile, Tag, Category, Blog, Comment, User, LoginLogoutLog, Ad, Subscriber, MaintenanceMode
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import UserProfileSerializer, CategorySerializer, TagSerializer, CommentSerializer, BlogSerializer, UserSerializer, AdSerializer, SubscriberSerializer
from rest_framework.decorators import action, api_view
from django.contrib.auth.models import User
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Sum
from django.utils import timezone
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.exceptions import PermissionDenied, ValidationError, AuthenticationFailed
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, BaseAuthentication 
from rest_framework.views import APIView
from django.contrib.sessions.backends.db import SessionStore


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # Disable CSRF check

def index(request):
    return Response("Welcome to LinX blogsite server. Navigate to /swagger to see the documentation")

def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})

class JsonSessionAuthentication(BaseAuthentication):
    def authenticate(self, request):
        session_key = request.data.get('session_id')
        if session_key:
            try:
                session = SessionStore(session_key=session_key)
                user_id = session['_auth_user_id']
                user = User.objects.get(pk=user_id)
                return (user, None)
            except Exception as e:
                raise AuthenticationFailed('Invalid session ID')
        return None
    
class LoginView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            session_key = request.session.session_key
            
            try:
                user_profile = UserProfile.objects.get(user=user)
                user_profile_data = UserProfileSerializer(user_profile).data
            except UserProfile.DoesNotExist:
                user_profile_data = None
            
            response_data = {
                'message': 'Login successful',
                'session_id': session_key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'user_profile': user_profile_data
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
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
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]


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
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]



class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]



class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]

    
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
    authentication_classes = [CsrfExemptSessionAuthentication, JsonSessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        comments_count = Comment.objects.filter(blog=instance).count()
        data = serializer.data
        data['comments_count'] = comments_count
        if instance.image:
            data['image_url'] = instance.image.url
        else:
            data['image_url'] = None
        
        author_profile = instance.author.userprofile
        data['author'] = {
            'username': author_profile.user.username,
            'email': author_profile.user.email,
            'profile_picture': author_profile.profile_picture.url if author_profile.profile_picture else None,
        }

        maintenance_mode, _ = MaintenanceMode.objects.get_or_create(id=1)
        data['maintenance_mode'] = maintenance_mode.is_active


        return Response(data)
    

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'User is not authenticated.'}, status=status.HTTP_401_UNAUTHORIZED)

        user_profile = request.user.userprofile

        if user_profile.is_author:
            request.data['author_id'] = request.user.id
            request.data['author_id'] = request.user.id
            try:
                return super().create(request, *args, **kwargs)
            except ValidationError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)            
        else:
            raise PermissionDenied(detail='User is not authorized to create a blog.')
    
    @action(detail=False, methods=['GET'])
    def posts_by_category(self, request):
        category_id = request.query_params.get('category_id')
        if category_id is not None:
            try:
                category_id = int(category_id)
            except ValueError:
                return Response({'error': 'Category ID must be an integer.'}, status=status.HTTP_400_BAD_REQUEST)

            blogs = Blog.objects.filter(category=category_id)
            serializer = BlogSerializer(blogs, many=True)
            return Response(serializer.data)
        else:
            return Response({'error': 'Category ID parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
           
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
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    

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

@api_view(['GET'])
def search_blogs(request):
    query = request.query_params.get('q', None)
    if query:
        blogs = Blog.objects.filter(title__icontains=query) | Blog.objects.filter(content__icontains=query)
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)
    else:
        return Response({'error': 'No search query provided'}, status=status.HTTP_400_BAD_REQUEST)

class SubscriberViewSet(viewsets.ModelViewSet):
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer
    http_method_names = ['get', 'post', 'delete']
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]


    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Subscriber.objects.filter(email=email).exists():
            return Response({'error': 'This email is already subscribed.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required to unsubscribe.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            subscriber = Subscriber.objects.get(email=email)
            subscriber.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Subscriber.DoesNotExist:
            return Response({'error': 'This email is not subscribed.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def maintenance_mode_status(request):
    maintenance_mode, _ = MaintenanceMode.objects.get_or_create(id=1)
    return Response({'maintenance_mode': maintenance_mode.is_active})
