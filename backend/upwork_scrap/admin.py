from django.contrib import admin
from .models import UpworkCreds, UpworkScrapJob, UpworkScrapResult, UpworkScrapLogs
# Register your models here.

@admin.register(UpworkCreds)
class UpworkCredsAdmin(admin.ModelAdmin):
    list_display = ["key", "value", "created_at", "updated_at"]
    search_fields = ["key", "value"]
    ordering = ['-created_at']

@admin.register(UpworkScrapJob)
class UpworkScrapJobAdmin(admin.ModelAdmin):
    list_display = ["id", "status", "created_at", "updated_at"]
    list_filter = ['status']
    search_fields = ["jsonInput"]
    ordering = ['-created_at']

@admin.register(UpworkScrapResult)
class UpworkScrapResultAdmin(admin.ModelAdmin):
    list_display = ["id", "job", "created_at", "updated_at"]
    search_fields = ["result_data"]
    ordering = ['-created_at']

@admin.register(UpworkScrapLogs)
class UpworkScrapLogsAdmin(admin.ModelAdmin):
    list_display = ["id", "job", "log_type", "created_at", "updated_at"]
    list_filter = ['log_type']
    search_fields = ["log_message"]
    ordering = ['-created_at']
