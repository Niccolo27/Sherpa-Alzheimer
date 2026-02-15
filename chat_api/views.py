import os
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .utils import process_sherpa_logic, process_voice_logic
from .models import ContactRequest

# --- AUTHENTICATION VIEWS ---

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'user': {
                    'username': user.username,
                    'first_name': user.first_name,
                }
            }, status=status.HTTP_200_OK)
        
        return Response({'error': 'Credenziali non valide'}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')

        if not username or not password:
            return Response({'error': 'Username e password obbligatori'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Questo username è già esistente'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, first_name=first_name)
        return Response({'message': 'Utente creato con successo'}, status=status.HTTP_201_CREATED)


# --- CHAT & VOICE VIEWS ---

@method_decorator(csrf_exempt, name='dispatch')
class ChatView(APIView):
    def post(self, request):
        user_text = request.data.get('message')
        # We try to get the name from the request, otherwise 'User'
        user_name = request.data.get('user_name', 'User')
        
        if not user_text:
            return Response({"error": "No message provided"}, status=400)
            
        result = process_sherpa_logic(user_text, user_name)
        return Response(result)

@method_decorator(csrf_exempt, name='dispatch')
class VoiceView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        audio_file = request.FILES.get('audio')
        user_name = request.data.get('user_name', 'User')

        if not audio_file:
            return Response({"error": "No audio provided"}, status=400)

        path = default_storage.save('temp_audio.wav', ContentFile(audio_file.read()))
        full_path = os.path.join(default_storage.location, path)

        try:
            result = process_voice_logic(full_path, user_name)
            if os.path.exists(full_path):
                os.remove(full_path)
            return Response(result)
        except Exception as e:
            if os.path.exists(full_path):
                os.remove(full_path)
            return Response({"error": str(e)}, status=500)


# --- UTILITY VIEWS ---

@method_decorator(csrf_exempt, name='dispatch')
class ContactView(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        message = request.data.get('message')
        
        if name and email and message:
            ContactRequest.objects.create(name=name, email=email, message=message)
            return Response({"status": "success"}, status=201)
        
        return Response({"status": "error", "message": "Missing fields"}, status=400)