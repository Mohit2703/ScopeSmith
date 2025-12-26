from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UpworkCreds, UpworkScrapJob, UpworkScrapResult, UpworkScrapLogs
from .serializers import (
    UpworkCredsSerializer,
    UpworkScrapJobSerializer,
    UpworkScrapResultSerializer,
    UpworkScrapLogsSerializer
)
from .tasks import run_scraping_job
import ast


class UpworkCredsViewSet(APIView):
    """API endpoint for managing Upwork credentials."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        creds = UpworkCreds.objects.all()
        serializer = UpworkCredsSerializer(creds, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        key, value = request.data.get('key'), request.data.get('value')
        if not key or value is None:
            return Response({"error": "Key and value are required."}, status=400)

        cred_present = UpworkCreds.objects.filter(key=key).first()
        if cred_present:
            cred_present.value = value
            cred_present.save()
            serializer = UpworkCredsSerializer(cred_present)
            return Response(serializer.data, status=200)

        new_cred = UpworkCreds.objects.create(key=key, value=value)
        serializer = UpworkCredsSerializer(new_cred)
        return Response(serializer.data, status=201)

    def delete(self, request):
        key = request.data.get('key')
        if not key:
            return Response({"error": "Key is required."}, status=400)

        cred_present = UpworkCreds.objects.filter(key=key).first()
        if not cred_present:
            return Response({"error": "Credential not found."}, status=404)

        cred_present.delete()
        return Response({"message": "Credential deleted."}, status=200)


class UpworkScrapJobViewSet(APIView):
    """API endpoint for managing scraping jobs."""
    permission_classes = [IsAuthenticated]


    def convert_value(self, value):
        """Convert string representations to proper Python types"""
        if isinstance(value, str):
            if value == "True":
                return True
            elif value == "False":
                return False
            elif value.startswith('[') and value.endswith(']'):
                try:
                    return ast.literal_eval(value)
                except:
                    return value
            elif value.isdigit():
                return int(value)
            else:
                try:
                    return int(value)
                except ValueError:
                    try:
                        return float(value)
                    except ValueError:
                        return value
        return value

    def convert_dict_types(self, d):
        """Recursively convert all values in a dictionary"""
        result = {}
        for key, value in d.items():
            if isinstance(value, dict):
                result[key] = self.convert_dict_types(value)
            else:
                result[key] = self.convert_value(value)
        return result


    def get(self, request, *args, **kwargs):
        status_filter = kwargs.get('status', "all")

        if status_filter == "all":
            jobs = UpworkScrapJob.objects.all().order_by('-created_at')
        else:
            jobs = UpworkScrapJob.objects.filter(status=status_filter).order_by('-created_at')
        serializer = UpworkScrapJobSerializer(jobs, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        """Create and start a new scraping job."""
        creds = UpworkCreds.objects.all()
        creds_dict = {cred.key: cred.value for cred in creds}

        if "username" not in creds_dict or "password" not in creds_dict:
            return Response({"error": "Upwork credentials are not set."}, status=400)

        # Get user-provided search parameters
        json_input = request.data.get('jsonInput', {})

        # Build the full input for the scraper
        json_input["credentials"] = {
            "username": creds_dict["username"],
            "password": creds_dict["password"]
        }

        # Remove credentials from settings dict
        settings_dict = creds_dict.copy()
        settings_dict.pop("username", None)
        settings_dict.pop("password", None)
        json_input["search"] = settings_dict

        json_input = self.convert_dict_types(json_input)

        job = UpworkScrapJob.objects.create(
            jsonInput=json_input,
            status="pending"
        )

        run_scraping_job.delay(job.id, json_input)

        return Response(UpworkScrapJobSerializer(job).data, status=201)


class UpworkScrapResultViewSet(APIView):
    """API endpoint for retrieving scraping results."""
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        results = UpworkScrapResult.objects.filter(job_id=job_id)
        serializer = UpworkScrapResultSerializer(results, many=True)
        return Response(serializer.data, status=200)


class UpworkScrapLogsViewSet(APIView):
    """API endpoint for retrieving scraping logs."""
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        logs = UpworkScrapLogs.objects.filter(job_id=job_id).order_by('created_at')
        serializer = UpworkScrapLogsSerializer(logs, many=True)
        return Response(serializer.data, status=200)
