from rest_framework import serializers
from products.serializers import ProductSerializer
from .models import Order,OrderItem
from users.serializers import AddressSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    address = AddressSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'address', 'total_amount', 'promo_code', 'payment_status','payment_method', 'created_at', 'items']
