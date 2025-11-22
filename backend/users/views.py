# users/views.py
from django.contrib.auth import login, logout, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.authentication import TokenAuthentication
from .auth import CsrfExemptSessionAuthentication

from .serailizers import SignupSerializer, LoginSerializer, UserSafeSerializer

User = get_user_model()

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
