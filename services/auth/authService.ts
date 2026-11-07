import { createClient } from '@/lib/supabase/client';

// ============================================
// TYPES
// ============================================
export interface AuthResult {
  success: boolean;
  error?: string;
  errorType?:
    | 'already_registered'
    | 'invalid_credentials'
    | 'email_not_confirmed'
    | 'weak_password'
    | 'network'
    | 'unknown';
  userId?: string;
  needsConfirmation?: boolean;
}

// ============================================
// SIGN UP (Customer)
// ============================================
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  phone: string
): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      const msg = error.message.toLowerCase();

      if (msg.includes('already') || msg.includes('registered')) {
        return {
          success: false,
          error: 'This email is already registered. Please login instead.',
          errorType: 'already_registered',
        };
      }

      if (msg.includes('password')) {
        return {
          success: false,
          error: 'Password is too weak. Please use at least 6 characters.',
          errorType: 'weak_password',
        };
      }

      if (msg.includes('rate limit') || msg.includes('too many')) {
        return {
          success: false,
          error: 'Too many attempts. Please try again later.',
          errorType: 'unknown',
        };
      }

      return {
        success: false,
        error: error.message,
        errorType: 'unknown',
      };
    }

    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      return {
        success: false,
        error: 'This email is already registered. Please login instead.',
        errorType: 'already_registered',
      };
    }

    const needsConfirmation = !data.session;

    return {
      success: true,
      userId: data.user?.id,
      needsConfirmation,
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'Network error. Please check your connection.',
      errorType: 'network',
    };
  }
}

// ============================================
// SIGN IN (Customer)
// ============================================
export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      const msg = error.message.toLowerCase();

      if (msg.includes('email not confirmed')) {
        return {
          success: false,
          error:
            'Please verify your email first. Check your inbox for the confirmation link.',
          errorType: 'email_not_confirmed',
        };
      }

      if (msg.includes('invalid') || msg.includes('credentials')) {
        return {
          success: false,
          error: 'Incorrect email or password. Please try again.',
          errorType: 'invalid_credentials',
        };
      }

      if (msg.includes('rate limit') || msg.includes('too many')) {
        return {
          success: false,
          error: 'Too many attempts. Please try again later.',
          errorType: 'unknown',
        };
      }

      return {
        success: false,
        error: error.message,
        errorType: 'unknown',
      };
    }

    return { success: true, userId: data.user?.id };
  } catch (err: any) {
    return {
      success: false,
      error: 'Network error. Please check your connection.',
      errorType: 'network',
    };
  }
}

// ============================================
// SIGN OUT
// ============================================
export async function signOut(): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ============================================
// GET CURRENT USER
// ============================================
export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// ============================================
// IS ADMIN
// ============================================
export async function isAdmin(): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  return !!data;
}

// ============================================
// FORGOT PASSWORD (Send Reset Email)
// ============================================
export async function forgotPassword(email: string): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/reset-password`, // ✅ Updated
      }
    );

    if (error) {
      if (
        error.message.toLowerCase().includes('rate limit') ||
        error.message.toLowerCase().includes('too many')
      ) {
        return {
          success: false,
          error: 'Too many attempts. Please try again later.',
        };
      }

      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}

// ============================================
// RESET PASSWORD (Update Password)
// ============================================
export async function resetPassword(newPassword: string): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      if (error.message.toLowerCase().includes('same password')) {
        return {
          success: false,
          error: 'New password must be different from your current password.',
        };
      }

      if (error.message.toLowerCase().includes('weak')) {
        return {
          success: false,
          error: 'Password is too weak. Please use at least 6 characters.',
        };
      }

      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}