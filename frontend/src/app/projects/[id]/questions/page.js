'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import api from '@/lib/api';

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    if (params.id) {
      fetchNextQuestion(params.id);
    }
  }, [params.id]);

  const fetchNextQuestion = async (projectId) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/projects/get_next_question/${projectId}/`);

      // If response has 'data' property, it's a question object
      if (response.data) {
        setQuestion(response.data);
        setAnswer('');
        if (response.data.total_questions) {
          setProgress({
            current: response.data.current_question_index,
            total: response.data.total_questions
          });
        }
      } else {
        // All questions answered
        setQuestion(null);
      }
    } catch (err) {
      console.error('Failed to fetch question:', err);
      // Check if error message indicates all questions answered
      if (err.message && err.message.includes('All questions have been answered')) {
        setQuestion(null);
      } else {
        setError(err.message || 'Failed to load question.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (exit = false) => {
    if (!question || !answer.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      // POST to answer_question endpoint
      const response = await api.post('/projects/answer_question/', {
        question_id: question.id,
        project_id: parseInt(params.id),
        text: answer,
        question_type: question.question_type
      });

      if (exit) {
        router.push(`/projects/${params.id}`);
      } else {
        // Check if there's a next question in the response
        if (response.next_question) {
          setQuestion(response.next_question);
          setAnswer('');
          if (response.progress) {
            setProgress({
              current: response.progress.current_question_index,
              total: response.progress.total_questions
            });
          }
        } else {
          // No more questions
          setQuestion(null);
        }
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError(err.message || 'Failed to save answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="h-8 w-1/3 rounded bg-muted animate-pulse"></div>
            <div className="h-64 rounded-lg bg-muted animate-pulse"></div>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  if (!question && !loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 rounded-full bg-green-100 p-4 inline-flex dark:bg-green-900/20">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">All questions answered!</h2>
            <p className="mt-2 text-muted-foreground">You have completed the requirement gathering for this project.</p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href={`/projects/${params.id}`}>
                <Button variant="outline">Back to Project</Button>
              </Link>
              <Link href={`/projects/${params.id}/report`}>
                <Button>View Report</Button>
              </Link>
            </div>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <Link href={`/projects/${params.id}`} className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to Project
            </Link>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="overflow-hidden">
            {/* Progress Bar */}
            {progress.total > 0 && (
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-[var(--brand-blue)] transition-all duration-500 ease-out"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={question.question_type === 'ai' ? 'secondary' : 'default'}>
                  {question.question_type === 'ai' ? 'AI Generated' : 'Standard'}
                </Badge>
                {progress.total > 0 && (
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {progress.current} of {progress.total}
                  </span>
                )}
              </div>
              <CardTitle className="mt-4 text-xl leading-relaxed">
                {question.text}
              </CardTitle>
              {question.description && (
                <CardDescription className="mt-2 text-base">
                  {question.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[200px] text-base"
                autoFocus
              />
              <div className="mt-2 flex justify-end text-xs text-muted-foreground">
                {answer.length} characters
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/20 p-6">
              <Button
                variant="ghost"
                onClick={() => handleSubmit(true)}
                disabled={submitting || !answer.trim()}
              >
                Save & Exit
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                isLoading={submitting}
                disabled={!answer.trim()}
              >
                Submit & Continue
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
            <h4 className="font-semibold mb-1">💡 Tip for better results</h4>
            <p>Be as specific as possible. The more details you provide, the better the AI can generate accurate requirements.</p>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}