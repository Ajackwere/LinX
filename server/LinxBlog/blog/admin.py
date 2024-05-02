from django.contrib import admin
from .models import Category, Tag, Blog, Comment, Ad, UserProfile

def make_author(modeladmin, request, queryset):
    queryset.update(is_author=True)

make_author.short_description = "Make selected users authors"

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_author')
    actions = [make_author]

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Blog)
admin.site.register(Comment)
admin.site.register(Ad)