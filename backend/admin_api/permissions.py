# admin_api/permissions.py
from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Permission check for admin role users only.
    """
    message = "Admin access required."

    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', None) == 'admin'
        )
