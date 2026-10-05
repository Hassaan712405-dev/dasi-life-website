import { createClient } from '@/lib/supabase/client';

// ============================================
// GET PROFILE (naam, phone, avatar)
// ============================================
export async function getProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, avatar_url')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found (naya user)
    console.error('Error fetching profile:', error);
  }

  return data;
}

// ============================================
// UPDATE PROFILE (naam, phone)
// ============================================
export async function updateProfile(
  userId: string,
  updates: { full_name?: string; phone?: string }
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

// ============================================
// GET DEFAULT ADDRESS
// ============================================
export async function getDefaultAddress(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching address:', error);
  }

  return data;
}

// ============================================
// UPSERT ADDRESS (save ya update)
// ============================================
export async function upsertAddress(
  userId: string,
  address: {
    full_name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  }
) {
  const supabase = createClient();

  const existing = await getDefaultAddress(userId);

  if (existing) {
    const { data, error } = await supabase
      .from('addresses')
      .update({
        ...address,
        is_default: true,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating address:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } else {
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        ...address,
        is_default: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating address:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  }
}