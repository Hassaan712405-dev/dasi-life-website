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
// SIGN UP
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

      return {
        success: false,
        error: error.message,
        errorType: 'unknown',
      };
    }

    // Supabase returns empty identities when email already exists
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

    // needsConfirmation = true if no session (email verification required)
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
// SIGN IN
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
// RESET PASSWORD
// ============================================
export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/account/profile`,
      }
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}