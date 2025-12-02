from django.shortcuts import render
from .models import AI_Question, AI_Answer
from projects.models import Project, User, Question, Answer
# Create your views here.


class AIQuestionView:
    def get_ai_questions_for_project(self, project_id):
        try:
            project = Project.objects.get(id=project_id)
            ai_questions = AI_Question.objects.filter(project=project)
            return ai_questions
        except Project.DoesNotExist:
            return None