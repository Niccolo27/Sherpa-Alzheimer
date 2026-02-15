from django.urls import path
from .views import ChatView, ContactView, VoiceView, LoginView, RegisterView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('voice/', VoiceView.as_view(), name='voice'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
]



    
