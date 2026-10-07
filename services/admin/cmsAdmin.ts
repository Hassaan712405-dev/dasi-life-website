
import { createClient } from '@/lib/supabase/client';

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

// ============================================
// GET ALL CMS PAGES
// ============================================
export async function getAllCMSPages(): Promise<CMSPage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('slug', { ascending: true });

  if (error) {
    console.error('Get CMS pages error:', JSON.stringify(error, null, 2));
    return [];
  }

  return (data || []) as CMSPage[];
}

// ============================================
// GET SINGLE CMS PAGE
// ============================================
export async function getCMSPage(slug: string): Promise<CMSPage | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Get CMS page error:', JSON.stringify(error, null, 2));
    return null;
  }

  return data as CMSPage;
}

// ============================================
// UPDATE CMS PAGE
// ============================================
export async function updateCMSPage(
  id: string,
  data: { title: string; content: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('pages')
    .update({
      title: data.title,
      content: data.content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Update CMS page error:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message };
  }

  return { success: true };
}