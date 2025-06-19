from django.urls import path
from . import views

urlpatterns = [
    path('list_all_sellers/',views.list_all_sellers,name='list_all_sellers'),
    path('seller_approval/<str:id>/',views.seller_approval,name='seller_approval'),
    path('list_approved_sellers/',views.list_approved_sellers,name='list_approved_sellers'),
    path('block_seller/<str:id>/',views.block_seller,name='block_seller'),
]
