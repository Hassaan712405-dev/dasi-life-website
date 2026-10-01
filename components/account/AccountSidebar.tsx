'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/account', icon: LayoutDashboard },
  { name: 'Orders', href: '/account/orders', icon: Package },
  { name: 'Wishlist', href: '/wishlist', icon: Heart },
  { name: 'Addresses', href: '/account/addresses', icon: MapPin },
  { name: 'Settings', href: '/account/profile', icon: Settings },
  { name: 'Logout', href: '/logout', icon: LogOut },
];

interface AccountSidebarProps {
  userName: string;
  userInitials: string;
  userEmail?: string;
  joinedDate: string;
  avatarUrl?: string;
}

export default function AccountSidebar({
  userName,
  userInitials,
  userEmail,
  joinedDate,
  avatarUrl,
}: AccountSidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-brand-cream rounded-2xl border border-gray-200 p-4 sm:p-6 h-fit lg:sticky lg:top-24"
    >
      {/* Profile */}
      <div className="text-center mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-gray-200">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 object-cover"
          />
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-green text-white flex items-center justify-center font-heading font-bold text-xl sm:text-2xl mx-auto mb-3"
          >
            {userInitials}
          </motion.div>
        )}
        <h3 className="font-heading font-semibold text-sm sm:text-base text-brand-green mb-1">
          {userName}
        </h3>
        {userEmail && (
          <p className="text-[10px] sm:text-xs text-brand-text-muted truncate mb-1">
            {userEmail}
          </p>
        )}
        <p className="text-[10px] sm:text-xs text-brand-text-muted">
          Joined {joinedDate}
        </p>
      </div>

      {/* Menu */}
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-green text-white font-medium'
                      : 'text-brand-text-dark hover:bg-brand-green/10 hover:text-brand-green'
                  }`}
                >
                  <Icon size={14} className="shrink-0 sm:hidden" />
                  <Icon size={16} className="shrink-0 hidden sm:block" />
                  <span>{item.name}</span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
}