'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('Muhammad Ibrahim');
  const [email, setEmail] = useState('ibrahim@example.com');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [profileSaved, setProfileSaved] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'U';
  const displayName = user?.email?.split('@')[0] || 'User';

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          <AccountSidebar
            userName={displayName}
            userInitials={userInitials}
            userEmail={user?.email}
            joinedDate="Jan 2026"
          />

          <div className="space-y-5 sm:space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3">
                Account Settings
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2 sm:mb-3">
                Account Details
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-brand-text-muted leading-relaxed">
                Update your personal information and password.
              </p>
            </motion.div>

            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8"
            >
              <h2 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-4 sm:mb-6">
                Profile Information
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-3 sm:space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    className="bg-brand-green hover:bg-black text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-md transition-colors text-xs sm:text-sm"
                  >
                    Save Changes
                  </motion.button>
                  {profileSaved && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs sm:text-sm text-brand-green font-medium"
                    >
                      ✓ Profile updated!
                    </motion.span>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Change Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8"
            >
              <h2 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-4 sm:mb-6">
                Change Password
              </h2>

              <form onSubmit={handlePasswordSubmit} className="space-y-3 sm:space-y-5">
                {[
                  { label: 'Current Password', show: showCurrent, setShow: setShowCurrent },
                  { label: 'New Password', show: showNew, setShow: setShowNew },
                  { label: 'Confirm New Password', show: showConfirm, setShow: setShowConfirm },
                ].map((field, index) => (
                  <div key={index}>
                    <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type={field.show ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                      />
                      <button
                        type="button"
                        onClick={() => field.setShow(!field.show)}
                        className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green transition-colors"
                      >
                        {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-3 pt-2">
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    className="bg-brand-green hover:bg-black text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-md transition-colors text-xs sm:text-sm"
                  >
                    Update Password
                  </motion.button>
                  {passwordSaved && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs sm:text-sm text-brand-green font-medium"
                    >
                      ✓ Password updated!
                    </motion.span>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}