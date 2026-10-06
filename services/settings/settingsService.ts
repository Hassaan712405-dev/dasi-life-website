import { createClient } from '@/lib/supabase/client';

// ============================================
// TYPES
// ============================================
export interface SiteSettings {
  store_name: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  shipping_enabled: boolean;
  free_shipping_threshold: number;
  shipping_fee: number;
  facebook_url: string;
  instagram_url: string;
  whatsapp_number: string;
  support_hours_weekday: string;
  support_hours_weekend: string;
  response_time: string;
}

// Internal type for Supabase query result
interface SettingRow {
  key: string;
  value: string;
}

// Default fallback values
const DEFAULTS: SiteSettings = {
  store_name: 'Dasi Life',
  store_email: 'dasilife@gmail.com',
  store_phone: '03422544495',
  store_address: 'Rehman Town Mailsi',
  shipping_enabled: true,
  free_shipping_threshold: 3000,
  shipping_fee: 200,
  facebook_url: 'https://facebook.com/dasilife',
  instagram_url: 'https://instagram.com/dasilife',
  whatsapp_number: '923422544495',
  support_hours_weekday: 'Mon–Sat, 9:00 AM – 8:00 PM',
  support_hours_weekend: 'Sunday, Closed',
  response_time: 'We reply to all messages within 24 hours.',
};

// ============================================
// GET SITE SETTINGS
// ============================================
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error || !data) {
    console.error('Get settings error:', JSON.stringify(error, null, 2));
    return DEFAULTS;
  }

  const typedRows: SettingRow[] = data as SettingRow[];

  const settings: Record<string, string> = {};
  typedRows.forEach((row: SettingRow) => {
    settings[row.key] = row.value;
  });

  return {
    store_name: settings.store_name || DEFAULTS.store_name,
    store_email: settings.store_email || DEFAULTS.store_email,
    store_phone: settings.store_phone || DEFAULTS.store_phone,
    store_address: settings.store_address || DEFAULTS.store_address,
    shipping_enabled:
      settings.shipping_enabled !== undefined
        ? settings.shipping_enabled === 'true'
        : DEFAULTS.shipping_enabled,
    free_shipping_threshold:
      Number(settings.free_shipping_threshold) ||
      DEFAULTS.free_shipping_threshold,
    shipping_fee: Number(settings.shipping_fee) || DEFAULTS.shipping_fee,
    facebook_url: settings.facebook_url || DEFAULTS.facebook_url,
    instagram_url: settings.instagram_url || DEFAULTS.instagram_url,
    whatsapp_number: settings.whatsapp_number || DEFAULTS.whatsapp_number,
    support_hours_weekday:
      settings.support_hours_weekday || DEFAULTS.support_hours_weekday,
    support_hours_weekend:
      settings.support_hours_weekend || DEFAULTS.support_hours_weekend,
    response_time: settings.response_time || DEFAULTS.response_time,
  };
}

// ============================================
// UPDATE SITE SETTINGS
// ============================================
export async function updateSiteSettings(
  updates: Partial<SiteSettings>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const rows = Object.entries(updates).map(
    ([key, value]: [string, any]) => ({
      key,
      value: String(value),
    })
  );

  const { error } = await supabase
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' });

  if (error) {
    console.error('Update settings error:', JSON.stringify(error, null, 2));
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// CALCULATE SHIPPING FEE
// ============================================
export function calculateShippingFee(
  subtotal: number,
  settings: SiteSettings
): number {
  // Agar shipping disabled hai → hamesha FREE
  if (!settings.shipping_enabled) return 0;
  // Cart empty → 0
  if (subtotal === 0) return 0;
  // Threshold se upar → FREE
  if (subtotal >= settings.free_shipping_threshold) return 0;
  // Warna shipping fee charge
  return settings.shipping_fee;
}