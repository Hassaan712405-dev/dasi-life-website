import { createClient } from '@/lib/supabase/client';

// ============================================
// TYPES
// ============================================
export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postal_code: string | null;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

// ============================================
// GET PROFILE
// ============================================
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, avatar_url')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching profile:', error);
  }

  return data as Profile | null;
}

// ============================================
// UPDATE PROFILE
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
// GET ALL ADDRESSES
// ============================================
export async function getAllAddresses(userId: string): Promise<Address[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }

  return (data || []) as Address[];
}

// ============================================
// GET DEFAULT ADDRESS
// ============================================
export async function getDefaultAddress(userId: string): Promise<Address | null> {
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

  return data as Address | null;
}

// ============================================
// HELPER: Parse Supabase error
// ============================================
function parseSupabaseError(error: any): string {
  if (!error) return 'Something went wrong. Please try again.';

  // NOT NULL violation
  if (error.code === '23502') {
    const match = error.message?.match(/column "(.+?)"/);
    const column = match ? match[1] : 'required fields';
    return `Please fill in all required fields (${column}).`;
  }

  // RLS / permission denied
  if (error.code === '42501') {
    return 'Permission denied. Please make sure you are logged in.';
  }

  // Foreign key violation
  if (error.code === '23503') {
    return 'Account issue. Please log out and log in again.';
  }

  // Table not found
  if (error.code === '42P01') {
    return 'Database configuration issue. Please contact support.';
  }

  // Unique violation
  if (error.code === '23505') {
    return 'This record already exists.';
  }

  // Fallback
  return (
    error.message ||
    error.details ||
    error.hint ||
    'Something went wrong. Please try again.'
  );
}

// ============================================
// CREATE ADDRESS
// ============================================
export async function createAddress(
  userId: string,
  address: {
    full_name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postal_code?: string;
    country?: string;
    is_default?: boolean;
  }
) {
  const supabase = createClient();

  // If this is set as default, unset other defaults first
  if (address.is_default) {
    const { error: unsetError } = await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);

    if (unsetError) {
      console.error('Error unsetting defaults:', unsetError);
    }
  }

  const insertPayload = {
    user_id: userId,
    full_name: address.full_name,
    phone: address.phone,
    street: address.street,
    city: address.city,
    state: address.state,
    postal_code: address.postal_code?.trim() || '', // ✅ Empty string, not null
    country: address.country || 'Pakistan',
    is_default: address.is_default || false,
  };

  const { data, error } = await supabase
    .from('addresses')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('=== CREATE ADDRESS ERROR ===');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('============================');

    return { success: false, error: parseSupabaseError(error) };
  }

  return { success: true, data };
}

// ============================================
// UPDATE ADDRESS
// ============================================
export async function updateAddress(
  addressId: string,
  userId: string,
  updates: {
    full_name?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    is_default?: boolean;
  }
) {
  const supabase = createClient();

  // If setting as default, unset other defaults first
  if (updates.is_default) {
    const { error: unsetError } = await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId)
      .neq('id', addressId);

    if (unsetError) {
      console.error('Error unsetting defaults:', unsetError);
    }
  }

  const updatePayload = {
    ...updates,
    postal_code:
      updates.postal_code !== undefined
        ? updates.postal_code?.trim() || ''
        : undefined,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('addresses')
    .update(updatePayload)
    .eq('id', addressId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('=== UPDATE ADDRESS ERROR ===');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('============================');

    return { success: false, error: parseSupabaseError(error) };
  }

  return { success: true, data };
}

// ============================================
// DELETE ADDRESS
// ============================================
export async function deleteAddress(addressId: string, userId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting address:', error);
    return { success: false, error: parseSupabaseError(error) };
  }

  return { success: true };
}

// ============================================
// SET DEFAULT ADDRESS
// ============================================
export async function setDefaultAddress(addressId: string, userId: string) {
  const supabase = createClient();

  // Unset all defaults
  const { error: unsetError } = await supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('user_id', userId);

  if (unsetError) {
    console.error('Error unsetting defaults:', unsetError);
    return { success: false, error: parseSupabaseError(unsetError) };
  }

  // Set new default
  const { error } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', addressId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error setting default address:', error);
    return { success: false, error: parseSupabaseError(error) };
  }

  return { success: true };
}

// ============================================
// UPSERT ADDRESS (backward compatible)
// ============================================
export async function upsertAddress(
  userId: string,
  address: {
    full_name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postal_code?: string;
    country: string;
  }
) {
  const existing = await getDefaultAddress(userId);

  if (existing) {
    return updateAddress(existing.id, userId, { ...address, is_default: true });
  } else {
    return createAddress(userId, { ...address, is_default: true });
  }
}