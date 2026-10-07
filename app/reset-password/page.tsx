'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { resetPassword } from '@/services/auth/authService';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [validSession, setValidSession] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ✅ Check if user has valid session (came from reset link)
  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setValidSession(true);
      } else {
        setValidSession(false);
      }
      setReady(true);
    }

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(password);

      if (!result.success) {
        setError(result.error || 'Failed to reset password.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // ✅ Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // Loading
  if (!ready) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-brand-green" />
      </div>
    );
  }

  // Invalid session
  if (!validSession) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="container-custom py-8 sm:py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-5">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-brand-green mb-3">
              Invalid Reset Link
            </h1>
            <p className="text-sm text-brand-text-muted mb-6">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block bg-brand-green hover:bg-black text-white font-medium py-3 px-8 rounded-md transition-colors text-sm"
            >
              Request New Link
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Success
  if (success) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="container-custom py-8 sm:py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-5"
            >
              <CheckCircle2 size={32} className="text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-heading font-bold text-brand-green mb-3">
              Password Updated!
            </h1>
            <p className="text-sm text-brand-text-muted mb-6">
              Your password has been successfully reset. You can now login with
              your new password.
            </p>
            <Loader2
              size={20}
              className="animate-spin text-brand-green mx-auto mb-3"
            />
            <p className="text-xs text-brand-text-muted">
              Redirecting to login...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-10"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 rounded-full bg-brand-green/10 mx-auto flex items-center justify-center mb-4">
              <Lock size={24} className="text-brand-green" />
            </div>
            <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3">
              Set New Password
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2 sm:mb-3">
              Reset Your Password
            </h1>
            <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
              Enter your new password below.
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-5 bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2"
            >
              <AlertCircle
                size={16}
                className="text-red-500 shrink-0 mt-0.5"
              />
              <p className="text-xs sm:text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
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
              <p className="text-[10px] sm:text-xs text-brand-text-muted mt-1">
                Minimum 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 pr-14 sm:pr-16 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Real-time match indicator */}
              {confirmPassword && (
                <p
                  className={`text-[10px] sm:text-xs mt-1 flex items-center gap-1 ${
                    password === confirmPassword
                      ? 'text-green-600'
                      : 'text-red-500'
                  }`}
                >
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle2 size={11} /> Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle size={11} /> Passwords do not match
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-green hover:bg-black text-white font-medium py-3 sm:py-3.5 rounded-md transition-colors text-xs sm:text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating password...
                </>
              ) : (
                'Update Password'
              )}
            </motion.button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-xs sm:text-sm text-brand-text-muted mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100">
            Remember your password?{' '}
            <Link
              href="/login"
              className="text-brand-gold hover:text-brand-green transition-colors font-semibold"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-cream flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-brand-green" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}