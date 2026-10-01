'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Baad mein Supabase resetPasswordForEmail se connect karenge
    setSubmitted(true);
  };

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-10">
          
          {!submitted ? (
            <>
              {/* Heading */}
              <div className="text-center mb-8">
                <p className="text-brand-gold font-semibold text-xs tracking-widest uppercase mb-3">
                  Reset Password
                </p>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-3">
                  Forgot Your Password?
                </h1>
                <p className="text-sm text-brand-text-muted leading-relaxed">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 text-base"
                >
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-green/10 mb-5">
                <MailCheck size={32} className="text-brand-green" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-green mb-3">
                Check Your Email
              </h2>
              <p className="text-sm text-brand-text-muted leading-relaxed mb-2">
                We've sent a password reset link to:
              </p>
              <p className="text-sm font-medium text-brand-text-dark mb-6 break-all">
                {email}
              </p>
              <p className="text-xs text-brand-text-muted leading-relaxed mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-sm text-brand-gold hover:text-brand-green transition-colors font-medium underline"
              >
                Try a different email
              </button>
            </div>
          )}

          {/* Sign In Link */}
          <p className="text-center text-sm text-brand-text-muted mt-8 pt-6 border-t border-gray-100">
            Remember your password?{' '}
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