'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { signIn } from '@/services/auth/authService';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email.trim(), password);

    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
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
              Secure Access
            </p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-3">
              Welcome Back
            </h1>
            <p className="text-sm text-brand-text-muted">
              Sign in to manage orders and checkout faster.
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
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Email Address
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-400 accent-brand-green cursor-pointer"
                />
                <span className="text-sm text-brand-text-dark">Remember Me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-brand-gold hover:text-brand-green transition-colors font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-brand-text-muted font-medium tracking-wide">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social Buttons (disabled for now) */}
          <div className="space-y-3">
            <button
              type="button"
              disabled
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm font-medium text-brand-text-muted transition-colors flex items-center justify-center gap-3 opacity-60 cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              disabled
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm font-medium text-brand-text-muted transition-colors flex items-center justify-center gap-3 opacity-60 cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-brand-text-muted mt-8">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-brand-gold hover:text-brand-green transition-colors font-semibold"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}