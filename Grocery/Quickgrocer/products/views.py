from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from users.permissions import role_required
from .serializers import CategorySerializer,ProductSerializer,CartSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import Category,Product,Cart
from users.models import Users
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated


class ProductPagination(PageNumberPagination):
    page_size = 6  # Default items per page
    page_size_query_param = 'page_size'  # Allow client to override page size
    max_page_size = 100

# Adding category
@api_view(['POST'])
@role_required(allowed_roles=['seller','admin'])
def add_category(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=200)
    return Response(serializer.errors,status=400)

# Listing Categories
@api_view(['GET'])
@role_required(allowed_roles=['seller','admin'])
def list_category(request):
    categories = Category.objects.all()
    if categories:
        serializer = CategorySerializer(categories,many=True)
        return Response(serializer.data,status=200)
    return Response({"message":"There is no categories."},status=200)

# Add products
@api_view(['POST'])
@role_required(allowed_roles=['seller','admin'])
def add_product(request):
    print(request.data)
    print(request.FILES)
    seller = request.user
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(seller=seller)
        return Response(serializer.data,status=201)
    return Response(serializer.errors,status=400)

# Listing all products(for admin)
# @api_view(['GET'])
# @role_required(allowed_roles=['seller','admin'])
# def list_all_products(request):
#     products = Product.objects.all()
#     if products:
#         serializer = ProductSerializer(products,many=True)
#         return Response(serializer.data,status=200)
#     return Response({"error":"There no products"},status=200)
@api_view(['GET'])
@role_required(allowed_roles=['seller','admin'])
def list_all_products(request):
    search = request.query_params.get('search','')
    category = request.query_params.get('category','')
    products = Product.objects.all().order_by('-created_at')
    if search:
        products = products.filter(name__icontains=search)
    if category:
        products = products.filter(category=category)
    paginator = ProductPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    serializer = ProductSerializer(paginated_products, many=True)
    return paginator.get_paginated_response(serializer.data)

# List single product
@api_view(['GET'])
@role_required(allowed_roles=['seller','admin'])
def list_single_product(request,id):
    product = Product.objects.get(id=id)
    if product:
        serializer = ProductSerializer(product)
        return Response(serializer.data,status=200)
    else:
        return Response({"message":"Product not found"},status=404)
    
# Add to cart
@api_view(['POST'])
@role_required(['user','seller','admin'])
def add_to_cart(request):
    serializer = CartSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data,status=200)
    return Response(serializer.errors,status=400)

# List all cart for that user
@api_view(['GET'])
@role_required(allowed_roles=['user','seller','admin'])
def list_cart(request):
    user = request.user
    cart_items = Cart.objects.filter(user=user)
    if cart_items:
        serializer = CartSerializer(cart_items,many=True)
        return Response(serializer.data,status=200)
    return Response({"message":"There is no items in cart"},status=200)

# List all seller products
@api_view(['GET'])
@role_required(allowed_roles=['seller'])
def list_all_seller_products(request):
    seller = request.user
    if not seller:
        return Response({"error":"There is no such seller."},status=404)
    products = Product.objects.filter(seller = seller)
    if products.exists():
        serializer = ProductSerializer(products,many=True)
        return Response(serializer.data,status=200)
    return Response({"message":"There is no product for this particular seller"},status=404)

# Remove from Cart
@api_view(['POSt'])
@role_required(allowed_roles=['user'])
def remove_from_cart(request,cart_id):
    user = request.user
    product = Cart.objects.get(id=cart_id,user=user)
    if not product:
        return Response({"Error":"There is no such product"},status=404)
    product.delete()
    return Response({"message":"product deleted successfully."},status=200)

# Update Product
@api_view(['PUT'])
@role_required(allowed_roles=['seller'])
def update_product(request,product_id):
    try:
        product = Product.objects.get(id=product_id,seller=request.user)
    except Product.DoesNotExist:
        return Response({"error":"The product doesn't exists."},status=404)
    serializer = ProductSerializer(product,data=request.data,partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=200)
    print(serializer.errors)
    return Response(serializer.errors,status=400)

# Delete a product
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request,product_id):
    try:
        product = Product.objects.get(id=product_id,seller=request.user)
    except Product.DoesNotExist:
        return Response({"error":"Product not found"},status=404)
    product.delete()
    return Response({"message":"producted deleted successfully"},status=200)

# Display products in home
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def home_products(request):
    products = Product.objects.order_by('?')[:12]
    serializer = ProductSerializer(products,many=True)
    return Response(serializer.data,status=200)

# Discounted products
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_discount_products(request):
    products = Product.objects.filter(discount_price__gt=0)
    discounted_products = products.order_by('?')[:8]
    serializer = ProductSerializer(discounted_products,many=True)
    return Response(serializer.data,status=200)

# Display products in Productspage
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products,many=True)
    return Response(serializer.data,status=200)
