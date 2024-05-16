from django.http import JsonResponse
from .models import MaintenanceMode

class MaintenanceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        maintenance_mode, created = MaintenanceMode.objects.get_or_create(id=1)
        if maintenance_mode.is_active:
            return JsonResponse({'message': 'Site under maintenance'}, status=503)
        return self.get_response(request)
