from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes,parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from .serializers import UserRegisterSerializer,UserSerializer,AddressSerializer,UserProfileSerializer
from .models import Users,Address
from rest_framework import status
from .permissions import role_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from django.http import FileResponse
from rest_framework.parsers import MultiPartParser, FormParser


#List the current user
@api_view(['GET'])
@role_required(allowed_roles=['admin'])
def list_users(request):
    users = Users.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)



# API for registration
@api_view(['POST'])
@permission_classes([AllowAny])
def Register(request):
    print("entering")
    print(request.data)
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_200_OK)
    print(serializer.errors)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

# Login
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):

    email = request.data.get('email')
    password = request.data.get('password')

    if not email:
        return Response({"error": "Email is required!"}, status=status.HTTP_400_BAD_REQUEST)
    if not password:
        return Response({"error": "Password is required!"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Users.objects.get(email=email)

    except Users.DoesNotExist:
        return Response({"error": "No user found with this email."}, status=status.HTTP_404_NOT_FOUND)
    
    if user.admin_blocked == True:
        return Response({"error":"Admin blocked this user . "},status=400)

    if not check_password(password, user.password):
        return Response({"error": "Invalid password."}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    # refresh['role'] = user.role
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    return Response({
        'message': 'User logged in successfully.',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'profile_picture':user.profile_picture.url if user.profile_picture else None,
            'member_since':user.created_at
        },
        'access_token': access_token,
        'refresh_token': refresh_token
    }, status=status.HTTP_200_OK)



# API for listing all User
@api_view(['GET'])
@role_required(allowed_roles=['admin'])
def list_all_user(request):
    role = 'user'
    users = Users.objects.filter(role=role)
    if users.exists():
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    return Response({"message": f"There are no users with role {role}."})


# Admin Blocking user and Unblocking user
@api_view(['POST'])
@role_required(allowed_roles=['admin'])
def block_user(request,id):
    user = Users.objects.get(id=id)
    if user:
        if user.admin_blocked == False:         #Both blocking and unblocking in same api call
            user.admin_blocked = True
            user.save()
            return Response({"message":"User blocked successfully."},status=200)
        else:
            user.admin_blocked = False
            user.save()
            return Response({"message":"User unblocked successfully."},status=200)
    return Response({"message":"The is no user."},status=400)


# Api for logout
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def logout(request):
    return Response({"message":"User logged out successfully"},status=200)

# Api for getting user information
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    if user:
        serializer = UserSerializer(user)
        return Response(serializer.data,status=200)
    return Response({"error":"User not found"},status=404)

# Verifing token
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_token(request):
    return Response({"message": "Token is valid"}, status=200)


# User address handling
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_address(request):
    serializer = AddressSerializer(data=request.data)
    if serializer.is_valid():
        if serializer.validated_data.get("is_default"):
            Address.objects.filter(user=request.user,is_default=True).update(is_default=False)
        serializer.save(user=request.user)
        return Response(serializer.data,status=200)
    return Response(serializer.errors,status=400)

# List user address
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_address(request):
    addresses = Address.objects.filter(user=request.user).order_by('-is_default','-created_at')
    serializer = AddressSerializer(addresses,many=True)
    return Response(serializer.data)

# Enable default feature
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enable_default(request,address_id):
    address = Address.objects.get(id=address_id,user = request.user)
    Address.objects.filter(is_default=True,user=request.user).update(is_default=False)
    address.is_default=True
    address.save()
    return Response({"message":"Default address updated successfully"},status=200)

# Edit address
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_address(request,address_id):
    try:
        address = Address.objects.get(id=address_id,user=request.user)
    except Address.DoesNotExist:
        return Response({"error":"Address not found"},status=404)
    serializer = AddressSerializer(address,data=request.data,partial=True)
    if serializer.is_valid():
        if serializer.validated_data.get("is_default"):
            Address.objects.filter(user=request.user,is_default=True).update(is_default=False)
        serializer.save()
        return Response(serializer.data,status=200)
    return Response(serializer.errors,status=400)

# Delete the address
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_address(request,address_id):
    try:
        address = Address.objects.get(id=address_id,user=request.user)
    except Address.DoesNotExist:
        return Response({"error":"This address does not exists"},status=404)
    address.delete()
    return Response({"message":"address deleted successfully"},status=200)

# Edit user
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_user(request):
    user = request.user
    data = request.data

    user.username = data.get('username')
    user.email = data.get('email')
    user.save()
    return Response({"message":"User updated successfully"},status=200)

# Update profile picture
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profilepic(request):
    user = request.user
    print(request.data)
    serializer = UserProfileSerializer(user,data = request.data,partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"Successfully updated the profile picture","profile_picture": user.profile_picture.url},status=200)
    print(serializer.errors)
    return Response(serializer.errors,status=400)