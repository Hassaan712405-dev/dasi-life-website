'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mail, X, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AuthModalProps } from '@/types/auth';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  redirectTo = '/',
  closeOnEscape = true,
  termsUrl = '/terms',
  privacyUrl = '/privacy',
}: AuthModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<'email' | 'google' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape && !loading) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, loading, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Backdrop Click Prevention
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    
    // Subtle shake effect to show it won't close
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // 1. Email Login (Custom Auto-login)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading('email');
    setError(null);

    try {
      const res = await fetch('/api/auth/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error?.message || 'Failed to login');
      }

      // Verify token_hash to create session
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: data.token_hash,
        type: 'magiclink',
      });

      if (verifyError) throw verifyError;

      // Success!
      onClose();
      router.refresh();
      if (onSuccess) onSuccess({ id: 'temp', email }); // In real app, fetch actual user
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // 2. Google Login
  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading('google');
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google login failed.');
      setLoading(null);
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const input = modalRef.current?.querySelector('input');
        if (input) input.focus();
      }, 100);
    } else {
      setEmail('');
      setError(null);
      setLoading(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ✅ FIX: 'as const' zaroori hai framer-motion v13+ ke liye
  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : ({ type: 'spring', stiffness: 300, damping: 28 } as const);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop - Click does NOT close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={handleBackdropClick}
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: shake ? [0, -8, 8, -8, 8, 0] : 0 
            }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={shake ? { duration: 0.4 } : springTransition}
            className="relative bg-white w-full max-w-[420px] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col z-10 max-h-[90dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Gradient Line */}
            <div className="h-1 w-full bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#66BB6A]" />

            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={!!loading}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Scrollable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              {/* Header */}
              <div className="text-center mb-6 mt-2">
                <div className="w-14 h-14 bg-[#1B5E20]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-[#1B5E20]" size={26} />
                </div>
                <h2 id="auth-title" className="text-2xl font-semibold text-gray-900 mb-1">
                  Welcome to Desi Life
                </h2>
                <p className="text-sm text-gray-500">
                  Sign in or create your account in seconds.
                </p>
              </div>

              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl flex items-start gap-2 overflow-hidden"
                  >
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 1. EMAIL FORM (TOP) */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={!!loading}
                      autoComplete="email"
                      inputMode="email"
                      className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/40 focus:border-[#1B5E20] transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!!loading || !email}
                  className="w-full h-12 bg-[#1B5E20] hover:bg-[#144a19] text-white font-medium rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {loading === 'email' ? <Loader2 size={18} className="animate-spin" /> : 'Continue with Email'}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={!!loading}
                  className="w-full text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors py-1 disabled:opacity-50"
                >
                  Cancel
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">
                  or continue with
                </div>
              </div>

              {/* 2. GOOGLE BUTTON (BOTTOM) */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={!!loading}
                className="w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {loading === 'google' ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </button>

              {/* Terms & Trust */}
              <div className="mt-8 text-center space-y-3">
                <p className="text-xs text-gray-500 px-4">
                  By continuing, you agree to our{' '}
                  <a href={termsUrl} className="text-gray-800 hover:underline">Terms</a> and{' '}
                  <a href={privacyUrl} className="text-gray-800 hover:underline">Privacy Policy</a>.
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <ShieldCheck size={14} />
                  <span>Secure & encrypted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}