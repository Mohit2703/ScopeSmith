from rest_framework import serializers
from .models import ProjectType, Project, Question, Answer, AI_Answer, AI_Question, Project_Report

class ProjectTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectType
        fields = ["id", "name", "description", "enabled", "created_at", "updated_at"]

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name", "description", "user", "project_type", "status", "enabled", "created_at", "updated_at"]

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "text", "description", "project_type", "question_type", "enabled", "created_at", "updated_at", "next_question"]

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "user", "question", "project", "text", "created_at", "updated_at"]

class AI_QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AI_Question
        fields = ["id", "text", "description", "project", "created_at", "updated_at"]

class AI_AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AI_Answer
        fields = ["id", "user", "ai_question", "text", "created_at", "updated_at"]

class Project_ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project_Report
        fields = ["id", "project", "report", "created_at", "updated_at"]
