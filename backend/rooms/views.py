from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from .models import Room,Thread
from django.http import JsonResponse
from .serializers import RoomSerializer,ThreadSerializer
from django.core.exceptions import ObjectDoesNotExist
import json

@api_view(['GET'])
def getavailablerooms(request):
    rooms=Room.objects.all()
    serializer= RoomSerializer(rooms,many=True)
    # print(serializer.data)

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


@api_view(['POST'])
def addthreads(request,room_name):
    if request.method== "POST":
        room =Room.objects.get(name=room_name)
        user= request.user
        title= request.data["title"]
        if room and user and title:  
            Thread.objects.create(room=room, title=title, created_by=user)
            return JsonResponse({"status":"successful","message":"Updated Sucessfully"})
        return JsonResponse({"status":"error","message":"Invalid Data"})
        
        
api_view(['GET'])
def deleterooms(request,roomname):
    try:
        deletingroom = Room.objects.get(name=roomname)
        deletingroom.delete()
        rooms = Room.objects.filter(name=roomname)
        serializer = RoomSerializer(rooms,many=True)
        if(not rooms):
             return JsonResponse({"status":"delete_successfull",'rooms':[],"message":"All rooms deleted"})
        return JsonResponse({"status":"delete_successfull",'rooms':serializer.data})
    except ObjectDoesNotExist:
        return JsonResponse({"status": "error", "message": "Room not found"})
    
@api_view(['GET'])
def deletethreads(request,roomname,threadid):
    try:
        deletingthread = Thread.objects.get(id=threadid)
        deletingthread.delete()
        threads = Thread.objects.filter(room__name=roomname)
        serializer = ThreadSerializer(threads, many=True)
        if(not threads):
            return JsonResponse({"status": "delete_successfull", 'threads': [], "message": "All threads deleted"})
        serializer = ThreadSerializer(threads,many=True)
        return JsonResponse({"status":"delete_successfull",'threads':serializer.data})
    except ObjectDoesNotExist:
        return JsonResponse({"status": "error", "message": "Thread not found"})


def addrooms(request):
    if request.method== 'POST':
        data = json.loads(request.body)
        roomname = data.get('name')
        roomdescription = data.get('description')
        if roomname and roomdescription:
            room = Room.objects.create(name=roomname,description=roomdescription)
            room.save()
            return JsonResponse({"status": "successful", "message": "Room created Successfully"})
        return JsonResponse({"status": "error", "message": "Failed to create room"})