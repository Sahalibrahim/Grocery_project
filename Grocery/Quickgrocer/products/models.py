from django.db import models
from django.conf import settings
from users.models import Users


# Category
class Category(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class Product(models.Model):
    STATUS_CHOICES = (
        ("active", "Active"),
        ("inactive", "Inactive"),
    )

    name = models.CharField(max_length=255,db_index=True)
    description = models.TextField(blank=True,db_index=True)
    price = models.DecimalField(max_digits=10, decimal_places=2,db_index=True)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    quantity = models.IntegerField()
    category = models.ForeignKey('Category', on_delete=models.CASCADE,db_index=True)
    image = models.ImageField(upload_to='product_photos/', blank=True, null=True,db_index=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    seller = models.ForeignKey('users.Users', on_delete=models.CASCADE,db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
# Cart
class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='user_carts')
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    seller = models.ForeignKey('users.Users',on_delete=models.CASCADE,related_name='seller_carts',null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.product.name} (x{self.quantity})"
    
class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')  # ensures one product per user
