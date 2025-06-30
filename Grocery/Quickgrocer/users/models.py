from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


class Users(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("seller","Seller"),
        ("user","User")
    )

    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=10,choices=ROLE_CHOICES,default="user")
    admin_approved = models.BooleanField(default=False)
    admin_blocked = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username}({self.role})"


class Address(models.Model):
    user = models.ForeignKey('Users', on_delete=models.CASCADE, related_name='addresses')
    full_name = models.CharField(max_length=100)  # Name of the receiver (can differ from account name)
    phone_number = models.CharField(max_length=15)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='India')
    is_default = models.BooleanField(default=False)  # Optional: mark default delivery address

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name}, {self.city}"
