'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function revalidateHeroHome(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Verify admin
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated.' };
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!adminData) {
      return { success: false, error: 'Not authorized.' };
    }

    // Revalidate homepage + admin page
    revalidatePath('/');
    revalidatePath('/admin/hero-posters');

    return { success: true };
  } catch (e: any) {
    console.error('[revalidateHeroHome] error:', e);
    return { success: false, error: e?.message ?? 'Revalidation failed.' };
  }
}