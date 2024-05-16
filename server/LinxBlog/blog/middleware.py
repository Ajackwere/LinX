from django.http import JsonResponse
from .models import MaintenanceMode
from django.urls import reverse


class MaintenanceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        maintenance_mode, created = MaintenanceMode.objects.get_or_create(id=1)

        admin_url = reverse('admin:index')

        is_admin_request = request.path.startswith(admin_url)

        # Allow access to admin URL even if maintenance mode is active
        if maintenance_mode.is_active and not is_admin_request:
            return JsonResponse({'message': 'Site under maintenance'}, status=503)

        return self.get_response(request)
    