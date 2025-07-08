from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('add_category/',views.add_category,name='add_category'),
    path('list_category/',views.list_category,name='list_category'),
    path('add_product/',views.add_product,name='add_product'),
    path('list_all_products/',views.list_all_products,name='list_all_products'),
    path('list_single_product/<int:id>/',views.list_single_product,name='list_single_product'),
    path('add_to_cart/',views.add_to_cart,name='add_to_cart'),
    path('list_cart/',views.list_cart,name='list_cart'),
    path('list_all_seller_products/',views.list_all_seller_products,name='list_all_seller_products'),
    path('remove_from_cart/<str:cart_id>/',views.remove_from_cart,name='remove_from_cart'),
    path('update_product/<int:product_id>/',views.update_product,name="update_product"),
    path('delete_product/<int:product_id>/',views.delete_product,name='delete_product'),
    path('home_products/',views.home_products,name='home_products'),
    path('get_discount_products/',views.get_discount_products,name='discount_products'),
    path('all_products/',views.all_products,name='all_products'),
    path('wishlist/<int:product_id>/toggle/', views.toggle_wishlist, name='toggle-wishlist'),
    path('wishlist/', views.my_wishlist, name='my-wishlist'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)