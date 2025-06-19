from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

def role_required(allowed_roles=[]):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            jwt_auth = JWTAuthentication()
            try:
                user, token = jwt_auth.authenticate(request)
            except Exception:
                return Response({'error': 'Invalid or missing token'}, status=status.HTTP_401_UNAUTHORIZED)

            role = user.role
            if role not in allowed_roles:
                return Response({'error': 'You do not have permission'}, status=status.HTTP_403_FORBIDDEN)
            
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator
