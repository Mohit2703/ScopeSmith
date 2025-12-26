from django.db import models

class UpworkCreds(models.Model):
    key = models.CharField(max_length=255)
    value = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class UpworkScrapJob(models.Model):
    STATUS_CHOICES = [
        ('pending', 'pending'),
        ('in_progress', 'in_progress'),
        ('completed', 'completed'),
        ('failed', 'failed')
    ]
    jsonInput = models.JSONField(default=dict)
    status = models.CharField(max_length=50, default="pending", choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class UpworkScrapResult(models.Model):
    job = models.ForeignKey(UpworkScrapJob, on_delete=models.CASCADE, related_name='results')
    result_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class UpworkScrapLogs(models.Model):
    job = models.ForeignKey(UpworkScrapJob, on_delete=models.CASCADE, related_name='logs')
    log_message = models.TextField()
    log_type = models.CharField(max_length=50, default="info")  # e.g., info, error, debug
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
