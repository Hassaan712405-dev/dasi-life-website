'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  Settings,
  FileText,
  Image as ImageIcon,
  Mail,
  Tags,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
} from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Hero Posters', href: '/admin/hero-posters', icon: ImageIcon },
  { name: 'CMS', href: '/admin/cms', icon: FileText },
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
  const supabase = createClient();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      setUser(authUser);
      setLoading(false);
    }
    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin-login');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel min-h-screen bg-gray-50">
      {/* ============================================ */}
      {/* TOP BAR (Mobile) */}
      {/* ============================================ */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-gray-700" />
        </button>

        <Link href="/admin" className="flex items-center gap-2">
          <div className="relative h-8 w-24">
            <Image
              src="/images/logo.png"
              alt="Dasi Life"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        <button
          className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-gray-700" />
        </button>
      </header>

      <div className="flex">
        {/* ============================================ */}
        {/* SIDEBAR (Desktop) */}
        {/* ============================================ */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0 h-screen">
          {/* Logo */}
          <div className="h-16 px-4 border-b border-gray-200 flex items-center gap-2">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="relative h-9 w-28">
                <Image
                  src="/images/logo.png"
                  alt="Dasi Life"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <span className="text-xs font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded">
                ADMIN
              </span>
            </Link>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {MENU_ITEMS.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                        active
                          ? 'bg-brand-green text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:!text-brand-green'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User + Logout */}
          <div className="border-t border-gray-200 p-3">
            {user && (
              <div className="mb-2 px-2 py-2 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-xs font-medium text-gray-900 truncate">
                  {user.email}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 bg-red-50 hover:bg-red-600 hover:!text-white transition-colors duration-200"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        {/* ============================================ */}
        {/* MAIN CONTENT */}
        {/* ============================================ */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* ============================================ */}
      {/* SIDEBAR (Mobile Drawer) */}
      {/* ============================================ */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col lg:hidden"
            >
              {/* Header */}
              <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2">
                  <div className="relative h-8 w-24">
                    <Image
                      src="/images/logo.png"
                      alt="Dasi Life"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X size={20} className="text-gray-700" />
                </button>
              </div>

              {/* Menu */}
              <nav className="flex-1 overflow-y-auto py-4 px-2">
                <ul className="space-y-1">
                  {MENU_ITEMS.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                            active
                              ? 'bg-brand-green text-white'
                              : 'text-gray-700 hover:bg-gray-100 hover:!text-brand-green'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon size={18} />
                            {item.name}
                          </span>
                          <ChevronRight size={14} className="opacity-40" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Logout */}
              <div className="border-t border-gray-200 p-3">
                {user && (
                  <div className="mb-2 px-2 py-2 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {user.email}
                    </p>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 bg-red-50 hover:bg-red-600 hover:!text-white transition-colors duration-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}