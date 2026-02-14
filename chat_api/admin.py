from django.contrib import admin
from .models import Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'sender', 'text', 'created_at')
    list_filter = ('sender', 'created_at')
    search_fields = ('user_name', 'text')