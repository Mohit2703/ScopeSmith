# admin_api/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from projects.models import (
    ProjectType, Project, Question, Answer, 
    AI_Question, AI_Answer, Project_Report
)
from .models import Settings

User = get_user_model()


class AdminUserSerializer(serializers.ModelSerializer):
    """Serializer for user management with project counts."""
    project_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'name', 'email', 'role', 'enabled',
            'date_joined', 'last_login', 'created_at', 'updated_at',
            'project_count'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'created_at', 'updated_at']
    
    def get_project_count(self, obj):
        return Project.objects.filter(user=obj).count()


class AdminUserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users from admin panel."""
    password = serializers.CharField(write_only=True, min_length=8, required=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'email', 'role', 'enabled', 'password']
    
    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already in use.")
        return value
    
    def validate_password(self, value):
        validate_password(value)
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        username = validated_data.get('username') or validated_data['email'].split('@')[0]
        validated_data['username'] = username
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating users from admin panel."""
    password = serializers.CharField(write_only=True, min_length=8, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'email', 'role', 'enabled', 'password']
        read_only_fields = ['id']
    
    def validate_email(self, value):
        instance = self.instance
        if User.objects.filter(email__iexact=value).exclude(pk=instance.pk).exists():
            raise serializers.ValidationError("Email already in use.")
        return value
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class NestedUserSerializer(serializers.ModelSerializer):
    """Minimal user info for nested relationships."""
    class Meta:
        model = User
        fields = ['id', 'name', 'email']


class NestedProjectTypeSerializer(serializers.ModelSerializer):
    """Minimal project type info for nested relationships."""
    class Meta:
        model = ProjectType
        fields = ['id', 'name']


class AdminProjectTypeSerializer(serializers.ModelSerializer):
    """Project type with question count."""
    question_count = serializers.SerializerMethodField()
    project_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectType
        fields = [
            'id', 'name', 'description', 'icon', 'enabled',
            'created_at', 'updated_at', 'question_count', 'project_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_question_count(self, obj):
        return Question.objects.filter(project_type=obj).count()
    
    def get_project_count(self, obj):
        return Project.objects.filter(project_type=obj).count()


class AdminProjectSerializer(serializers.ModelSerializer):
    """Project with nested user, project_type, and report status."""
    user = NestedUserSerializer(read_only=True)
    project_type = NestedProjectTypeSerializer(read_only=True)
    has_report = serializers.SerializerMethodField()
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )
    project_type_id = serializers.PrimaryKeyRelatedField(
        queryset=ProjectType.objects.all(), source='project_type', write_only=True
    )
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'user', 'user_id', 
            'project_type', 'project_type_id', 'status', 'enabled',
            'created_at', 'updated_at', 'has_report'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_has_report(self, obj):
        return Project_Report.objects.filter(project=obj).exists()


class AdminQuestionSerializer(serializers.ModelSerializer):
    """Question with project type info."""
    project_type = NestedProjectTypeSerializer(read_only=True)
    project_type_id = serializers.PrimaryKeyRelatedField(
        queryset=ProjectType.objects.all(), source='project_type', write_only=True
    )
    
    class Meta:
        model = Question
        fields = [
            'id', 'question_no', 'text', 'description', 
            'project_type', 'project_type_id', 'question_type',
            'enabled', 'next_question', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdminAIQuestionSerializer(serializers.ModelSerializer):
    """AI question with project and answer info."""
    project_name = serializers.CharField(source='project.name', read_only=True)
    answer_count = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    
    class Meta:
        model = AI_Question
        fields = [
            'id', 'question_no', 'text', 'description', 'project',
            'project_name', 'created_at', 'updated_at',
            'answer_count', 'status'
        ]
    
    def get_answer_count(self, obj):
        return AI_Answer.objects.filter(ai_question=obj).count()
    
    def get_status(self, obj):
        if AI_Answer.objects.filter(ai_question=obj).exists():
            return 'answered'
        return 'pending'


class NestedProjectSerializer(serializers.ModelSerializer):
    """Minimal project info for nested relationships."""
    user = NestedUserSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'user']


class AdminReportSerializer(serializers.ModelSerializer):
    """Report with project and client info."""
    project = NestedProjectSerializer(read_only=True)
    format = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    
    class Meta:
        model = Project_Report
        fields = [
            'id', 'project', 'report', 'created_at', 'updated_at',
            'format', 'status'
        ]
    
    def get_format(self, obj):
        return 'PDF'  # Default format
    
    def get_status(self, obj):
        return 'ready' if obj.report else 'pending'


class SettingsSerializer(serializers.ModelSerializer):
    """Settings serializer for feature flags and branding."""
    class Meta:
        model = Settings
        fields = [
            'id', 'ai_questions_enabled', 'voice_input_enabled',
            'report_regeneration_enabled', 'primary_color', 'accent_color',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdminDashboardStatsSerializer(serializers.Serializer):
    """Dashboard statistics serializer."""
    total_users = serializers.IntegerField()
    total_projects = serializers.IntegerField()
    total_reports = serializers.IntegerField()
    total_ai_questions = serializers.IntegerField()
    new_users_this_week = serializers.IntegerField()
    new_projects_this_week = serializers.IntegerField()
    reports_this_week = serializers.IntegerField()
    active_projects = serializers.IntegerField()
    project_types_count = serializers.IntegerField()
    questions_count = serializers.IntegerField()
