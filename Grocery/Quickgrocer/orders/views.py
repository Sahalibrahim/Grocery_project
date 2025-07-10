from rest_framework.decorators import api_view,permission_classes
from users.permissions import role_required 
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from products.models import Category,Product,Cart,Wishlist
from users.models import Address
from .models import Order,OrderItem
from .serializers import OrderDetailSerializer,OrderItemSerializer

# Saving the order details to order and order item table
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def proceed_to_checkout(request):
    user = request.user
    cart_items = Cart.objects.filter(user=user)
    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=400)
    
    Order.objects.filter(user=user, payment_status='pending').update(payment_status='failed')

    # Calculate total
    subtotal = 0
    for item in cart_items:
        price = item.product.discount_price or item.product.price
        subtotal += price * item.quantity

    promo_code = request.data.get('promo_code', None)
    promo_discount = 0
    if promo_code == "SAVE10":
        promo_discount = subtotal * 0.10
    elif promo_code == "FLAT50" and subtotal > 200:
        promo_discount = 50
    # add other promo logic...

    delivery_fee = 0 if subtotal > 500 else 40
    total = subtotal - promo_discount + delivery_fee

    address = Address.objects.filter(user=user, is_default=True).first()
    if not address:
        return Response({'error': 'No default address set'}, status=400)

    # Create order
    order = Order.objects.create(
        user=user,
        address=address,
        total_amount=total,
        promo_code=promo_code,
        payment_status='pending'
    )

    # Create order items
    for item in cart_items:
        price = item.product.discount_price or item.product.price
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=price
        )

    # Optionally clear cart
    # cart_items.delete()

    # Return order details
    serialized_order = OrderDetailSerializer(order,context={'request': request})
    return Response(serialized_order.data, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cod_payment_success(request):
    user = request.user
    order_id = request.data.get("order_id")
    cart_items = Cart.objects.filter(user=user)

    try:
        order = Order.objects.get(id=order_id, user=request.user)
        order.payment_method = "cod"
        order.payment_status = "success"
        order.save()
        cart_items.delete()

        serializer = OrderDetailSerializer(order,context={'request': request})
        return Response(serializer.data, status=200)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)
    
# fetch order to my orders page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_orders(request):
    user = request.user
    orders = Order.objects.filter(user=user)
    serializer = OrderDetailSerializer(orders,many=True,context={'request':request})
    return Response(serializer.data,status=200)
