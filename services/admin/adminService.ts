import { createClient } from '@/lib/supabase/client';

// ============================================
// TYPES
// ============================================
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  activeProducts: number;
  revenueChange: number;
  ordersChange: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  status: 'Critical' | 'Low Stock' | 'Healthy';
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

// Internal types for reduce/map operations
interface OrderRow {
  total: number | null;
  status: string;
  created_at: string;
}

interface ProductStockRow {
  id: string;
  name: string;
  stock: number | null;
}

// ============================================
// GET DASHBOARD STATS
// ============================================
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  // Get all orders
  const { data: orders } = await supabase
    .from('orders')
    .select('total, status, created_at');

  // Get customers count
  const { count: customersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Get products count
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Cast orders to typed array
  const typedOrders: OrderRow[] = (orders || []) as OrderRow[];

  // Calculate revenue (exclude cancelled)
  const validOrders = typedOrders.filter(
    (o: OrderRow) => o.status !== 'cancelled'
  );
  const totalRevenue = validOrders.reduce(
    (sum: number, o: OrderRow) => sum + Number(o.total || 0),
    0
  );
  const totalOrders = typedOrders.length;

  // Calculate last month change
  const thisMonth = new Date();
  const lastMonth = new Date(
    thisMonth.getFullYear(),
    thisMonth.getMonth() - 1,
    1
  );

  const thisMonthOrders = validOrders.filter(
    (o: OrderRow) =>
      new Date(o.created_at) >=
      new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1)
  );

  const lastMonthOrders = validOrders.filter((o: OrderRow) => {
    const d = new Date(o.created_at);
    return (
      d >= lastMonth &&
      d < new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1)
    );
  });

  const thisMonthRevenue = thisMonthOrders.reduce(
    (sum: number, o: OrderRow) => sum + Number(o.total || 0),
    0
  );
  const lastMonthRevenue = lastMonthOrders.reduce(
    (sum: number, o: OrderRow) => sum + Number(o.total || 0),
    0
  );

  const revenueChange =
    lastMonthRevenue > 0
      ? Math.round(
          ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 1000
        ) / 10
      : 0;

  const ordersChange =
    lastMonthOrders.length > 0
      ? Math.round(
          ((thisMonthOrders.length - lastMonthOrders.length) /
            lastMonthOrders.length) *
            1000
        ) / 10
      : 0;

  return {
    totalRevenue,
    totalOrders,
    totalCustomers: customersCount || 0,
    activeProducts: productsCount || 0,
    revenueChange,
    ordersChange,
  };
}

// ============================================
// GET RECENT ORDERS
// ============================================
export async function getRecentOrders(limit = 5): Promise<RecentOrder[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, total, status, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Get recent orders error:', error);
    return [];
  }

  return (data || []) as RecentOrder[];
}

// ============================================
// GET LOW STOCK PRODUCTS
// ============================================
export async function getLowStockProducts(): Promise<LowStockProduct[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select('id, name, stock')
    .eq('is_active', true)
    .order('stock', { ascending: true })
    .limit(5);

  if (error || !data) {
    console.error('Get low stock error:', error);
    return [];
  }

  const typedProducts: ProductStockRow[] = data as ProductStockRow[];

  return typedProducts.map((p: ProductStockRow) => {
    const stock = p.stock || 0;
    const minStock = 20;
    let status: 'Critical' | 'Low Stock' | 'Healthy' = 'Healthy';
    if (stock < 10) status = 'Critical';
    else if (stock < minStock) status = 'Low Stock';

    return {
      id: p.id,
      name: p.name,
      stock,
      minStock,
      status,
    };
  });
}

// ============================================
// GET MONTHLY REVENUE (Last 6 months)
// ============================================
export async function getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
  const supabase = createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('total, created_at, status')
    .neq('status', 'cancelled')
    .order('created_at', { ascending: true });

  if (!orders) return [];

  const typedOrders: OrderRow[] = orders as OrderRow[];

  // Last 6 months
  const months: MonthlyRevenue[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleString('en-US', { month: 'short' });
    const start = d;
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    const monthOrders = typedOrders.filter((o: OrderRow) => {
      const orderDate = new Date(o.created_at);
      return orderDate >= start && orderDate <= end;
    });

    const revenue = monthOrders.reduce(
      (sum: number, o: OrderRow) => sum + Number(o.total || 0),
      0
    );

    months.push({ month: monthName, revenue });
  }

  return months;
}