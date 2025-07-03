from rest_framework import serializers
from .models import Users,Address
from django.contrib.auth.hashers import make_password
import re

class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    member_since = serializers.DateTimeField(source='created_at', format="%Y-%m-%d", read_only=True)
    class Meta:
        model = Users
        # fields = '__all__'
        fields = ['id', 'username', 'email', 'role', 'profile_picture', 'member_since']
        extra_kwargs = {'password':{'write_only':True}}

    def get_profile_picture(self,obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None


class UserRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    profile_picture = serializers.ImageField(required=False)
    class Meta:
        model = Users
        fields = '__all__'
        extra_kwargs = {'password':{'write_only':True}}

    def validate_email(self,value):
        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_regex,value):
            raise serializers.ValidationError("Enter a valid email address")
        return value
    
    def validate_password(self,value):
        password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
        if not re.match(password_regex,value):
            raise serializers.ValidationError(
                "Password must be at least 8 characters long and include one uppercase letter, "
                "one lowercase letter, one number, and one special character."
            )
        return value
    
    def validate_role(self,value):
        value = value.lower()
        if value == 'admin':
            raise serializers.ValidationError("Role 'admin' is not allowed")
        if value not in ['user','seller']:
            raise serializers.ValidationError("Role must be either 'user' or 'seller'")
        return value
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm password":"Both password and confirm password is not matching."})
        return data
    
    def create(self,validate_data):
        validate_data.pop('confirm_password')
        validate_data['password'] = make_password(validate_data['password'])
        return super().create(validate_data)

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ['user']

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    class Meta:
        model = Users
        fields = ['profile_picture']