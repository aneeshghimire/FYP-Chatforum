from rest_framework import serializers 
from .models import Room
from accounts.serializers import UserSerializer

class RoomSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True,read_only=True)
    class Meta:
        model = Room
        fields = ['id','name','description','created_at','users']