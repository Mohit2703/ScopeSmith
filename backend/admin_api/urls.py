# admin_api/urls.py
from django.urls import path
from .views import (
    AdminDashboardView,
    AdminUsersView, AdminUserDetailView, AdminUserToggleView,
    AdminProjectTypesView, AdminProjectTypeDetailView, AdminProjectTypeToggleView,
    AdminProjectsView, AdminProjectDetailView,
    AdminQuestionsView, AdminQuestionDetailView, AdminQuestionToggleView, AdminQuestionReorderView,
    AdminAIQuestionsView,
    AdminReportsView, AdminReportDetailView, AdminReportRegenerateView,
    AdminSettingsView
)

urlpatterns = [
    # Dashboard
    path('dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    
    # Users
    path('users/', AdminUsersView.as_view(), name='admin-users'),
    path('users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('users/<int:pk>/toggle/', AdminUserToggleView.as_view(), name='admin-user-toggle'),
    
    # Project Types
    path('project-types/', AdminProjectTypesView.as_view(), name='admin-project-types'),
    path('project-types/<int:pk>/', AdminProjectTypeDetailView.as_view(), name='admin-project-type-detail'),
    path('project-types/<int:pk>/toggle/', AdminProjectTypeToggleView.as_view(), name='admin-project-type-toggle'),
    
    # Projects
    path('projects/', AdminProjectsView.as_view(), name='admin-projects'),
    path('projects/<int:pk>/', AdminProjectDetailView.as_view(), name='admin-project-detail'),
    
    # Questions
    path('questions/', AdminQuestionsView.as_view(), name='admin-questions'),
    path('questions/<int:pk>/', AdminQuestionDetailView.as_view(), name='admin-question-detail'),
    path('questions/<int:pk>/toggle/', AdminQuestionToggleView.as_view(), name='admin-question-toggle'),
    path('questions/reorder/', AdminQuestionReorderView.as_view(), name='admin-questions-reorder'),
    
    # AI Questions Monitor
    path('ai-questions/', AdminAIQuestionsView.as_view(), name='admin-ai-questions'),
    
    # Reports
    path('reports/', AdminReportsView.as_view(), name='admin-reports'),
    path('reports/<int:pk>/', AdminReportDetailView.as_view(), name='admin-report-detail'),
    path('reports/<int:pk>/regenerate/', AdminReportRegenerateView.as_view(), name='admin-report-regenerate'),
    
    # Settings
    path('settings/', AdminSettingsView.as_view(), name='admin-settings'),
]
