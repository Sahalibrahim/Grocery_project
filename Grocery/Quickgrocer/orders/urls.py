from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('proceed_to_checkout/',views.proceed_to_checkout,name='proceed_to_checkout'),
    path('cod_payment_success/',views.cod_payment_success,name='cod_payment_success'),
    path('get_all_orders/',views.get_all_orders,name='get_all_orders'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)