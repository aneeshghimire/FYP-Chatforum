from django.shortcuts import render
from .models import Room,Thread
from django.http import JsonResponse
from .serializers import RoomSerializer
from rest_framework.decorators import api_view
# Create your views here.

@api_view(['GET'])
def getavailablerooms(request):
    rooms=Room.objects.all()
    serializer = RoomSerializer(rooms,many=True)
    print(serializer.data)

    if(not rooms):
        return JsonResponse({"status":"Error","message":"No rooms available"})
    return JsonResponse({"status":"successfull","rooms":serializer.data})
