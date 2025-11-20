from django.contrib import admin
from .models import User
# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["username", "email", "name", "role"]
    list_filter = ['role', 'enabled']
    search_fields = ["email", "name"]
    ordering = ['-date_joined']

