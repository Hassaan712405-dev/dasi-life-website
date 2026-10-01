'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    <aside className="bg-brand-cream rounded-2xl border border-gray-200 p-6 h-fit sticky top-24">
      {/* Profile */}
      <div className="text-center mb-6 pb-6 border-b border-gray-200">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-brand-green text-white flex items-center justify-center font-heading font-bold text-2xl mx-auto mb-3">
            {userInitials}
          </div>
        )}
        <h3 className="font-heading font-semibold text-base text-brand-green mb-1">
          {userName}
        </h3>
        {userEmail && (
          <p className="text-xs text-brand-text-muted truncate mb-1">
            {userEmail}
          </p>
        )}
        <p className="text-xs text-brand-text-muted">Joined {joinedDate}</p>
      </div>

      {/* Menu */}
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-green text-white font-medium'
                      : 'text-brand-text-dark hover:bg-brand-green/10 hover:text-brand-green'
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}