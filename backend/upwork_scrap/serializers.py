from .models import UpworkCreds, UpworkScrapJob, UpworkScrapResult, UpworkScrapLogs
from rest_framework import serializers

class UpworkCredsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpworkCreds
        fields = "__all__"

class UpworkScrapJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpworkScrapJob
        fields = "__all__"

class UpworkScrapResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpworkScrapResult
        fields = "__all__"

class UpworkScrapLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpworkScrapLogs
        fields = "__all__"

