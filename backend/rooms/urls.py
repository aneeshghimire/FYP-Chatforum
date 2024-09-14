from django.urls import path
from . import views


urlpatterns = [
    path('getavailablerooms/',views.getavailablerooms,name='getavailablerooms'),
    path('<str:room_name>/joinroom/',views.joinroom,name='joinroom'),
    path('<str:room_name>/getthreads/',views.getthreads,name="getthreads")
]