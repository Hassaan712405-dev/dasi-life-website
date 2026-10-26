'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { signIn } from '@/services/auth/authService';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';
  const errorParam = searchParams.get('error');

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | null>(null);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorType('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
        setErrorType(result.errorType || 'unknown');
        setLoading(false);
        return;
      }

      // ✅ Success — wait for session cookie to be set
      await new Promise((resolve) => setTimeout(resolve, 500));

      // ✅ Full page reload for clean auth state
      window.location.href = redirectTo;
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    setError('');
    setErrorType('');
    setSocialLoading(provider);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            redirectTo
          )}`,
        },
      });

      if (error) {
        setError(error.message);
        setSocialLoading(null);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setSocialLoading(null);
    }
  };

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-10"
        >
          {/* Heading */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3">
              Secure Access
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2 sm:mb-3">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-brand-text-muted">
              Sign in to manage orders and checkout faster.
            </p>
          </div>

          {/* Redirect Notice */}
          {redirectTo === '/checkout' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-5 bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2"
            >
              <AlertCircle
                size={14}
                className="text-amber-600 shrink-0 mt-0.5"
              />
              <p className="text-xs sm:text-sm text-amber-700">
                Please sign in to complete your order.
              </p>
            </motion.div>
          )}

          {/* Auth failed notice from OAuth callback */}
          {errorParam === 'auth_failed' && !error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-5 bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2"
            >
              <AlertCircle
                size={14}
                className="text-red-500 shrink-0 mt-0.5"
              />
              <p className="text-xs sm:text-sm text-red-600">
                Authentication failed. Please try again.
              </p>
            </motion.div>
          )}

          {/* Error with contextual links */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 sm:mb-5 border rounded-md p-3 ${
                errorType === 'invalid_credentials'
                  ? 'bg-red-50 border-red-200'
                  : errorType === 'email_not_confirmed'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <AlertCircle
                  size={16}
                  className={`shrink-0 mt-0.5 ${
                    errorType === 'email_not_confirmed'
                      ? 'text-amber-600'
                      : 'text-red-500'
                  }`}
                />
                <div className="flex-1">
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      errorType === 'email_not_confirmed'
                        ? 'text-amber-700'
                        : 'text-red-600'
                    }`}
                  >
                    {error}
                  </p>

                  {/* Show contextual links */}
                  {errorType === 'invalid_credentials' && (
                    <div className="mt-2 pt-2 border-t border-red-200 space-y-1">
                      <Link
                        href="/forgot-password"
                        className="block text-xs text-brand-gold hover:text-brand-green underline"
                      >
                        Forgot password? Reset it →
                      </Link>
                      <Link
                        href="/register"
                        className="block text-xs text-brand-gold hover:text-brand-green underline"
                      >
                        Create new account →
                      </Link>
                    </div>
                  )}

                  {errorType === 'email_not_confirmed' && (
                    <p className="text-xs text-amber-700 mt-2">
                      Email not received? Check your spam folder.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 pr-14 sm:pr-16 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-400 accent-brand-green cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-brand-text-dark">
                  Remember Me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs sm:text-sm text-brand-gold hover:text-brand-green transition-colors font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-green hover:bg-black text-white font-medium py-3 sm:py-3.5 rounded-md transition-colors text-xs sm:text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-5 sm:my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-[10px] sm:text-xs text-brand-text-muted font-medium tracking-wide">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* GOOGLE BUTTON */}
          <div>
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={socialLoading !== null}
              className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-brand-text-dark hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {socialLoading === 'google' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {socialLoading === 'google'
                ? 'Redirecting...'
                : 'Continue with Google'}
            </button>
          </div>

          <p className="text-center text-xs sm:text-sm text-brand-text-muted mt-6 sm:mt-8">
            Don't have an account?{' '}
            <Link
              href={`/register${
                redirectTo === '/checkout' ? '?redirect=/checkout' : ''
              }`}
              className="text-brand-gold hover:text-brand-green transition-colors font-semibold"
            >
              Register Now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-cream flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-brand-green" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}