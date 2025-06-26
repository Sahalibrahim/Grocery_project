from django.urls import path
from . import views

urlpatterns = [
    path('register/',views.Register,name='Register'),
    path('list_all_users/',views.list_all_user,name='list_all_user'),
    path('list-users/',views.list_users,name='list-users'),
    path('login/',views.login,name='login'),
    path('block_user/<str:id>/',views.block_user,name='block_user'),
    path('logout/',views.logout,name='logout'),
]
