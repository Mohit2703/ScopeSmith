from django.db import models
from users.models import User
# Create your models here.

class ProjectType(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(blank=True, default="")
    icon = models.CharField(max_length=10, default="📁")
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Status(models.Model):
    name = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Project(models.Model):
    STATUS_CHOICES = [
        ('proposed', 'procesed'),
        ('called', 'called'),
        ('converted', 'converted'),
        ('trash', 'trash')
    ]
    INDUSTRY_CHOICES = [
        ('ecommerce', 'E-commerce'),
        ('fintech', 'Fintech'),
        ('healthcare', 'Healthcare'),
        ('edtech', 'EdTech'),
        ('real_estate', 'Real Estate'),
        ('logistics', 'Logistics'),
        ('other', 'Other'),
    ]
    name = models.CharField(max_length=250)
    description = models.TextField(blank=True, default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project_type = models.ForeignKey(ProjectType, on_delete=models.CASCADE)
    industry_type = models.CharField(max_length=50, choices=INDUSTRY_CHOICES, default='other')
    status = models.CharField(max_length=50, default="proposed", choices=STATUS_CHOICES)
    enabled = models.BooleanField(default=True)
    file = models.FileField(upload_to='projects/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)    

class QuestionType(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(blank=True, default="")
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)    

class Question(models.Model):
    QUESTION_TYPE_CHOICES = [
        ('text', 'text'),
        ('mcq', 'mcq'),
        ('mic', 'mic')       
    ]
    question_no = models.IntegerField()
    next_question = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    text = models.TextField()
    description = models.TextField(blank=True, default="")
    project_type = models.ForeignKey(ProjectType, on_delete=models.CASCADE)
    question_type = models.CharField(max_length=50, default='text', choices=QUESTION_TYPE_CHOICES)
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('question_no', 'project_type')


class Answer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)    

class AI_Question(models.Model):
    question_no = models.IntegerField()
    next_question = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    text = models.TextField()
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('question_no', 'project')

class AI_Answer(models.Model):
    ai_question = models.ForeignKey(AI_Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Project_Report(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    report = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
