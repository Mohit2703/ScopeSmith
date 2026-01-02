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
    mobile_number = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    company_name = models.CharField(max_length=200, blank=True, null=True)
    linkedin_username = models.CharField(max_length=150, blank=True, null=True)
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PendingRegistration(models.Model):
    """Temporary storage for signup data with OTP verification pending."""
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    signup_data = models.JSONField()  # Stores all signup fields (name, password, etc.)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    class Meta:
        indexes = [models.Index(fields=['email', 'otp'])]
    
    def __str__(self):
        return f"Pending: {self.email}"



