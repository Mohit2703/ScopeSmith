'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Select } from '@/components/ui/Select';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';

export default function SignupPage() {
  const { loginWithToken } = useAuth();
  const [step, setStep] = useState(1); // 1 = signup form, 2 = OTP verification
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    country: '',
    company_name: '',
    role: 'Other',
    linkedin_username: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInitiateSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...signupPayload } = formData;
      const response = await fetch(`${API_BASE}/auth/signup/initiate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.email?.[0] || 'Failed to initiate signup');
      }

      setSuccess(data.message);
      setStep(2);
      setResendTimer(60); // 60 seconds before allowing resend
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/signup/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to verify OTP');
      }

      // Login the user with the returned token
      await loginWithToken(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/signup/resend-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to resend OTP');
      }

      setSuccess(data.message);
      setResendTimer(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep(1);
    setOtp('');
    setError('');
    setSuccess('');
  };

  return (
    <AuthLayout
      title={step === 1 ? "Create an account" : "Verify your email"}
      description={step === 1 ? "Get started with ScopeSmith today" : `We've sent a code to ${formData.email}`}
    >
      {step === 1 ? (
        <form className="space-y-4" onSubmit={handleInitiateSignup}>
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
                { value: 'CEO', label: 'CEO' },
                { value: 'CTO', label: 'CTO' },
                { value: 'Developer', label: 'Developer' },
                { value: 'Project Manager', label: 'Project Manager' },
                { value: 'Other', label: 'Other' },
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
              Continue
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="font-medium text-primary hover:text-primary/90">
              Sign in
            </Link>
          </div>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleVerifyOTP}>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="text-center mb-6">
            <p className="text-muted-foreground text-sm">
              Enter the 6-digit code we sent to your email
            </p>
          </div>

          <Input
            label="Verification Code"
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="000000"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="text-center text-2xl tracking-widest"
          />

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Verify & Create Account
            </Button>
          </div>

          <div className="flex justify-between items-center text-sm pt-2">
            <button
              type="button"
              onClick={handleBackToForm}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendTimer > 0 || isLoading}
              className={`font-medium ${resendTimer > 0
                ? 'text-muted-foreground cursor-not-allowed'
                : 'text-primary hover:text-primary/90 cursor-pointer'
                }`}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}