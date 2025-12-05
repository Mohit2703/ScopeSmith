'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CreateProjectPage() {
  const [projectTypes, setProjectTypes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    project_type_id: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjectTypes() {
      try {
        const token = localStorage.getItem('auth_token');
        const result = await api.get('/projects/get_project_type/', {}, token);
        setProjectTypes(result.data || []);
      } catch (err) {
        setError('Failed to load project types');
      }
    }
    fetchProjectTypes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      await api.post('/projects/project/', {
        ...form,
        project_type_id: parseInt(form.project_type_id)
      }, token);
      router.push('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Project creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Create New Project</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <select
          name="project_type_id"
          className="w-full p-2 border rounded"
          value={form.project_type_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Project Type</option>
          {projectTypes.map((pt) => (
            <option key={pt.id} value={pt.id}>
              {pt.name}
            </option>
          ))}
        </select>
        <textarea
          name="description"
          placeholder="Description (optional)"
          rows={4}
          className="w-full p-2 border rounded"
          value={form.description}
          onChange={handleChange}
        />
        <button
          disabled={submitting}
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded mt-2"
        >
          {submitting ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}
