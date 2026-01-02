from django.core.mail import send_mail
from django.conf import settings
import random


def generate_otp():
    """Generate a 6-digit OTP."""
    return str(random.randint(100000, 999999))


def send_otp_email(email, otp):
    """Send OTP to user's email for verification during signup."""
    subject = 'ScopeSmith - Verify Your Email'
    message = f'''Welcome to ScopeSmith!

Your verification code is: {otp}

This code expires in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
The ScopeSmith Team'''
    
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    
    try:
        send_mail(subject, message, from_email, recipient_list)
        return True
    except Exception as e:
        print(f"Error sending OTP email: {e}")
        return False