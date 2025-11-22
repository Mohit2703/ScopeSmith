from django.shortcuts import render
from rest_framework import status
from django.contrib.auth import  get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from .models import ProjectType, Project, Question, Answer
from .serializers import QuestionSerializer, AnswerSerializer, ProjectTypeSerializer, ProjectSerializer
from django.db.models import Q


# Create your views here.
User = get_user_model()

class CreateProjectTypesView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        # Logic to create project types
        user_info = request.user

        print("user: ", user_info)

        if user_info.role != "admin":
            return Response({"detail": "Only admin users can create project types."}, status=status.HTTP_403_FORBIDDEN)
        
        name, description = request.data.get("name"), request.data.get("description", "")
        if not name:
            return Response({"detail": "Project type name is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        project_type = ProjectType.objects.create(name=name, description=description)
        serializer = ProjectTypeSerializer(project_type)
        return Response({"detail": "Project type created successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    
class RemoveProjectTypesView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        # Logic to remove project types
        user_info = request.user

        if user_info.role != "admin":
            return Response({"detail": "Only admin users can remove project types."}, status=status.HTTP_403_FORBIDDEN)
        
        project_type_id = request.data.get("project_type_id")
        if not project_type_id:
            return Response({"detail": "Project type ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            project_type = ProjectType.objects.get(id=project_type_id)
            project_type.enabled = False
            project_type.save()
            return Response({"detail": "Project type removed successfully."}, status=status.HTTP_200_OK)
        except ProjectType.DoesNotExist:
            return Response({"detail": "Project type not found."}, status=status.HTTP_404_NOT_FOUND)
        
class GetProjectTypesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Logic to get all project types
        project_types = ProjectType.objects.filter(enabled=True)
        project_types_data = [{"id": pt.id, "name": pt.name, "description": pt.description} for pt in project_types]
        return Response({"data": project_types_data}, status=status.HTTP_200_OK)
    
class ProjectView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        user = request.user

        name, description, project_type_id = request.data.get("name"), request.data.get("description", ""), request.data.get("project_type_id")

        if not name or not project_type_id:
            return Response({"detail": "Name, description, and project type ID are required."}, status=status.HTTP_400_BAD_REQUEST)

        project_type = ProjectType.objects.get(id = project_type_id)

        if not project_type:
            return Response({"detail": "Project type is not present"}, status=status.HTTP_400_BAD_REQUEST)

        project = Project.objects.create(name = name, description = description, project_type = project_type, user = user)
        serializer = ProjectSerializer(project)
        return Response({
            "detail": "Project Created successfully",
            "data": serializer.data
        }, status = status.HTTP_201_CREATED) 
    
    
    def get(self, request):
        user = request.user
        enabled = request.GET.get('enabled', True)
        project_status = request.GET.get('status', None)
        project_type_id = request.GET.get('project_type_id', None)
        query = request.GET.get('q', '')


        project = Project.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query)
        ).filter(enabled = enabled)

        if project_type_id:
            project_type = ProjectType.objects.filter(id = project_type_id)
            project = project.filter(project_type = project_type)

        if project_status:
            project = project.filter(status = project_status)

        if user.role != 'admin':
            project = project.filter(user = user)
        
        project_data = ProjectSerializer(project, many = True)

        return Response({
            "detail": "Project list retrieved successfully",
            "data": project_data.data
        }, status=status.HTTP_200_OK)


class GetOneProjectView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, project_id):
        print("project_id: ", project_id)
        user = request.user
        project = Project.objects.get(id = project_id)

        if not project:
            return Response({"detail": "Project is not present"}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.role != 'admin' or user != project.user:
            return Response({"detail": "User is not authorized to view this project."}, status=status.HTTP_400_BAD_REQUEST)
        project_data = ProjectSerializer(project).data
        return Response({
            "detail": "Project detail retreived",
            "data": project_data
        }, status = status.HTTP_200_OK)
    

class RemoveProjectView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, project_id):
        user = request.user
        project = Project.objects.get(id = project_id)

        if not project:
            return Response({"detail": "Project is not present"}, status=status.HTTP_400_BAD_REQUEST)

        if user["role"] != "admin" or user != project.user:
            return Response({"detail": "User is not able to delete project"}, status=status.HTTP_400_BAD_REQUEST)
        
        project.enabled = False
        project.save()
        return Response({"detail": "Project removed successfully."}, status=status.HTTP_200_OK)


class QuestionView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        user = request.user

        if user.role != "admin":
            return Response({"detail": "User is not admin to create question"}, status=status.HTTP_400_BAD_REQUEST)
        
        project_type_id, text, description, question_type = request.data.get("project_type_id"), request.data.get("text"), request.data.get("description", ""), request.data.get("question_type")

        project_type = ProjectType.objects.get(id = project_type_id)

        if not project_type:
            return Response({"detail": "Project Type is not present"}, status=status.HTTP_400_BAD_REQUEST)
        
        question = Question.objects.create(
            project_type = project_type,
            text = text,
            description = description,
            question_type = question_type
        )

        return Response({
            "detail": "Question Created successfully",
            "data": QuestionSerializer(question).data
        }, status = status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        # Try project_type_id first
        project_type_id = kwargs.get("project_type_id")
        question_id = kwargs.get("question_id")

        if project_type_id is not None:
            try:
                project_type = ProjectType.objects.get(id=project_type_id)
            except ProjectType.DoesNotExist:
                return Response({"detail": "Project Type is not present"}, status=status.HTTP_400_BAD_REQUEST)
            
            questions = Question.objects.filter(project_type=project_type, enabled=True)
            serializer = QuestionSerializer(questions, many=True)
            return Response({
                "detail": "Questions to the project",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        elif question_id is not None:
            try:
                question = Question.objects.get(id=question_id, enabled=True)
            except Question.DoesNotExist:
                return Response({"detail": "Question is not present"}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = QuestionSerializer(question)
            return Response({
                "detail": "Question detail retrieved",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        else:
            return Response({"detail": "Missing required URL parameter"}, status=status.HTTP_400_BAD_REQUEST)


class RemoveQuestionView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, question_id):
        user = request.user

        if user.role != "admin":
            return Response({"detail": "User is not admin to remove question"}, status=status.HTTP_400_BAD_REQUEST)
        
        question = Question.objects.get(id = question_id)

        if not question:
            return Response({"detail": "Question is not present"}, status=status.HTTP_400_BAD_REQUEST)
        
        question.enabled = False
        question.save()

        return Response({
            "detail": "Question removed successfully"
        }, status = status.HTTP_200_OK)


class AnswerView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        user = request.user

        question_id, project_id, text = request.data.get("question_id"), request.data.get("project_id"), request.data.get("text")

        question = Question.objects.get(id = question_id)

        if not question:
            return Response({"detail": "Question is not present"}, status=status.HTTP_400_BAD_REQUEST)
        
        project = Project.objects.get(id = project_id)

        if not project:
            return Response({"detail": "Project is not present"}, status=status.HTTP_400_BAD_REQUEST)
        
        answer = Answer.objects.create(
            user = user,
            question = question,
            project = project,
            text = text
        )

        return Response({
            "detail": "Answer Created successfully",
            "data": AnswerSerializer(answer).data
        }, status = status.HTTP_201_CREATED)
    
    def get(self, request, project_id):
        user = request.user

        project = Project.objects.get(id = project_id)

        if not project:
            return Response({"detail": "Project is not present"}, status=status.HTTP_400_BAD_REQUEST)
        
        if user["role"] != "admin" or user != project.user:
            return Response({"detail": "User is not authorized to view answers for this project."}, status=status.HTTP_400_BAD_REQUEST)
        
        answers = Answer.objects.filter(project = project)

        serializer = AnswerSerializer(answers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def get(self, request, *args, **kwargs):
        project_id = kwargs.get("project_id")
        question_id = kwargs.get("question_id")
        user = request.user

        project = Project.objects.get(id = project_id)

        if not project:
            return Response({"detail": "Project is not present"}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.role != "admin" or user != project.user:
            return Response({"detail": "User is not authorized to view answers for this project."}, status=status.HTTP_400_BAD_REQUEST)
        
        answers = Answer.objects.filter(project = project)
        if question_id:
            question = Question.objects.get(id = question_id)
            answers = answers.filter(question = question)

        serializer = AnswerSerializer(answers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RemoveAnswerView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, answer_id):
        user = request.user

        answer = Answer.objects.get(id = answer_id)

        if not answer:
            return Response({"detail": "Answer is not present"}, status=status.HTTP_400_BAD_REQUEST)
        
        project = answer.project

        if user.role != "admin" or user != project.user:
            return Response({"detail": "User is not authorized to remove this answer."}, status=status.HTTP_400_BAD_REQUEST)
        
        answer.delete()

        return Response({
            "detail": "Answer removed successfully"
        }, status = status.HTTP_200_OK)


    
