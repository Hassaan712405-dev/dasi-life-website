'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Loader2, AlertCircle, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ If already logged in as admin, redirect to /admin
  useEffect(() => {
    async function checkAlreadyLoggedIn() {
      if (authLoading || !user) return;

      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', user.id)
          .single();

        if (data) {
          router.replace('/admin');
        }
      } catch {
        // ignore
      }
    }
    checkAlreadyLoggedIn();
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();

    try {
      // 1. Sign in with email/password
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (authError || !authData.user) {
        // ✅ Better error messages
        const msg = authError?.message?.toLowerCase() || '';

        if (msg.includes('email not confirmed')) {
          setError('Please verify your email first. Check your inbox.');
        } else if (msg.includes('invalid')) {
          setError('Invalid email or password.');
        } else {
          setError(authError?.message || 'Invalid email or password.');
        }

        setLoading(false);
        return;
      }

      // 2. ✅ Check admin_users table (SIRF YAHAN ADMIN CHECK)
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (adminError || !adminData) {
        // ❌ Not an admin — sign out immediately
        await supabase.auth.signOut();
        setError(
          'This account does not have admin access. Please contact the administrator.'
        );
        setLoading(false);
        return;
      }

      // 3. ✅ Admin confirmed — redirect
      router.replace('/admin');
      router.refresh();
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F4A2C] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center">
              <Leaf size={24} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="font-heading font-bold text-3xl text-white mb-1">
            DESÍ<span className="text-brand-gold">LIFE</span>
          </h1>
          <p className="text-xs tracking-widest text-white/60 uppercase">
            Admin Console
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-8">
          {/* Heading */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-green/10 mx-auto flex items-center justify-center mb-3">
              <Lock size={22} className="text-brand-green" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-brand-green mb-2">
              Admin Sign In
            </h2>
            <p className="text-sm text-brand-text-muted">
              Only authorized administrators can access this area.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
              <AlertCircle
                size={16}
                className="text-red-500 shrink-0 mt-0.5"
              />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dasilife.store"
                required
                disabled={loading}
                autoComplete="email"
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
                  autoComplete="current-password"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-black text-white font-medium py-3 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verifying admin access...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Sign In to Admin
                </>
              )}
            </button>
          </form>

          {/* Customer Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-brand-text-muted mb-2">
              Not an admin?
            </p>
            <Link
              href="/login"
              className="text-sm text-brand-gold hover:text-brand-green transition-colors font-medium"
            >
              Customer Login →
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-white/50 mt-6">
          Authorized personnel only. All login attempts are logged.
        </p>
      </div>
    </div>
  );
}