import { createClient } from '@/lib/supabase/client';

// ============================================
// TYPES
// ============================================
export interface CustomerWithStats {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  email?: string;
  orders_count: number;
  total_spent: number;
  last_order_date: string | null;
}

// Internal types for Supabase query results
interface ProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface OrderRow {
  user_id: string | null;
  total: number | null;
  created_at: string;
  status: string;
}

// ============================================
// GET ALL CUSTOMERS WITH STATS
// ============================================
export async function getAllCustomers(): Promise<CustomerWithStats[]> {
  const supabase = createClient();

  // 1. Get all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !profiles) {
    console.error('Get customers error:', error);
    return [];
  }

  const typedProfiles: ProfileRow[] = profiles as ProfileRow[];

  // 2. Get all orders
  const { data: orders } = await supabase
    .from('orders')
    .select('user_id, total, created_at, status')
    .not('user_id', 'is', null);

  const typedOrders: OrderRow[] = (orders || []) as OrderRow[];

  // 3. Combine
  const customers: CustomerWithStats[] = typedProfiles.map(
    (profile: ProfileRow) => {
      const userOrders = typedOrders.filter(
        (o: OrderRow) =>
          o.user_id === profile.id && o.status !== 'cancelled'
      );

      const totalSpent = userOrders.reduce(
        (sum: number, o: OrderRow) => sum + Number(o.total || 0),
        0
      );

      const lastOrder = userOrders.sort(
        (a: OrderRow, b: OrderRow) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      return {
        id: profile.id,
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        orders_count: userOrders.length,
        total_spent: totalSpent,
        last_order_date: lastOrder?.created_at || null,
      };
    }
  );

  return customers;
}

// ============================================
// GET CUSTOMER ORDERS
// ============================================
export async function getCustomerOrders(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get customer orders error:', error);
    return [];
  }

  return data || [];
}