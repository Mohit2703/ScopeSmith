# users/urls.py
from django.urls import path
from .views import SignupView, LoginView, LogoutView, MeView
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", obtain_auth_token, name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
]
