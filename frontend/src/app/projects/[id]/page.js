'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import api from '@/lib/api';

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id);
    }
  }, [params.id]);

  const fetchProject = async (id) => {
    try {
      const response = await api.get(`/projects/project/${id}/`);
      setProject(response.data);

      // Check if there are more questions to answer
      try {
        const questionResponse = await api.get(`/projects/get_next_question/${id}/`);
        // If we get a question, there are more to answer
        if (questionResponse.data) {
          setProject(prev => ({ ...prev, hasMoreQuestions: true }));
        } else {
          setProject(prev => ({ ...prev, hasMoreQuestions: false }));
        }
      } catch (err) {
        // If error message says all questions answered, set hasMoreQuestions to false
        if (err.message && err.message.includes('All questions have been answered')) {
          setProject(prev => ({ ...prev, hasMoreQuestions: false }));
        } else {
          // Some other error, assume there might be questions
          setProject(prev => ({ ...prev, hasMoreQuestions: true }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch project:', err);
      setError('Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 rounded bg-muted"></div>
            <div className="h-64 rounded-lg bg-muted"></div>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  if (error || !project) {
    return (
      <AuthGuard>
        <AppLayout>
          <Alert variant="destructive">
            <AlertDescription>{error || 'Project not found'}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  // Use hasMoreQuestions to determine if all questions are answered
  const allQuestionsAnswered = project.hasMoreQuestions === false;

  // Keep the progress display if the backend provides these fields
  const answeredCount = project.answered_count || 0;
  const totalCount = project.total_count || 0;

  return (
    <AuthGuard>
      <AppLayout>
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl">{project.name}</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {project.description}
                    </CardDescription>
                  </div>
                  <Badge variant={allQuestionsAnswered ? 'success' : 'default'} className="text-sm">
                    {project.status?.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {totalCount > 0 && (
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium">Progress</span>
                      <span className="text-muted-foreground">
                        {answeredCount} of {totalCount} questions answered
                      </span>
                    </div>
                    <Progress value={answeredCount} max={totalCount} />
                  </div>
                )}

                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium">Next Steps</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {allQuestionsAnswered
                      ? "All questions answered! You can now generate and view the report."
                      : "Continue answering questions to complete the requirement gathering process."}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                {allQuestionsAnswered ? (
                  <Link href={`/projects/${project.id}/report`} className="w-full">
                    <Button className="w-full" size="lg">
                      View AI-Generated Report
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/projects/${project.id}/questions`} className="w-full">
                    <Button className="w-full" size="lg">
                      Continue Answering Questions
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <span className="block font-medium text-muted-foreground">Created</span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block font-medium text-muted-foreground">Last Updated</span>
                  <span>{new Date(project.updated_at || project.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block font-medium text-muted-foreground">Status</span>
                  <span className="capitalize">{project.status?.replace('_', ' ')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
