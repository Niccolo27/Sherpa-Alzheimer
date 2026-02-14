import os
import django

# Setup Django environment so the script can access the database/models
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'accessibot_backend.settings')
django.setup()

from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, MessageHandler, filters
from chat_api.utils import process_sherpa_logic

# TOKEN = " " TODO: implement telegram token here 

async def handle_telegram_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_text = update.message.text
    user_name = update.message.from_user.first_name
    
    # Use the same shared logic
    result = process_sherpa_logic(user_text, user_name)
    
    await update.message.reply_text(result["reply"])

if __name__ == '__main__':
    application = ApplicationBuilder().token(TOKEN).build()
    application.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_telegram_message))
    
    print("Sherpa Telegram Bot (Integrated) is running...")
    application.run_polling()