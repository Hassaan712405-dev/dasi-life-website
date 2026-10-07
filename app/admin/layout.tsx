'use client';

import NotificationDropdown from '@/components/admin/NotificationDropdown';
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
  Menu,
  X,
  Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getSiteSettings } from '@/services/settings/settingsService';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'CMS Pages', href: '/admin/cms', icon: FileText },
  { name: 'Contact Messages', href: '/admin/contact-messages', icon: Mail },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [adminInitials, setAdminInitials] = useState('AD');
  const [storeLocation, setStoreLocation] = useState('Pakistan');
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    reviews: 0,
    messages: 0,
  });

  // ✅ Load admin name from user + store location from settings
  useEffect(() => {
    async function loadAdminInfo() {
      if (!user) return;

      // Admin name from email
      const email = user.email || '';
      const namePart = email.split('@')[0];
      const displayName = namePart
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      setAdminName(displayName || 'Admin');

      // Initials
      const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      setAdminInitials(initials || 'AD');

      // Store location from settings
      const settings = await getSiteSettings();
      if (settings?.store_address) {
        setStoreLocation(settings.store_address);
      }
    }

    if (user) loadAdminInfo();
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Check admin
  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      if (authLoading) return;

      if (!user) {
        if (mounted) router.replace('/admin-login');
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

  // Load counts
  useEffect(() => {
    async function loadCounts() {
      if (!isAdmin) return;
      const supabase = createClient();
      try {
        const [
          productsRes,
          ordersRes,
          customersRes,
          reviewsRes,
          messagesRes,
        ] = await Promise.all([
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
          supabase
            .from('contact_messages')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'new'),
        ]);

        setCounts({
          products: productsRes.count || 0,
          orders: ordersRes.count || 0,
          customers: customersRes.count || 0,
          reviews: reviewsRes.count || 0,
          messages: messagesRes.count || 0,
        });
      } catch (err) {
        console.error('Load counts error:', err);
      }
    }

    if (isAdmin) loadCounts();
  }, [isAdmin]);

  // Refresh on route change
  useEffect(() => {
    if (!isAdmin) return;

    async function refreshCounts() {
      const supabase = createClient();
      try {
        const [
          productsRes,
          ordersRes,
          customersRes,
          reviewsRes,
          messagesRes,
        ] = await Promise.all([
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
          supabase
            .from('contact_messages')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'new'),
        ]);

        setCounts({
          products: productsRes.count || 0,
          orders: ordersRes.count || 0,
          customers: customersRes.count || 0,
          reviews: reviewsRes.count || 0,
          messages: messagesRes.count || 0,
        });
      } catch (err) {
        console.error('Refresh counts error:', err);
      }
    }
    refreshCounts();
  }, [pathname, isAdmin]);

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
      case 'Contact Messages':
        return counts.messages;
      default:
        return null;
    }
  };

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-brand-green mx-auto mb-3"
          />
          <p className="text-xs sm:text-sm text-brand-text-muted">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-5">
            <Lock size={28} className="text-red-500" />
          </div>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-brand-green mb-3">
            Access Denied
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted mb-6">
            You don't have permission to access the admin panel.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="bg-brand-green hover:bg-black text-white font-medium py-3 px-6 rounded-md transition-colors flex-1 text-center text-xs sm:text-sm"
            >
              Go to Homepage
            </Link>
            <Link
              href="/admin-login"
              className="bg-white border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white font-medium py-3 px-6 rounded-md transition-colors flex-1 text-center text-xs sm:text-sm"
            >
              Admin Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-[60] w-10 h-10 rounded-md bg-[#1F4A2C] text-white flex items-center justify-center shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-[55]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(mobileOpen ||
          (typeof window !== 'undefined' &&
            window.innerWidth >= 1024)) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#1F4A2C] text-white flex-shrink-0 flex flex-col z-[58] lg:z-30 lg:translate-x-0 ${
              mobileOpen
                ? 'translate-x-0'
                : '-translate-x-full lg:translate-x-0'
            }`}
          >
            {/* Logo */}
            <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2">
                <Leaf size={22} className="text-brand-gold" />
                <div>
                  <p className="font-heading font-bold text-base sm:text-lg leading-none">
                    DESÍ<span className="text-brand-gold">LIFE</span>
                  </p>
                  <p className="text-[10px] tracking-widest text-white/60 uppercase mt-0.5">
                    Admin Console
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="lg:hidden w-8 h-8 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto">
              <ul className="space-y-1">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  const badge = getBadgeCount(item.name);

                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.04,
                      }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs sm:text-sm transition-colors ${
                          isActive
                            ? 'bg-white/10 text-white font-medium'
                            : 'text-white/75 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon size={16} className="shrink-0" />
                        <span className="flex-1">{item.name}</span>
                        {badge !== null && badge > 0 && (
                          <span
                            className={`text-[10px] font-semibold rounded-full px-2 py-0.5 min-w-[22px] text-center ${
                              item.name === 'Contact Messages'
                                ? 'bg-brand-gold text-white'
                                : 'bg-white/15 text-white'
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Admin Profile — ✅ DYNAMIC */}
            <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {adminInitials}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">
                  {adminName}
                </p>
                <p className="text-[10px] sm:text-xs text-white/60 truncate">
                  Super Admin
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex-1 min-w-0 lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 lg:pl-6 pl-14">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h1 className="font-heading font-bold text-base sm:text-lg md:text-xl text-brand-text-dark truncate">
              Dasi Life Apothecary
            </h1>
            <span className="bg-brand-green/10 text-brand-green text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0">
              LIVE
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <NotificationDropdown key={pathname} />
            {/* ✅ DYNAMIC LOCATION */}
            <span className="text-xs sm:text-sm text-brand-text-muted hidden sm:inline truncate max-w-[120px]">
              {storeLocation}
            </span>
          </div>
        </header>

        <main className="p-3 sm:p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}