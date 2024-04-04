from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = self.name.lower().replace(' ', '-')
        super(Category, self).save(*args, **kwargs)

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = self.name.lower().replace(' ', '-')
        super(Tag, self).save(*args, **kwargs)

class Blog(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    publish_date = models.DateTimeField(auto_now_add=True)

    slug = models.SlugField(max_length=255, unique=True, blank=True) 
    category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True)
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    content = models.TextField()
    likes = models.PositiveIntegerField(default=0)  # Store like count directly
    dislikes = models.PositiveIntegerField(default=0)  # Store dislike count directly
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.content[:25]}..."

