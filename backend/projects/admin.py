from django.contrib import admin
from .models import ProjectType, Project, Status, QuestionType, Question, Answer, AI_Question, AI_Answer
# Register your models here.

@admin.register(ProjectType)
class ProjectTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'enabled']
    list_filter = ['enabled']
    search_fields = ['name']

@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'project_type', 'status', 'enabled']
    list_filter = ['enabled', 'project_type', 'status']
    search_fields = ['name', 'user__username']

@admin.register(QuestionType)
class QuestionTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'enabled']
    list_filter = ['enabled']
    search_fields = ['name']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text', 'project_type', 'question_type', 'enabled']
    list_filter = ['enabled', 'project_type', 'question_type']
    search_fields = ['text']

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['user', 'question', 'project', 'text']
    search_fields = ['user__username', 'question__text', 'project__name']
    list_filter = ['project', 'question', 'user']

@admin.register(AI_Question)
class AI_QuestionAdmin(admin.ModelAdmin):
    list_display = ['project', 'text']
    search_fields = ['text', 'project__name']
    list_filter = ['project']


@admin.register(AI_Answer)
class AI_AnswerAdmin(admin.ModelAdmin):
    list_display = ['ai_question', 'text', 'user']
    search_fields = ['text', 'ai_question__text']
    list_filter = ['ai_question', 'user']
