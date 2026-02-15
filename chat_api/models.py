from django.db import models

class Message(models.Model):
    user_name = models.CharField(max_length=100)
    text = models.TextField()
    sender = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

class ContactRequest(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)