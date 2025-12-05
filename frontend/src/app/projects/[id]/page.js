'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ProjectDashboardPage() {
  const { id } = useParams();
  const projectId = Number(id);
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [hasNextQuestion, setHasNextQuestion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('auth_token');

      // Load project details
      const projRes = await api.get(`/projects/project/${projectId}/`, {}, token);
      setProject(projRes.data);

      // Check if there are more questions
      try {
        const nextQRes = await api.get(`/projects/get_next_question/${projectId}/`, {}, token);
        setHasNextQuestion(nextQRes.detail !== "All questions have been answered.");
      } catch {
        setHasNextQuestion(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuestions = () => {
    router.push(`/projects/${projectId}/questions`);
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!project) return <div className="p-8">Project not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-600 mb-4">{project.description || 'No description'}</p>
        <div className="flex gap-2 text-sm text-gray-500">
          <span className="bg-gray-100 px-3 py-1 rounded-full">Status: {project.status}</span>
        </div>
      </div>

      {hasNextQuestion ? (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-indigo-900 mb-2">
            📝 Continue Requirement Gathering
          </h2>
          <p className="text-indigo-700 mb-4">
            Answer questions to help us understand your project requirements better.
          </p>
          <button
            onClick={handleStartQuestions}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700"
          >
            Continue Answering Questions
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-2">
            ✅ All Questions Answered
          </h2>
          <p className="text-green-700 mb-4">
            Great! Your AI-generated requirements report is ready.
          </p>
          <button
          onClick={() => router.push(`/projects/${projectId}/report`)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
        >
          View Requirements Report
        </button>
        </div>
      )}
    </div>
  );
}
