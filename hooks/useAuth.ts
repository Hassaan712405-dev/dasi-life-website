'use client';

import { useEffect, useState, useCallback } from 'react';
import type {
  User,
  AuthChangeEvent,
  Session,
} from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    // Check if user is admin
    async function checkAdmin(userId: string | undefined) {
      if (!userId) {
        if (mounted) setIsAdmin(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (mounted) setIsAdmin(!!data);
      } catch {
        if (mounted) setIsAdmin(false);
      }
    }

    // Get initial session
    async function getInitialSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          setUser(session?.user ?? null);
          await checkAdmin(session?.user?.id);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    }

    getInitialSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
        await checkAdmin(session?.user?.id);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin,
    refresh,
  };
}