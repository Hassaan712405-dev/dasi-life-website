'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mail, Loader2, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { LoginPanelProps } from '@/types/auth';
import { emailSchema } from '@/lib/validators/auth';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPanel({ isOpen, onClose, onSuccess }: LoginPanelProps) {
  const supabase = createClient();
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<'email' | 'google' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setError(null);
      setLoading(null);
    }
  }, [isOpen]);

  // ✅ PERSISTENT PANEL LOGIC: Backdrop click does NOT close.
  // Instead, it triggers a subtle shake to let the user know the panel is intentionally staying open.
  const handleOutsideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Zod Validation
  const validateEmail = () => {
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      // ✅ Zod v4 fix: 'errors' nahi, 'issues' use karein
      setError(result.error.issues[0].message);
      return false;
    }
    return true;
  };

  // Handle Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validateEmail()) return;

    setLoading('email');
    setError(null);

    try {
      const res = await fetch('/api/auth/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error?.message || 'Login failed');

      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: data.token_hash,
        type: 'magiclink',
      });

      if (verifyError) throw verifyError;

      onSuccess({ id: 'temp', email, isNewUser: true });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading('google');
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // ✅ Forces Google to show the account chooser (active accounts on phone)
          queryParams: { prompt: 'select_account' },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google login failed.');
      setLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* 
            BACKDROP 
            Note: We intentionally do NOT attach an onClose handler here to prevent accidental closures.
          */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleOutsideClick}
          />

          {/* MODAL CONTAINER */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: shake ? [0, -6, 6, -6, 6, 0] : 0 // ✅ Shake animation
            }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={
              shake
                ? { duration: 0.4 }
                : ({ type: 'spring', stiffness: 300, damping: 28 } as const)
            }
            className="relative bg-white w-full max-w-[380px] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
            onClick={(e) => e.stopPropagation()} // Prevent click from propagating
          >
            {/* Top Gradient Accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#66BB6A]" />

            <div className="p-6 sm:p-8">
              {/* Heading */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Login</h2>
                <p className="text-sm text-gray-500">Welcome to Desi Life</p>
              </div>

              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-start gap-2 overflow-hidden"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {/* 1. Email Input */}
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    disabled={!!loading}
                    className="w-full h-12 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/40 focus:border-[#1B5E20] transition-all disabled:opacity-60"
                  />
                </div>

                {/* 2. Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={!!loading}
                  className="w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-60"
                >
                  {loading === 'google' ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />}
                  Continue with Google
                </button>

                {/* 3. Login Button */}
                <button
                  type="button"
                  onClick={handleEmailLogin}
                  disabled={!!loading || !email}
                  className="w-full h-12 bg-[#1B5E20] hover:bg-[#144a19] text-white font-medium rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center"
                >
                  {loading === 'email' ? <Loader2 size={18} className="animate-spin" /> : 'Login'}
                </button>

                {/* 4. Cancel Button (The ONLY way to close) */}
                <button
                  type="button"
                  onClick={onClose}
                  disabled={!!loading}
                  className="w-full h-12 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>

              {/* Trust Text */}
              <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <ShieldCheck size={14} />
                <span>Secure & encrypted</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}