# users/views.py
from django.contrib.auth import login, logout, get_user_model
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.authentication import TokenAuthentication
from .auth import CsrfExemptSessionAuthentication

from .serailizers import SignupSerializer, LoginSerializer, UserSafeSerializer
from .models import PendingRegistration
from .mail import generate_otp, send_otp_email

User = get_user_model()

OTP_EXPIRY_MINUTES = 10


class InitiateSignupView(APIView):
    """Step 1: Validate signup data and send OTP to email."""
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication, CsrfExemptSessionAuthentication]

    def post(self, request):
        print(request.data)
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        
        # Check if user already exists
        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {"detail": "Email already registered."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate OTP
        otp = generate_otp()
        expires_at = timezone.now() + timedelta(minutes=OTP_EXPIRY_MINUTES)
        
        # Store or update pending registration
        PendingRegistration.objects.update_or_create(
            email=email,
            defaults={
                'otp': otp,
                'signup_data': serializer.validated_data,
                'expires_at': expires_at
            }
        )
        
        # Send OTP email
        if not send_otp_email(email, otp):
            return Response(
                {"detail": "Failed to send OTP email. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(
            {"message": "OTP sent to your email. Please verify to complete registration."},
            status=status.HTTP_200_OK
        )


class VerifyOTPView(APIView):
    """Step 2: Verify OTP and complete registration."""
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication, CsrfExemptSessionAuthentication]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if not email or not otp:
            return Response(
                {"detail": "Email and OTP are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            pending = PendingRegistration.objects.get(email__iexact=email, otp=otp)
        except PendingRegistration.DoesNotExist:
            return Response(
                {"detail": "Invalid OTP."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if OTP is expired
        if timezone.now() > pending.expires_at:
            pending.delete()
            return Response(
                {"detail": "OTP has expired. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user from pending registration data
        signup_data = pending.signup_data
        serializer = SignupSerializer(data=signup_data)
        
        # We already validated, but validate again to get the create method
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.save()
        
        # Clean up pending registration
        pending.delete()
        
        # Generate token
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response(
            {
                "user": UserSafeSerializer(user).data,
                "token": token.key,
            },
            status=status.HTTP_201_CREATED,
        )


class ResendOTPView(APIView):
    """Resend OTP to email."""
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication, CsrfExemptSessionAuthentication]

    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {"detail": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            pending = PendingRegistration.objects.get(email__iexact=email)
        except PendingRegistration.DoesNotExist:
            return Response(
                {"detail": "No pending registration found. Please start signup again."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate new OTP
        otp = generate_otp()
        expires_at = timezone.now() + timedelta(minutes=OTP_EXPIRY_MINUTES)
        
        pending.otp = otp
        pending.expires_at = expires_at
        pending.save()
        
        # Send OTP email
        if not send_otp_email(email, otp):
            return Response(
                {"detail": "Failed to send OTP email. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(
            {"message": "New OTP sent to your email."},
            status=status.HTTP_200_OK
        )


# Keep the old SignupView for backward compatibility (can be removed later)
class SignupView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication, CsrfExemptSessionAuthentication]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print("validated")
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "user": UserSafeSerializer(user).data,
                "token": token.key,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [TokenAuthentication, CsrfExemptSessionAuthentication]
    
    def post(self, request):
        data = LoginSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        email = data.validated_data["email"]
        password = data.validated_data["password"]
        print("email:", email, "password:", password)
        user = authenticate(request, email=email, password=password)
        print("user:", user)
        if not user:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.enabled:
            return Response({"detail": "User disabled."}, status=status.HTTP_403_FORBIDDEN)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"user": UserSafeSerializer(user).data, "token": token.key}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Optional: delete the token to force re-login on all clients
        Token.objects.filter(user=request.user).delete()
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSafeSerializer(request.user).data, status=status.HTTP_200_OK)
