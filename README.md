# Sherpa Alzheimer

---

## Technical Stack

### Frontend
- Next.js 15+ (React, TypeScript)
- Tailwind CSS
- Lucide React

### Backend
- Django 6.0 (Python 3.13)
- Django REST Framework (API)
- SQLite3 (Local Database)
- Deep-Translator & LangDetect (AI Translation Engine)

---

## Installation Instructions

### 1. Prerequisites
Ensure you have the following installed:
- Node.js (v18 or higher)
- Python (v3.10 or higher)
- Git

---

### 2. Backend Configuration (Django)
Open a terminal in the project root directory:

```bash
# Enter the backend directory
cd accessibot_backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install django djangorestframework django-cors-headers deep-translator langdetect python-telegram-bot

# Database configuration
python manage.py makemigrations
python manage.py makemigrations chat_api
python manage.py migrate

# Create an administrator user for the dashboard
python manage.py createsuperuser
