'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Login failed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Log In</h2>
      {error && <div className="text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded">
          Log In
        </button>
      </form>
    </div>
  );
}