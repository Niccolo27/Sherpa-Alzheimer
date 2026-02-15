from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os

# Import the logic functions from utils
from .utils import process_sherpa_logic, process_voice_logic
from .models import ContactRequest

@method_decorator(csrf_exempt, name='dispatch')
class ChatView(APIView):
    def post(self, request):
        user_text = request.data.get('message')
        user_name = request.data.get('user_name', 'User')
        result = process_sherpa_logic(user_text, user_name)
        return Response(result)

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