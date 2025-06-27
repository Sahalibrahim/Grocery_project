from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/',views.Register,name='Register'),
    path('list_all_users/',views.list_all_user,name='list_all_user'),
    path('list-users/',views.list_users,name='list-users'),
    path('login/',views.login,name='login'),
    path('block_user/<str:id>/',views.block_user,name='block_user'),
    path('logout/',views.logout,name='logout'),
    path('get_user_info/',views.get_user_info,name='get_user_info'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify_token/', views.verify_token, name='verify_token'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)