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
    path('create_address/',views.create_address,name='create_address'),
    path('list_address/',views.list_address,name='list_address'),
    path('enable_default/<int:address_id>/',views.enable_default,name='enable_default'),
    path('update_address/<int:address_id>/',views.update_address,name='update_address'),
    path('delete_address/<int:address_id>/',views.delete_address,name='delete_address'),
    path('edit_user/',views.edit_user,name='edit_user'),
    path('update_profilepic/',views.update_profilepic,name='update_profilepic'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)