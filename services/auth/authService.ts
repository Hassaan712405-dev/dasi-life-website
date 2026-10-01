import { createClient } from '@/lib/supabase/client';

// ============================================
// AUTH FUNCTIONS
// ============================================

export interface AuthResult {
  success: boolean;
  error?: string;
  userId?: string;
}

// Sign Up
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  phone: string
): Promise<AuthResult> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, userId: data.user?.id };
}

// Sign In
export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, userId: data.user?.id };
}

// Sign Out
export async function signOut(): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Get current user
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Reset password (forgot password)
export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/account/profile`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}