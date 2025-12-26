from django.urls import path
from .views import UpworkCredsViewSet, UpworkScrapJobViewSet, UpworkScrapResultViewSet, UpworkScrapLogsViewSet

urlpatterns = [
    path('creds/', UpworkCredsViewSet.as_view(), name='upwork-creds'),
    path('jobs/', UpworkScrapJobViewSet.as_view(), name='upwork-jobs'),
    path('jobs/<str:status>/', UpworkScrapJobViewSet.as_view(), name='upwork-jobs-by-status'),
    path('results/<int:job_id>/', UpworkScrapResultViewSet.as_view(), name='upwork-results'),
    path('logs/<int:job_id>/', UpworkScrapLogsViewSet.as_view(), name='upwork-logs'),
]
