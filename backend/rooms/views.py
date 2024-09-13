from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Room,Thread
from django.http import JsonResponse
from .serializers import RoomSerializer,ThreadSerializer

@api_view(['GET'])
def getavailablerooms(request):
    rooms=Room.objects.all()
    serializer= RoomSerializer(rooms,many=True)
    print(serializer.data)

    if(not rooms):
        return JsonResponse({"status":"error","message":"No rooms available"})
    return JsonResponse({"status":"successful",'rooms':serializer.data})

@api_view(['GET'])
def getthreads(request,room_name):
    room= Room.objects.get(name=room_name)
    threads= Thread.objects.filter(room=room)
    if(not threads):
        return JsonResponse({"status":"error","message":"No threads available"})
    serializer= ThreadSerializer(threads,many=True)
    return JsonResponse({'status':'successful','threads':serializer.data})

@api_view(['GET'])
def joinroom(request,room_name):
    room= Room.objects.get(name=room_name)
    user= request.user
    if user.is_authenticated:
        room.users.add(user)
        return JsonResponse({"status":"successful","message":"Room joined successfully"})
    return JsonResponse({"status":"error","message":"Cannot join the room"})

