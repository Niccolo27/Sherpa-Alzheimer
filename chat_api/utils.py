from deep_translator import GoogleTranslator
from langdetect import detect, DetectorFactory
from .models import Message

# Ensures consistent language detection
DetectorFactory.seed = 0

def process_sherpa_logic(user_text, user_name="User"):
    """
    Central logic: Detects language, pivots to English for processing,
    and translates back for the user.
    """
    # 1. Detect Language
    try:
        user_lang = detect(user_text)
    except:
        user_lang = 'en'

    # 2. English-Pivot (Input translation)
    if user_lang != 'en':
        english_input = GoogleTranslator(source='auto', target='en').translate(user_text)
    else:
        english_input = user_text

    # --- CORE AI/BOT LOGIC ---
    # This is where you will eventually link the external bot.
    # For now, we simulate a response in English.
    english_response = f"Sherpa Alzheimer Intelligence: I have processed your request regarding '{english_input}' for {user_name}."
    # -------------------------

    # 3. Output Translation (Back to user's language)
    if user_lang != 'en':
        final_response = GoogleTranslator(source='en', target=user_lang).translate(english_response)
    else:
        final_response = english_response

    # 4. Save to Database
    # We save the original user text and the translated bot response
    Message.objects.create(user_name=user_name, text=user_text, sender='user')
    Message.objects.create(user_name=user_name, text=final_response, sender='bot')

    return {
        "reply": final_response,
        "lang": user_lang
    }