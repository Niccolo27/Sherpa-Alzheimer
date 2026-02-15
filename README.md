# Sherpa Alzheimer
---
## Technical Stack

### Frontend
- Next.js 15+ (React, TypeScript)
- Tailwind CSS (Accessible design)
- Lucide React (Iconography)

### Backend
- Django 6.0 (Python 3.13)
- Django REST Framework (API)
- SQLite3 (Database for conversation logging)
- Gradio Client (AI Model Integration)
- Deep-Translator & LangDetect (Multilingual Engine)

### Integrations
- Telegram Bot API (Mobile accessibility)
- Amazon Alexa (Voice interface - via ngrok)

---

## Installation Instructions

### 1. Prerequisites
Ensure you have the following installed:
- Node.js (v18 or higher)
- Python (v3.10 or higher)
- A Hugging Face Read Token (for Gradio access)

---

### 2. Backend Configuration (Django)
Open a terminal in the project root directory:

```bash
# Enter the backend directory
cd accessibot_backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install django djangorestframework django-cors-headers deep-translator langdetect gradio_client python-telegram-bot

# Database configuration
python manage.py makemigrations
python manage.py migrate

# Create administrator
python manage.py createsuperuser