from django.contrib import admin
from .models import Room

class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    filter_horizontal = ('users',)  # Adds a better widget for selecting ManyToMany fields
    exclude = ('users',)

admin.site.register(Room,RoomAdmin)

# Register your models here.
