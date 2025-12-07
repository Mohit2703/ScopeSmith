# admin_api/views.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from projects.models import (
    ProjectType, Project, Question, Answer,
    AI_Question, AI_Answer, Project_Report
)
from projects.anthropic.prompt import anthropic_prompt

from .models import Settings
from .permissions import IsAdminUser
from .serializers import (
    AdminUserSerializer, AdminUserCreateSerializer, AdminUserUpdateSerializer,
    AdminProjectTypeSerializer, AdminProjectSerializer, AdminQuestionSerializer,
    AdminAIQuestionSerializer, AdminReportSerializer, SettingsSerializer,
    AdminDashboardStatsSerializer
)

User = get_user_model()


class AdminDashboardView(APIView):
    """Dashboard statistics for admin overview."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        now = timezone.now()
        week_ago = now - timedelta(days=7)
        
        stats = {
            'total_users': User.objects.count(),
            'total_projects': Project.objects.count(),
            'total_reports': Project_Report.objects.count(),
            'total_ai_questions': AI_Question.objects.count(),
            'new_users_this_week': User.objects.filter(date_joined__gte=week_ago).count(),
            'new_projects_this_week': Project.objects.filter(created_at__gte=week_ago).count(),
            'reports_this_week': Project_Report.objects.filter(created_at__gte=week_ago).count(),
            'active_projects': Project.objects.filter(status__in=['proposed', 'called']).count(),
            'project_types_count': ProjectType.objects.filter(enabled=True).count(),
            'questions_count': Question.objects.filter(enabled=True).count(),
        }
        
        serializer = AdminDashboardStatsSerializer(stats)
        return Response(serializer.data)


# ================== User Management ==================

class AdminUsersView(APIView):
    """List all users and create new users."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        users = User.objects.all().order_by('-date_joined')
        
        # Filtering
        role = request.query_params.get('role')
        enabled = request.query_params.get('enabled')
        search = request.query_params.get('search')
        
        if role:
            users = users.filter(role=role)
        if enabled is not None:
            users = users.filter(enabled=enabled.lower() == 'true')
        if search:
            users = users.filter(
                Q(name__icontains=search) | 
                Q(email__icontains=search) |
                Q(username__icontains=search)
            )
        
        serializer = AdminUserSerializer(users, many=True)
        return Response({
            'results': serializer.data,
            'count': users.count()
        })

    def post(self, request):
        serializer = AdminUserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                AdminUserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserDetailView(APIView):
    """Get, update, or delete a specific user."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def get(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = AdminUserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = AdminUserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(AdminUserSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        # Prevent self-deletion
        if user.pk == request.user.pk:
            return Response(
                {'detail': 'Cannot delete your own account.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminUserToggleView(APIView):
    """Toggle user enabled status."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Prevent self-disable
        if user.pk == request.user.pk:
            return Response(
                {'detail': 'Cannot toggle your own account.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.enabled = not user.enabled
        user.save()
        return Response(AdminUserSerializer(user).data)


# ================== Project Types ==================

class AdminProjectTypesView(APIView):
    """List and create project types."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        project_types = ProjectType.objects.all().order_by('name')
        
        enabled = request.query_params.get('enabled')
        if enabled is not None:
            project_types = project_types.filter(enabled=enabled.lower() == 'true')
        
        serializer = AdminProjectTypeSerializer(project_types, many=True)
        return Response({
            'results': serializer.data,
            'count': project_types.count()
        })

    def post(self, request):
        serializer = AdminProjectTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminProjectTypeDetailView(APIView):
    """Get, update, or delete a project type."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_object(self, pk):
        try:
            return ProjectType.objects.get(pk=pk)
        except ProjectType.DoesNotExist:
            return None

    def get(self, request, pk):
        project_type = self.get_object(pk)
        if not project_type:
            return Response(
                {'detail': 'Project type not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = AdminProjectTypeSerializer(project_type)
        return Response(serializer.data)

    def put(self, request, pk):
        project_type = self.get_object(pk)
        if not project_type:
            return Response(
                {'detail': 'Project type not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = AdminProjectTypeSerializer(
            project_type, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        project_type = self.get_object(pk)
        if not project_type:
            return Response(
                {'detail': 'Project type not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        project_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminProjectTypeToggleView(APIView):
    """Toggle project type enabled status."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        try:
            project_type = ProjectType.objects.get(pk=pk)
        except ProjectType.DoesNotExist:
            return Response(
                {'detail': 'Project type not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        project_type.enabled = not project_type.enabled
        project_type.save()
        return Response(AdminProjectTypeSerializer(project_type).data)


# ================== Projects ==================

class AdminProjectsView(APIView):
    """List all projects across all users."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        projects = Project.objects.all().select_related(
            'user', 'project_type'
        ).order_by('-created_at')
        
        # Filtering
        status_filter = request.query_params.get('status')
        project_type = request.query_params.get('project_type')
        has_report = request.query_params.get('has_report')
        search = request.query_params.get('search')
        
        if status_filter:
            projects = projects.filter(status=status_filter)
        if project_type:
            projects = projects.filter(project_type_id=project_type)
        if has_report is not None:
            project_ids_with_reports = Project_Report.objects.values_list('project_id', flat=True)
            if has_report.lower() == 'true':
                projects = projects.filter(id__in=project_ids_with_reports)
            else:
                projects = projects.exclude(id__in=project_ids_with_reports)
        if search:
            projects = projects.filter(
                Q(name__icontains=search) |
                Q(user__name__icontains=search) |
                Q(user__email__icontains=search)
            )
        
        serializer = AdminProjectSerializer(projects, many=True)
        return Response({
            'results': serializer.data,
            'count': projects.count()
        })


class AdminProjectDetailView(APIView):
    """Get, update, or delete a specific project."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_object(self, pk):
        try:
            return Project.objects.select_related('user', 'project_type').get(pk=pk)
        except Project.DoesNotExist:
            return None

    def get(self, request, pk):
        project = self.get_object(pk)
        if not project:
            return Response(
                {'detail': 'Project not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = AdminProjectSerializer(project)
        return Response(serializer.data)

    def put(self, request, pk):
        project = self.get_object(pk)
        if not project:
            return Response(
                {'detail': 'Project not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = AdminProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        project = self.get_object(pk)
        if not project:
            return Response(
                {'detail': 'Project not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ================== Questions ==================

class AdminQuestionsView(APIView):
    """List and create question templates."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        questions = Question.objects.all().select_related(
            'project_type'
        ).order_by('project_type', 'question_no')
        
        # Filtering
        project_type = request.query_params.get('project_type')
        enabled = request.query_params.get('enabled')
        
        if project_type:
            questions = questions.filter(project_type_id=project_type)
        if enabled is not None:
            questions = questions.filter(enabled=enabled.lower() == 'true')
        
        serializer = AdminQuestionSerializer(questions, many=True)
        return Response({
            'results': serializer.data,
            'count': questions.count()
        })

    def post(self, request):
        serializer = AdminQuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminQuestionDetailView(APIView):
    """Get, update, or delete a question."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_object(self, pk):
        try:
            return Question.objects.select_related('project_type').get(pk=pk)
        except Question.DoesNotExist:
            return None

    def get(self, request, pk):
        question = self.get_object(pk)
        if not question:
            return Response(
                {'detail': 'Question not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = AdminQuestionSerializer(question)
        return Response(serializer.data)

    def put(self, request, pk):
        question = self.get_object(pk)
        if not question:
            return Response(
                {'detail': 'Question not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = AdminQuestionSerializer(
            question, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        question = self.get_object(pk)
        if not question:
            return Response(
                {'detail': 'Question not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminQuestionToggleView(APIView):
    """Toggle question enabled status."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        try:
            question = Question.objects.get(pk=pk)
        except Question.DoesNotExist:
            return Response(
                {'detail': 'Question not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        question.enabled = not question.enabled
        question.save()
        return Response(AdminQuestionSerializer(question).data)


class AdminQuestionReorderView(APIView):
    """Reorder questions within a project type."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        """
        Expects: { "project_type_id": 1, "question_order": [3, 1, 2, 4] }
        where question_order is list of question IDs in new order.
        """
        project_type_id = request.data.get('project_type_id')
        question_order = request.data.get('question_order', [])
        
        if not project_type_id or not question_order:
            return Response(
                {'detail': 'project_type_id and question_order are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        for index, question_id in enumerate(question_order, start=1):
            Question.objects.filter(
                pk=question_id, 
                project_type_id=project_type_id
            ).update(question_no=index)
        
        questions = Question.objects.filter(
            project_type_id=project_type_id
        ).order_by('question_no')
        
        serializer = AdminQuestionSerializer(questions, many=True)
        return Response({'results': serializer.data})


# ================== AI Questions Monitor ==================

class AdminAIQuestionsView(APIView):
    """List all AI-generated questions."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        ai_questions = AI_Question.objects.all().select_related(
            'project'
        ).order_by('-created_at')
        
        # Filtering
        project_id = request.query_params.get('project')
        answered = request.query_params.get('answered')
        
        if project_id:
            ai_questions = ai_questions.filter(project_id=project_id)
        if answered is not None:
            answered_ids = AI_Answer.objects.values_list('ai_question_id', flat=True)
            if answered.lower() == 'true':
                ai_questions = ai_questions.filter(id__in=answered_ids)
            else:
                ai_questions = ai_questions.exclude(id__in=answered_ids)
        
        serializer = AdminAIQuestionSerializer(ai_questions, many=True)
        return Response({
            'results': serializer.data,
            'count': ai_questions.count()
        })


# ================== Reports ==================

class AdminReportsView(APIView):
    """List all generated reports."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        reports = Project_Report.objects.all().select_related(
            'project', 'project__user'
        ).order_by('-created_at')
        
        # Filtering
        search = request.query_params.get('search')
        
        if search:
            reports = reports.filter(
                Q(project__name__icontains=search) |
                Q(project__user__name__icontains=search)
            )
        
        serializer = AdminReportSerializer(reports, many=True)
        return Response({
            'results': serializer.data,
            'count': reports.count()
        })


class AdminReportDetailView(APIView):
    """Get or delete a specific report."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_object(self, pk):
        try:
            return Project_Report.objects.select_related(
                'project', 'project__user'
            ).get(pk=pk)
        except Project_Report.DoesNotExist:
            return None

    def get(self, request, pk):
        report = self.get_object(pk)
        if not report:
            return Response(
                {'detail': 'Report not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = AdminReportSerializer(report)
        return Response(serializer.data)

    def delete(self, request, pk):
        report = self.get_object(pk)
        if not report:
            return Response(
                {'detail': 'Report not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        report.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminReportRegenerateView(APIView):
    """Regenerate report for a project."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        """Regenerate report for project with given ID."""
        try:
            project = Project.objects.select_related('project_type').get(pk=pk)
        except Project.DoesNotExist:
            return Response(
                {'detail': 'Project not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check settings if regeneration is allowed
        settings = Settings.get_settings()
        if not settings.report_regeneration_enabled:
            return Response(
                {'detail': 'Report regeneration is disabled.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Delete existing report
        Project_Report.objects.filter(project=project).delete()
        
        # Generate new report (using existing logic from projects app)
        try:
            # Get all answers for this project
            answers = Answer.objects.filter(project=project).select_related('question')
            ai_answers = AI_Answer.objects.filter(
                ai_question__project=project
            ).select_related('ai_question')
            
            if not answers.exists() and not ai_answers.exists():
                return Response(
                    {'detail': 'No answers found for this project.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Build answers text
            answer_text = ""
            for answer in answers:
                answer_text += f"Q: {answer.question.text}\nA: {answer.text}\n\n"
            for ai_answer in ai_answers:
                answer_text += f"Q (AI): {ai_answer.ai_question.text}\nA: {ai_answer.text}\n\n"
            
            # Generate report
            report_content = anthropic_prompt(
                f"Generate a comprehensive project requirements report for '{project.name}' "
                f"(Type: {project.project_type.name}) based on these Q&A:\n\n{answer_text}"
            )
            
            # Save report
            report = Project_Report.objects.create(
                project=project,
                report=report_content
            )
            
            serializer = AdminReportSerializer(report)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'detail': f'Failed to generate report: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ================== Settings ==================

class AdminSettingsView(APIView):
    """Get and update admin settings."""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        settings = Settings.get_settings()
        serializer = SettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        settings = Settings.get_settings()
        serializer = SettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
