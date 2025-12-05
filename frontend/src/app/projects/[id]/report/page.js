'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ProjectReportPage() {
  const { id } = useParams();
  const projectId = Number(id);
  const router = useRouter();

  const [reportHtml, setReportHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('auth_token');
        const res = await api.get(`/projects/generate_report/${projectId}/`, {}, token);
        // API shape: { detail: "...", data: { id, project, report, ... } }
        setReportHtml(res.data.report || '');
      } catch (err) {
        console.error(err);
        setError('Failed to load report. Ensure all questions are answered.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your report...</p>
        </div>
      </div>
    );
  }

  if (error || !reportHtml) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-red-600 mb-4">{error || 'No report available yet.'}</p>
        <button
          onClick={() => router.push(`/projects/${projectId}`)}
          className="text-indigo-600 hover:underline"
        >
          Back to Project
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">AI Requirements Report</h1>
          <button
            onClick={() => router.push(`/projects/${projectId}`)}
            className="text-sm text-slate-300 hover:text-white"
          >
            ← Back to Project
          </button>
        </div>

        {/* Non-downloadable feel: just on-screen HTML */}
        <div className="bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-10 prose max-w-none">
            {/* reportHtml already contains styled HTML/Markdown hybrid */}
            <div
              dangerouslySetInnerHTML={{ __html: reportHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
