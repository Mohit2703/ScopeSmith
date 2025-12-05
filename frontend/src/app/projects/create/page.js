'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import api from '@/lib/api';

export default function CreateProjectPage() {
  const [projectTypes, setProjectTypes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    project_type_id: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProjectTypes();
  }, []);

  const fetchProjectTypes = async () => {
    try {
      const result = await api.get('/projects/get_project_type/');
      setProjectTypes(result.data || []);
    } catch (err) {
      console.error('Failed to load project types:', err);
      setError('Failed to load project types');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/projects/project/', {
        ...form,
        project_type_id: parseInt(form.project_type_id)
      });
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err.message || 'Project creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <AppLayout>
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to Dashboard
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Create New Project</CardTitle>
              <CardDescription>
                Start gathering requirements with AI-powered questions
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="space-y-4">
                  <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
                  <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
                  <div className="h-32 w-full animate-pulse rounded bg-muted"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    type="text"
                    name="name"
                    label="Project Name"
                    placeholder="e.g., E-commerce Platform"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Project Type
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {projectTypes.map((pt) => (
                        <label
                          key={pt.id}
                          className={`relative flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all ${form.project_type_id === String(pt.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                            }`}
                        >
                          <input
                            type="radio"
                            name="project_type_id"
                            value={pt.id}
                            checked={form.project_type_id === String(pt.id)}
                            onChange={handleChange}
                            className="sr-only"
                            required
                          />
                          <div className="flex-1">
                            <span className="block font-semibold text-foreground">
                              {pt.name}
                            </span>
                            {pt.description && (
                              <span className="mt-1 block text-sm text-muted-foreground">
                                {pt.description}
                              </span>
                            )}
                          </div>
                          {form.project_type_id === String(pt.id) && (
                            <svg
                              className="h-5 w-5 text-primary"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <Textarea
                    name="description"
                    label="Description (Optional)"
                    placeholder="Briefly describe your project..."
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      size="lg"
                      isLoading={submitting}
                    >
                      Create Project
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => router.push('/dashboard')}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
