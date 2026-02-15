from django.urls import path
from .views import ChatView, ContactView, VoiceView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('voice/', VoiceView.as_view(), name='voice'),
]