from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from blog.views import UserProfileViewSet, CategoryViewSet, TagViewSet, CommentViewSet, BlogViewSet, index, UserViewSet

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

urlpatterns = [
    path('', include(router.urls)),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('admin/', admin.site.urls),
]
