'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MailCheck, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { forgotPassword } from '@/services/auth/authService';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPassword(email.trim());

      if (!result.success) {
        setError(result.error || 'Failed to send reset email.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
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
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                  <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3">
                    Reset Password
                  </p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2 sm:mb-3">
                    Forgot Your Password?
                  </h1>
                  <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                    Enter your email address and we'll send you a link to reset
                    your password.
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
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5"
                >
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

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-brand-green hover:bg-black text-white font-medium py-3 sm:py-3.5 rounded-md transition-colors text-xs sm:text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-green/10 mb-4 sm:mb-5"
                >
                  <MailCheck size={28} className="text-brand-green" />
                </motion.div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-brand-green mb-2 sm:mb-3">
                  Check Your Email
                </h2>
                <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed mb-2">
                  We've sent a password reset link to:
                </p>
                <p className="text-xs sm:text-sm font-medium text-brand-text-dark mb-5 sm:mb-6 break-all">
                  {email}
                </p>
                <p className="text-[10px] sm:text-xs text-brand-text-muted leading-relaxed mb-5 sm:mb-6">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setError('');
                  }}
                  className="text-xs sm:text-sm text-brand-gold hover:text-brand-green transition-colors font-medium underline"
                >
                  Try a different email
                </button>
              </motion.div>
            )}
          </AnimatePresence>

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