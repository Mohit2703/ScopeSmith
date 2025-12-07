# admin_api/models.py
from django.db import models


class Settings(models.Model):
    """
    Singleton model for storing admin settings (feature flags and branding).
    """
    # Feature Flags
    ai_questions_enabled = models.BooleanField(default=True)
    voice_input_enabled = models.BooleanField(default=False)
    report_regeneration_enabled = models.BooleanField(default=True)
    
    # Branding
    primary_color = models.CharField(max_length=20, default="#4f46e5")
    accent_color = models.CharField(max_length=20, default="#10b981")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Settings"
        verbose_name_plural = "Settings"

    def save(self, *args, **kwargs):
        # Ensure only one settings instance exists
        if not self.pk and Settings.objects.exists():
            raise ValueError("Only one Settings instance is allowed.")
        return super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        """Get or create the singleton settings instance."""
        settings, _ = cls.objects.get_or_create(pk=1)
        return settings

    def __str__(self):
        return "System Settings"
