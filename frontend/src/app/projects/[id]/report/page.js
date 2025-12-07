'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import ReportViewer from '@/components/ReportViewer';
import api from '@/lib/api';

export default function ReportPage() {
  const params = useParams();
  const [reportHtml, setReportHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchReport(params.id);
    }
  }, [params.id]);

  const fetchReport = async (projectId) => {
    try {
      const response = await api.get(`/projects/generate_report/${projectId}/`);
      // response: { detail, data: { report: "<HTML string>" } }
      setReportHtml(response.data?.report || '');
    } catch (err) {
      console.error('Failed to fetch report:', err);
      setError('Failed to generate report. Please ensure all questions are answered.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">
          <div className="text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-zinc-400">Generating your report...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-zinc-950 p-8 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Link href={`/projects/${params.id}`}>
              <Button variant="secondary" className="w-full">Back to Project</Button>
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link href={`/projects/${params.id}`}>
                <Button variant="ghost" className="text-zinc-400 hover:text-white">
                  ← Back
                </Button>
              </Link>
              <span className="font-semibold">Project Report</span>
            </div>
            {/* No download button as per requirements */}
          </div>
        </header>

        {/* Report Content */}
        <main className="flex-1 overflow-auto py-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl bg-white text-zinc-900 shadow-2xl overflow-hidden">
              <div className="p-8 sm:p-12">
                <ReportViewer htmlContent={reportHtml} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
