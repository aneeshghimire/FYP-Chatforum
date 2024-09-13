from django.urls import path
from . import views


urlpatterns = [
    path('getavailablerooms/',views.getavailablerooms,name='getavailablerooms'),
]