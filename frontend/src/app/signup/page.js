'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Select } from '@/components/ui/Select';

export default function SignupPage() {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    country: '',
    company_name: '',
    role: 'client',
    linkedin_username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    const { confirmPassword, ...signupPayload } = formData;
    const result = await signup(signupPayload);

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
    }
    // If success, AuthContext handles redirect
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Get started with ScopeSmith today"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Input
          label="Full Name"
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          label="Email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Mobile Number"
            id="mobile_number"
            name="mobile_number"
            type="tel"
            value={formData.mobile_number}
            onChange={handleChange}
          />
          <Input
            label="Country"
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            id="company_name"
            name="company_name"
            type="text"
            value={formData.company_name}
            onChange={handleChange}
          />
          <Select
            label="Role"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: 'client', label: 'Client' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
        </div>

        <Input
          label="LinkedIn Username"
          id="linkedin_username"
          name="linkedin_username"
          type="text"
          value={formData.linkedin_username}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Sign up
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="font-medium text-primary hover:text-primary/90">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}