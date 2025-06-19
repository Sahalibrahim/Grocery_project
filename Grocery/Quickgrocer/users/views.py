from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from .serializers import UserRegisterSerializer,UserSerializer
from .models import Users
from rest_framework import status
from .permissions import role_required
from rest_framework_simplejwt.tokens import RefreshToken


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
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_200_OK)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    from django.contrib.auth.hashers import check_password

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
            'role': user.role
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