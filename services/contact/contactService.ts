import { createClient } from '@/lib/supabase/client';
import { createPublicClient } from '@/lib/supabase/public';

// ============================================
// TYPES
// ============================================
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

// ============================================
// SUBMIT CONTACT MESSAGE (public — koi bhi bhej sakta hai)
// ============================================
export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createPublicClient();

  const { error } = await supabase.from('contact_messages').insert({
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim() || null,
    subject: data.subject?.trim() || null,
    message: data.message.trim(),
  });

  if (error) {
    console.error('Contact submit error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// GET ALL MESSAGES (admin only)
// ============================================
export async function getAllContactMessages(): Promise<ContactMessage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get messages error:', error);
    return [];
  }

  return data as ContactMessage[];
}

// ============================================
// UPDATE MESSAGE STATUS (admin only)
// ============================================
export async function updateMessageStatus(
  id: string,
  status: ContactMessage['status']
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('contact_messages')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// DELETE MESSAGE (admin only)
// ============================================
export async function deleteContactMessage(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// GET UNREAD COUNT (admin badge ke liye)
// ============================================
export async function getUnreadCount(): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  if (error) {
    console.error('Unread count error:', error);
    return 0;
  }

  return count || 0;
}