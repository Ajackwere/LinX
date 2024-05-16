from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Category, Tag, Blog, Comment
from .models import Ad
from django.utils.text import slugify

    
class AdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = '__all__'
class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password1', 'password2']

    def create(self, validated_data):
        password1 = validated_data.pop('password1')
        password2 = validated_data.pop('password2')

        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match")

        user = User.objects.create_user(**validated_data)
        user.set_password(password1)
        user.save()
        return user
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Tag
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    likes = serializers.ReadOnlyField()
    dislikes = serializers.ReadOnlyField()

    class Meta:
        model = Comment
        fields = ['content', 'person', 'likes', 'dislikes', 'blog']
        read_only_fields = ['likes', 'dislikes']

class BlogSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False)
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)
    comments_count = serializers.SerializerMethodField()
    author_details = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'author', 'publish_date', 'category', 'tags', 'image', 'slug', 'comments_count', 'metadata', 'author_details']
        read_only_fields = ['author', 'comments_count', 'author_details']
    
    def get_comments_count(self, obj):
        return Comment.objects.filter(blog=obj).count()
    
    def get_author_details(self, obj):
        user_profile = obj.author.userprofile
        return UserProfileSerializer(user_profile).data
    

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        title = validated_data['title']
        slug = slugify(title)
        validated_data['slug'] = slug

        category_data = validated_data.pop('category', None)
        tags_data = validated_data.pop('tags', [])

        if category_data:
            validated_data['category'] = category_data

        blog = super().create(validated_data)

        blog.tags.set(tags_data)

        return blog
    
class UserProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    profile_picture = serializers.ImageField(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'first_name', 'last_name', 'profile_picture', 'bio', 'website', 'location', 'is_author']
