from django.http import JsonResponse
from django.urls import reverse
from django.utils.decorators import decorator_from_middleware
from .models import MaintenanceMode

class MaintenanceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.admin_urls = [
            reverse('admin:index'),
            'https://lin-x.vercel.app/admin/',
            'https://lin-x.vercel.app/admin/posts',
            'https://lin-x.vercel.app/admin/dashboard'
        ]

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_request(self, request):
        path = request.path_info.lstrip('/')
        
        if any(path.startswith(url) for url in self.admin_urls):
            return None
        
        if request.method == 'GET' and path.startswith('blog/'):
            maintenance_mode, _ = MaintenanceMode.objects.get_or_create(id=1)
            if maintenance_mode.is_active:
                return JsonResponse({'error': 'Service Unavailable. The Website is Under Maintenance.'}, status=503)
        
        return None
