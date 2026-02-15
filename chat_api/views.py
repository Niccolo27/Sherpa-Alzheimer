from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .utils import process_sherpa_logic
from .models import ContactRequest  # Make sure you added this to models.py!

@method_decorator(csrf_exempt, name='dispatch')
class ChatView(APIView):
    def post(self, request):
        user_text = request.data.get('message')
        user_name = request.data.get('user_name', 'User')
        
        # Call the Gradio logic from utils.py
        result = process_sherpa_logic(user_text, user_name)
        
        return Response({
            "reply": result['reply'],
            "lang": result['lang']
        })

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