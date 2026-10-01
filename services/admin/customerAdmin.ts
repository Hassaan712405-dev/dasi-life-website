import { createClient } from '@/lib/supabase/client';

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

  // 2. Get all orders
  const { data: orders } = await supabase
    .from('orders')
    .select('user_id, total, created_at, status')
    .not('user_id', 'is', null);

  // 3. Combine
  const customers: CustomerWithStats[] = profiles.map((profile) => {
    const userOrders = (orders || []).filter(
      (o) => o.user_id === profile.id && o.status !== 'cancelled'
    );

    const totalSpent = userOrders.reduce(
      (sum, o) => sum + Number(o.total),
      0
    );

    const lastOrder = userOrders.sort(
      (a, b) =>
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
  });

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