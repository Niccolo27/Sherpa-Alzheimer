from gradio_client import Client
from deep_translator import GoogleTranslator
from langdetect import detect, DetectorFactory
from .models import Message

DetectorFactory.seed = 0

def process_sherpa_logic(user_text, user_name="User"):
    """
    Central logic: Detects language, pivots to English, 
    calls GRADIO, and translates back.
    """
    # 1. Detect Language
    try:
        user_lang = detect(user_text)
    except:
        user_lang = 'en'

    # 2. English-Pivot
    if user_lang != 'en':
        english_input = GoogleTranslator(source='auto', target='en').translate(user_text)
    else:
        english_input = user_text

    # 3. CALL GRADIO CLIENT (The actual fix)
    try:
        # We initialize the client inside the function or globally
        client = Client("Etah-94/digital-sherpa")
        
        # NOTE: Check your Gradio "Use via API" tab to see if the 
        # input is 'message', 'text', or just a positional argument.
        result = client.predict(
            message=english_input, 
            api_name="/chat" 
        )
        
        # Gradio often returns a list or a dictionary depending on the model
        if isinstance(result, (list, tuple)):
            english_response = result[0]
        else:
            english_response = str(result)

    except Exception as e:
        print(f"Gradio Error: {e}")
        english_response = "I am currently re-calibrating my connection to the Gradio Space. Please try again."

    # 4. Output Translation
    if user_lang != 'en':
        final_response = GoogleTranslator(source='en', target=user_lang).translate(english_response)
    else:
        final_response = english_response

    # 5. Database Logging
    Message.objects.create(user_name=user_name, text=user_text, sender='user')
    Message.objects.create(user_name=user_name, text=final_response, sender='bot')

    return {
        "reply": final_response,
        "lang": user_lang
    }