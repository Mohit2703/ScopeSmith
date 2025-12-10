from django.shortcuts import render
from .models import AI_Question, AI_Answer
from projects.models import Project, User, Question, Answer
from anthropic.prompt import anthropic_prompt
# Create your views here.


class AIQuestionView:
    def get_ai_questions_for_project(self, project_id):
        try:
            project = Project.objects.get(id = project_id)
            answer_questions = Answer.objects.filter(project=project)
            ai_answer_questions = AI_Answer.objects.filter(ai_question__project = project)
            question_answer_list = []

            for q in answer_questions:
                question_answer_list.append({
                    "question_text": q.question.text,
                    "answer_text": q.text,
                    "question_asked_by": "predifined"
                })

            for aq in ai_answer_questions:
                question_answer_list.append({
                    "question_text": aq.ai_question.text,
                    "answer_text": aq.text,
                    "question_asked_by": "ai"
                })

            questions = anthropic_prompt.ask_questions(question_answer_list)

            


