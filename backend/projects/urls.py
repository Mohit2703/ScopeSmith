# users/urls.py
from django.urls import path
from .views import CreateProjectTypesView, RemoveProjectTypesView, GetProjectTypesView, ProjectView, RemoveProjectView, GetOneProjectView, QuestionView, RemoveQuestionView, AnswerView, RemoveAnswerView

urlpatterns = [
    path("create_project_type/", CreateProjectTypesView.as_view(), name="create project type"),
    path("remove_project_type/", RemoveProjectTypesView.as_view(), name="remove project type"),
    path("get_project_type/", GetProjectTypesView.as_view(), name="get project type"),
    path("project/", ProjectView.as_view()),
    path("project/<int:project_id>/", GetOneProjectView.as_view()),
    path("remove_project/<int:project_id>/", RemoveProjectView.as_view()),
    path("question/", QuestionView.as_view()),
    path("question_project/<int:project_type_id>/", QuestionView.as_view()),
    path("question/<int:question_id>/", QuestionView.as_view()),
    path("remove_question/<int:question_id>/", RemoveQuestionView.as_view()),
    path("answer/", AnswerView.as_view()),
    path("answer/<int:project_id>/", AnswerView.as_view()),
    path("answer/<int:question_id>/<int:project_id>/", AnswerView.as_view()),
    path("remove_answer/<int:answer_id>/", RemoveAnswerView.as_view()),
]
