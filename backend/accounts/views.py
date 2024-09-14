from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .serializers import UserSerializer, UserProfileSerializer
from .models import UserProfile

# Registration View
@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'successful', 'message': 'Registration Successful'}, status=status.HTTP_201_CREATED)
        return Response({'status': 'error', 'message': 'Registration Failure', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# Sign-in View
@api_view(['POST'])
def signin(request):
    if request.method == 'POST':
        try:
            # Try to retrieve the user by email
            user = User.objects.get(email=request.data['email'])
        except User.DoesNotExist:
            return Response({'status': 'error', 'message': "User doesn't exist"}, status=status.HTTP_404_NOT_FOUND)

        password = request.data.get('password')
        user = authenticate(username=user.username, password=password)
        has_user_profile = False
        
        if user:
            if hasattr(user, 'userprofile'):
                has_user_profile = True
            login(request, user)
            return Response({
                'status': 'successful',
                'user_authenticated': str(request.user.is_authenticated),
                'message': 'Login Successful',
                'has_user_profile_picture': has_user_profile
            }, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error', 'message': "Login not successful"}, status=status.HTTP_401_UNAUTHORIZED)


# Upload Profile Picture View
@api_view(['POST'])
def upload_profile_picture(request):
    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(profile, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'successful', 'message': 'Profile picture uploaded successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'error', 'message': 'Failed to upload profile picture', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# Get User Profile View (Requires authentication)
@login_required
@api_view(['GET'])
def get_user_profile(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"status": "error", "message": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    profile = UserProfile.objects.get(user=user)
    user_serializer = UserSerializer(user)
    profile_serializer = UserProfileSerializer(profile, context={'request': request})
    
    return Response({
        "user": user_serializer.data,
        "profile": profile_serializer.data
    }, status=status.HTTP_200_OK)
