'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AccountSidebar from '@/components/account/AccountSidebar';

export default function ProfilePage() {
  // Profile form state
  const [fullName, setFullName] = useState('Muhammad Ibrahim');
  const [email, setEmail] = useState('ibrahim@example.com');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [profileSaved, setProfileSaved] = useState(false);

  // Password form state
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

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <AccountSidebar
            userName="Muhammad Ibrahim"
            userInitials="MI"
            joinedDate="Jan 2026"
          />

          {/* Right Content */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-brand-gold font-semibold text-xs tracking-widest uppercase mb-3">
                Account Settings
              </p>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-3">
                Account Details
              </h1>
              <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
                Update your personal information and password.
              </p>
            </div>

            {/* Profile Information Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-6">
                Profile Information
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-brand-text-dark mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-brand-text-dark mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-brand-text-dark mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="btn-primary px-8 py-3"
                  >
                    Save Changes
                  </button>
                  {profileSaved && (
                    <span className="text-sm text-brand-green font-medium">
                      ✓ Profile updated!
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <h2 className="font-heading font-semibold text-xl md:text-2xl text-brand-green mb-6">
                Change Password
              </h2>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-brand-text-dark mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-12 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-brand-text-dark mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-12 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-brand-text-dark mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-12 text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Update Button */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="btn-primary px-8 py-3"
                  >
                    Update Password
                  </button>
                  {passwordSaved && (
                    <span className="text-sm text-brand-green font-medium">
                      ✓ Password updated!
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}