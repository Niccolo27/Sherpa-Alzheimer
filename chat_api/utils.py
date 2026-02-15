from gradio_client import Client, handle_file
from .models import Message
import os

def process_sherpa_logic(user_text, user_name="User"):
    """
    Handles text chat logic. Calls Gradio and logs to the database.
    """
    try:
        client = Client("Etah-94/digital-sherpa")
        result = client.predict(
            message=user_text, 
            api_name="/chat" 
        )
        final_response = result
    except Exception as e:
        print(f"Gradio Chat Error: {e}")
        final_response = "I'm having trouble connecting to my brain. Please try again soon."

    # Save to database
    Message.objects.create(user_name=user_name, text=user_text, sender='user')
    Message.objects.create(user_name=user_name, text=final_response, sender='bot')

    return {
        "reply": final_response,
        "detected_language": None 
    }

def process_voice_logic(audio_path, user_name="User"):
    """
    Handles voice-to-voice logic.
    """
    try:
        client = Client()
        
     
        result = client.predict(
            audio=handle_file(audio_path),
            api_name="/voice_chat" 
        )
        
        # Assuming Gradio returns: [Transcript, Bot_Response_Text, Audio_URL]
        return {
            "user_text": result[0],
            "reply": result[1],
            "audio_url": result[2] 
        }
    except Exception as e:
        print(f"Gradio Voice Error: {e}")
        raise e