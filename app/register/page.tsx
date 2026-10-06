'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { signUp } from '@/services/auth/authService';
import { Suspense } from 'react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';

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
  const [errorType, setErrorType] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorType('');

    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number.');
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

    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(
        email.trim(),
        password,
        fullName.trim(),
        phone.trim()
      );

      if (!result.success) {
        setError(result.error || 'Registration failed. Please try again.');
        setErrorType(result.errorType || 'unknown');
        setLoading(false);
        return;
      }

      // If email confirmation required
      if (result.needsConfirmation) {
        setSuccess(true);
        setLoading(false);
        return;
      }

      // Success — auto-login
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.href = redirectTo;
    } catch (err) {
      console.error('Register error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // Success screen (email confirmation)
  if (success) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="container-custom py-8 sm:py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-5">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-brand-green mb-3">
              Account Created!
            </h1>
            <p className="text-sm text-brand-text-muted mb-6">
              Please check your email <strong>{email}</strong> to verify your
              account, then login.
            </p>
            <Link
              href="/login"
              className="inline-block bg-brand-green hover:bg-black text-white font-medium py-3 px-8 rounded-md transition-colors text-sm"
            >
              Go to Login
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-10"
        >
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3">
              Join the Heritage
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2 sm:mb-3">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-brand-text-muted">
              Sign up to track Unani wellness purchases and get rewards.
            </p>
          </div>

          {/* ERROR — Friendly with Login Link */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 sm:mb-5 border rounded-md p-3 sm:p-4 ${
                errorType === 'already_registered'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <AlertCircle
                  size={16}
                  className={`shrink-0 mt-0.5 ${
                    errorType === 'already_registered'
                      ? 'text-amber-600'
                      : 'text-red-500'
                  }`}
                />
                <div className="flex-1">
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      errorType === 'already_registered'
                        ? 'text-amber-700'
                        : 'text-red-600'
                    }`}
                  >
                    {error}
                  </p>

                  {/* Show Login + Forgot Password links */}
                  {errorType === 'already_registered' && (
                    <div className="mt-3 pt-3 border-t border-amber-200 space-y-2">
                      <Link
                        href="/login"
                        className="block w-full text-center bg-brand-green hover:bg-black text-white font-medium py-2.5 rounded-md transition-colors text-xs sm:text-sm"
                      >
                        Login Karein →
                      </Link>
                      <Link
                        href="/forgot-password"
                        className="block text-center text-xs sm:text-sm text-amber-700 hover:text-amber-800 underline"
                      >
                        Password bhool gaye? Reset karein
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="E.g., Hamza Ahmed"
                required
                autoComplete="name"
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Email Address <span className="text-red-500">*</span>
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
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                required
                autoComplete="tel"
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
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
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 pr-14 sm:pr-16 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium text-brand-gold hover:text-brand-green transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-[10px] sm:text-xs text-brand-text-muted mt-1">
                Minimum 6 characters
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
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
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium text-brand-gold hover:text-brand-green transition-colors"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {/* Real-time password match indicator */}
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

            <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={loading}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 rounded border-gray-400 accent-brand-green cursor-pointer shrink-0"
              />
              <span className="text-[10px] sm:text-xs md:text-sm text-brand-text-muted leading-relaxed">
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

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-green hover:bg-black text-white font-medium py-3 sm:py-3.5 rounded-md transition-colors text-xs sm:text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs sm:text-sm text-brand-text-muted mt-6 sm:mt-8">
            Already have an account?{' '}
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-cream flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-brand-green" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}