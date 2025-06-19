from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from users.models import Users
from users.serializers import UserSerializer
from users.permissions import role_required

# Listing all sellers
@api_view(['GET'])
@role_required(allowed_roles=['admin'])
def list_all_sellers(request):
    role = 'seller'
    sellers = Users.objects.filter(role=role,admin_blocked=False)
    if sellers.exists():
        serializer = UserSerializer(sellers,many=True)
        return Response(serializer.data,status=200)
    return Response({"message":"There is not Seller"},status=400)

# Approving the seller
@api_view(['POST'])
@role_required(allowed_roles=['admin'])
def seller_approval(request,id):
    seller = Users.objects.get(id=id)
    if seller:
        if seller.admin_approved == False:
            seller.admin_approved = True
            seller.save()
            return Response({"message":"Seller approved by admin"},status=200)
        else:
            seller.admin_approved = False
            seller.save()
            return Response({"message":"Seller unapproved successfully."},status=200)
    return Response({"error":"There is no seller in this id"},status=400)

# Listing approved sellers
@api_view(['GET'])
@role_required(allowed_roles=['admin'])
def list_approved_sellers(request):
    role = 'seller'
    sellers = Users.objects.filter(role=role, admin_approved=True, admin_blocked=False)
    if sellers.exists():
        serializer = UserSerializer(sellers,many=True)
        return Response(serializer.data,status=200)
    return Response({"error":"There is no single seller approved "},status=400)

# Blocking and Unblocking seller
@api_view(['POST'])
@role_required(allowed_roles=['admin'])
def block_seller(request,id):
    seller = Users.objects.get(id=id)
    if seller:
        if seller.admin_blocked == False:
            seller.admin_blocked = True
            seller.save()
            return Response({"message":"Seller Blocked successfully."},status=200)
        else:
            seller.admin_blocked = False
            seller.save()
            return Response({"message":"Seller Unblocked Successfully"},status=200)
    return Response({"error":"Seller is not found"},status=400)