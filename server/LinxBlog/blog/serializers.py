from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Category, Tag, Blog, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Tag
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'

class BlogSerializer(serializers.ModelSerializer):
    
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True) 
    author = UserSerializer(read_only=True)

    class Meta:
        model = Blog
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = '__all__'
