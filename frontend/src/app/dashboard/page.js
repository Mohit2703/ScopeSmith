'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('auth_token');
      const res = await api.get('/projects/project/', {}, token); // returns {detail, data:[...]} [file:41]
      setProjects(res.data || []);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      const token = localStorage.getItem('auth_token');
      await api.post(`/projects/remove_project/${id}/`, {}, token); // uses remove endpoint [file:41]
      loadProjects();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Link
          href="/projects/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          + Create Project
        </Link>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {projects.length === 0 && (
        <div className="text-gray-500">No projects yet. Create your first project.</div>
      )}

      <div className="space-y-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className="border rounded p-4 flex justify-between items-center bg-white"
          >
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-gray-500 text-sm">
                Status: {p.status} • ID: {p.id}
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/projects/${p.id}`}
                className="text-indigo-600 hover:underline text-sm"
              >
                Open
              </Link>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
