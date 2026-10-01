'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { signUp } from '@/services/auth/authService';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    const result = await signUp(
      email.trim(),
      password,
      fullName.trim(),
      phone.trim()
    );

    if (!result.success) {
      setError(result.error || 'Registration failed. Please try again.');
      setLoading(false);
      return;
    }

    // Success — redirect to account
    router.push('/account');
    router.refresh();
  };

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-10">
          
          {/* Heading */}
          <div className="text-center mb-8">
            <p className="text-brand-gold font-semibold text-xs tracking-widest uppercase mb-3">
              Join the Heritage
            </p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-3">
              Create Your Account
            </h1>
            <p className="text-sm text-brand-text-muted">
              Sign up to track Unani wellness purchases and get rewards.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="E.g., Hamza Ahmed"
                required
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                required
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-16 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-brand-gold hover:text-brand-green transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs text-brand-text-muted mt-1">
                Minimum 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-16 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-brand-gold hover:text-brand-green transition-colors"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 mt-0.5 rounded border-gray-400 accent-brand-green cursor-pointer shrink-0"
              />
              <span className="text-sm text-brand-text-muted leading-relaxed">
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="text-brand-gold hover:text-brand-green transition-colors font-medium underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-brand-gold hover:text-brand-green transition-colors font-medium underline"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {/* Create Account */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-brand-text-muted mt-8">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-brand-gold hover:text-brand-green transition-colors font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}