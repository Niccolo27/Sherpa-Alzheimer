from django.urls import path
from .views import ChatView, ContactView 

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('contact/', ContactView.as_view(), name='contact'),
]