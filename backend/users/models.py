from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'admin'),
        ('client', 'client')
    ]
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=50, default="admin", choices=ROLE_CHOICES)
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



