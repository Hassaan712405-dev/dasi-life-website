'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  FolderTree,
  FileText,
  Settings,
  Bell,
  Leaf,
  Loader2,
  Lock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'CMS Pages', href: '/admin/cms', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    reviews: 0,
  });

  // Check if user is admin
  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      if (authLoading) return;

      if (!user) {
        if (mounted) {
          router.replace('/admin-login');
        }
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!mounted) return;

        if (error || !data) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Admin check error:', err);
        if (mounted) setIsAdmin(false);
      } finally {
        if (mounted) setChecking(false);
      }
    }

    checkAdmin();

    return () => {
      mounted = false;
    };
  }, [user, authLoading, router]);

  // Load badge counts
  useEffect(() => {
    async function loadCounts() {
      if (!isAdmin) return;

      const supabase = createClient();

      try {
        const [productsRes, ordersRes, customersRes, reviewsRes] =
          await Promise.all([
            supabase
              .from('products')
              .select('*', { count: 'exact', head: true }),
            supabase
              .from('orders')
              .select('*', { count: 'exact', head: true }),
            supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true }),
            supabase
              .from('reviews')
              .select('*', { count: 'exact', head: true }),
          ]);

        setCounts({
          products: productsRes.count || 0,
          orders: ordersRes.count || 0,
          customers: customersRes.count || 0,
          reviews: reviewsRes.count || 0,
        });
      } catch (err) {
        console.error('Load counts error:', err);
      }
    }

    if (isAdmin) loadCounts();
  }, [isAdmin]);

  // Refresh counts when pathname changes
  useEffect(() => {
    if (!isAdmin) return;

    async function refreshCounts() {
      const supabase = createClient();

      try {
        const [productsRes, ordersRes, customersRes, reviewsRes] =
          await Promise.all([
            supabase
              .from('products')
              .select('*', { count: 'exact', head: true }),
            supabase
              .from('orders')
              .select('*', { count: 'exact', head: true }),
            supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true }),
            supabase
              .from('reviews')
              .select('*', { count: 'exact', head: true }),
          ]);

        setCounts({
          products: productsRes.count || 0,
          orders: ordersRes.count || 0,
          customers: customersRes.count || 0,
          reviews: reviewsRes.count || 0,
        });
      } catch (err) {
        console.error('Refresh counts error:', err);
      }
    }

    refreshCounts();
  }, [pathname, isAdmin]);

  // Get badge count
  const getBadgeCount = (name: string): number | null => {
    switch (name) {
      case 'Products':
        return counts.products;
      case 'Orders':
        return counts.orders;
      case 'Customers':
        return counts.customers;
      case 'Reviews':
        return counts.reviews;
      default:
        return null;
    }
  };

  // Loading state
  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-brand-green mx-auto mb-3"
          />
          <p className="text-sm text-brand-text-muted">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not admin → Access Denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-5">
            <Lock size={28} className="text-red-500" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-brand-green mb-3">
            Access Denied
          </h1>
          <p className="text-sm text-brand-text-muted mb-6">
            You don't have permission to access the admin panel. Only
            authorized administrators can view this area.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="btn-primary flex-1 py-3">
              Go to Homepage
            </Link>
            <Link href="/admin-login" className="btn-secondary flex-1 py-3">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin → Show panel
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F4A2C] text-white flex-shrink-0 flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <Leaf size={22} className="text-brand-gold" />
            <div>
              <p className="font-heading font-bold text-lg leading-none">
                DESÍ<span className="text-brand-gold">LIFE</span>
              </p>
              <p className="text-[10px] tracking-widest text-white/60 uppercase mt-0.5">
                Admin Console
              </p>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const badge = getBadgeCount(item.name);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-white/75 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {badge !== null && badge > 0 && (
                      <span className="bg-white/15 text-white text-xs font-semibold rounded-full px-2 py-0.5 min-w-[24px] text-center">
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Admin Profile */}
        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-white font-semibold text-sm shrink-0">
            HD
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">Hassaan Developer</p>
            <p className="text-xs text-white/60 truncate">Super Admin</p>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text-xl text-brand-text-dark">
              Dasi Life Apothecary
            </h1>
            <span className="bg-brand-green/10 text-brand-green text-xs font-semibold px-2.5 py-1 rounded-full">
              LIVE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <Bell size={18} className="text-brand-text-dark" />
            </button>
            <span className="text-sm text-brand-text-muted hidden sm:inline">
              Lahore, PK
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}