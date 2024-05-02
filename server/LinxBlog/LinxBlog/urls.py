from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from blog.views import UserProfileViewSet, CategoryViewSet, TagViewSet, CommentViewSet, BlogViewSet, index, UserViewSet, total_signed_users, total_users_logged_in_today, total_posts, total_authors, list_of_posts, list_of_authors, AdViewSet, author_details


schema_view = get_schema_view(
    openapi.Info(
        title="LinX blog API",
        default_version='v1',
        description="API documentation for LinX Blog Project",
        terms_of_service="https://github.com/Ajackwere",
        contact=openapi.Contact(email="austinewere9@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

router = DefaultRouter()
router.register(r'userprofiles', UserProfileViewSet, basename='userprofile')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'blogs', BlogViewSet, basename='blog')
router.register(r'users', UserViewSet, basename='user')
router.register(r'ads', AdViewSet, basename='ad')


urlpatterns = [
    path('', include(router.urls)),
    path('total-signed-users/', total_signed_users, name='total_signed_users'),
    path('total-users-logged-in-today/', total_users_logged_in_today, name='total_users_logged_in_today'),
    path('total-posts/', total_posts, name='total_posts'),
    path('total-authors/', total_authors, name='total_authors'),
    path('list-of-posts/', list_of_posts, name='list_of_posts'),
    path('list-of-authors/', list_of_authors, name='list_of_authors'),
    path('author-details/<int:author_id>/', author_details, name='author_details'),
    path('swagger/', schema_view.with_ui('swagger',
         cache_timeout=0), name='schema-swagger-ui'),
    path('swagger.json', schema_view.without_ui(
        cache_timeout=0), name='schema-json'),
    path('admin/', admin.site.urls),
]
