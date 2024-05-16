from django.contrib import admin
from .models import Category, Tag, Blog, Comment, Ad, UserProfile, MaintenanceMode

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
@admin.register(MaintenanceMode)
class MaintenanceModeAdmin(admin.ModelAdmin):
    list_display = ['is_active']
    actions = ['activate_maintenance_mode', 'deactivate_maintenance_mode']

    def activate_maintenance_mode(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, "Maintenance mode activated")
    activate_maintenance_mode.short_description = "Activate Maintenance Mode"

    def deactivate_maintenance_mode(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, "Maintenance mode deactivated")
    deactivate_maintenance_mode.short_description = "Deactivate Maintenance Mode"
    