'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import LoginPanel from '@/components/auth/LoginPanel';
import Link from 'next/link';

export default function AccountMenu() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sync Auth State
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <div className="relative">
      {/* Account Icon Button */}
      <button 
        onClick={() => user ? setIsDropdownOpen(!isDropdownOpen) : setIsLoginOpen(true)}
        className="flex items-center justify-center w-10 h-10 hover:bg-[#1B5E20]/10 rounded-full transition-colors"
      >
        <User size={20} className="text-[#1A1A1A]" />
      </button>

      {/* Logged-in Dropdown (Closes on outside click naturally) */}
      {user && isDropdownOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-gray-100 bg-[#FDFBF7]">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
            <div className="py-1">
              <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <Package size={15} /> My Orders
              </Link>
            </div>
            <div className="border-t border-gray-100 py-1">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Login Panel */}
      <LoginPanel 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => {
          setIsLoginOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}