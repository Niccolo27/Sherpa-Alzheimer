from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .utils import process_sherpa_logic

@method_decorator(csrf_exempt, name='dispatch')
class ChatView(APIView):
    def post(self, request):
        user_message = request.data.get('message', '')
        user_name = request.data.get('user_name', 'Guest')
        
        # Call the shared utility
        result = process_sherpa_logic(user_message, user_name)
        
        return Response({
            "reply": result["reply"],
            "detected_language": result["lang"]
        })