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
import { Select } from '@/components/ui/Select';
import api from '@/lib/api';
import { SpeechToTextButton } from '@/components/SpeechToTextButton';

export default function CreateProjectPage() {
  const [projectTypes, setProjectTypes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    project_type_id: '',
    industry_type: '',
    description: '',
    file: null
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
    if (e.target.name === 'file') {
      setForm({ ...form, file: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('project_type_id', parseInt(form.project_type_id));
      formData.append('industry_type', form.industry_type);
      formData.append('description', form.description);
      if (form.file) {
        formData.append('file', form.file);
      }

      await api.uploadFile('/projects/project/', formData);
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err.message || 'Project creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTranscribed = (transcript) => {
    setForm(prev => ({
      ...prev,
      description: prev.description ? `${prev.description} ${transcript}` : transcript
    }));
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

                  <Select
                    name="project_type_id"
                    label="Project Type"
                    value={form.project_type_id}
                    onChange={handleChange}
                    required
                    options={[
                      { value: '', label: 'Select a project type' },
                      ...projectTypes.map((pt) => ({
                        value: String(pt.id),
                        label: pt.name,
                      })),
                    ]}
                  />

                  <Select
                    name="industry_type"
                    label="Industry Type"
                    value={form.industry_type}
                    onChange={handleChange}
                    required
                    options={[
                      { value: '', label: 'Select an industry' },
                      { value: 'ecommerce', label: 'E-commerce' },
                      { value: 'fintech', label: 'Fintech' },
                      { value: 'healthcare', label: 'Healthcare' },
                      { value: 'edtech', label: 'EdTech' },
                      { value: 'real_estate', label: 'Real Estate' },
                      { value: 'logistics', label: 'Logistics' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />

                  {form.project_type_id && (
                    <div className="mt-2 rounded-md bg-muted/30 p-3 text-sm text-muted-foreground italic">
                      {projectTypes.find(pt => String(pt.id) === form.project_type_id)?.description}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">
                        Description (Optional)
                      </label>
                      <SpeechToTextButton onTranscribed={handleTranscribed} />
                    </div>
                    <Textarea
                      name="description"
                      placeholder="Briefly describe your project..."
                      rows={4}
                      value={form.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Attach File (Optional)
                    </label>
                    <Input
                      type="file"
                      name="file"
                      onChange={handleChange}
                      className="cursor-pointer"
                    />
                  </div>

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
