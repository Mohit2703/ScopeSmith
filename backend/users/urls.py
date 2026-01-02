# users/urls.py
from django.urls import path
from .views import (
    SignupView, LoginView, LogoutView, MeView,
    InitiateSignupView, VerifyOTPView, ResendOTPView
)
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    # New OTP-based signup flow
    path("signup/initiate/", InitiateSignupView.as_view(), name="signup-initiate"),
    path("signup/verify-otp/", VerifyOTPView.as_view(), name="signup-verify-otp"),
    path("signup/resend-otp/", ResendOTPView.as_view(), name="signup-resend-otp"),
    
    # Legacy signup (kept for backward compatibility)
    path("signup/", SignupView.as_view(), name="signup"),
    
    # Auth endpoints
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
]
