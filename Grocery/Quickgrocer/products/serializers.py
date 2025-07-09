from rest_framework import serializers
from .models import Category,Product,Cart,Wishlist
from users.serializers import UserSerializer

# Category serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# Product serializer
class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    seller_name = serializers.CharField(source='seller.username',read_only=True)
    is_wishlisted = serializers.SerializerMethodField()    
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['seller','created_at','updated_at']

    def get_is_wishlisted(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            return obj.wishlisted_by.filter(user=user).exists()
        return False
    

# Cart serializer
class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    seller = UserSerializer(read_only=True)
    class Meta:
        model = Cart
        fields = ['id', 'user', 'product', 'seller', 'quantity', 'added_at']
        read_only_fields = ['id', 'added_at', 'user', 'seller']

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'created_at']
