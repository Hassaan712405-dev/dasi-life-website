'use client';

import { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  User,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import {
  getProfile,
  updateProfile,
  getDefaultAddress,
  upsertAddress,
} from '@/services/profile/profileService';

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu & Kashmir',
];

export default function ProfilePage() {
  const { user } = useAuth();

  // Profile state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Address state
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Pakistan');

  // Loading states
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Success states
  const [profileSaved, setProfileSaved] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Error states
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Load data on mount
  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);

      const [profile, address] = await Promise.all([
        getProfile(user.id),
        getDefaultAddress(user.id),
      ]);

      if (profile) {
        setFullName(profile.full_name || '');
        setPhone(profile.phone || '');
      }

      if (address) {
        setAddrFullName(address.full_name || '');
        setAddrPhone(address.phone || '');
        setStreet(address.street || '');
        setCity(address.city || '');
        setState(address.state || '');
        setPostalCode(address.postal_code || '');
        setCountry(address.country || 'Pakistan');
      }

      setLoading(false);
    }
    load();
  }, [user]);

  // ✅ Save profile
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setSavingProfile(true);

    const result = await updateProfile(user.id, {
      full_name: fullName.trim(),
      phone: phone.trim(),
    });

    setSavingProfile(false);

    if (!result.success) {
      setError(result.error || 'Failed to save profile.');
      return;
    }

    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // ✅ Save address
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setSavingAddress(true);

    const result = await upsertAddress(user.id, {
      full_name: addrFullName.trim(),
      phone: addrPhone.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      postal_code: postalCode.trim(),
      country: country.trim() || 'Pakistan',
    });

    setSavingAddress(false);

    if (!result.success) {
      setError(result.error || 'Failed to save address.');
      return;
    }

    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);
  };

  // ✅ Change password (REAL)
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setPasswordError('');

    // Validation
    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from current.');
      return;
    }

    setSavingPassword(true);

    const supabase = createClient();

    // Step 1: Verify current password by signing in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      setSavingPassword(false);
      setPasswordError('Current password is incorrect.');
      return;
    }

    // Step 2: Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setSavingPassword(false);

    if (updateError) {
      setPasswordError(updateError.message || 'Failed to update password.');
      return;
    }

    // Success
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 5000);
  };

  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'U';
  const displayName = fullName || user?.email?.split('@')[0] || 'User';

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
                Manage your personal information, shipping address, and account security.
                These details are automatically filled at checkout.
              </p>
            </motion.div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2"
              >
                <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-brand-green" />
              </div>
            ) : (
              <>
                {/* Profile Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-gray-100">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                      <User size={16} className="text-brand-green" />
                    </div>
                    <div>
                      <h2 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green">
                        Profile Information
                      </h2>
                      <p className="text-[10px] sm:text-xs text-brand-text-muted">
                        Your personal details
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleProfileSubmit}
                    className="space-y-3 sm:space-y-5"
                  >
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        disabled={savingProfile}
                        className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-muted cursor-not-allowed"
                      />
                      <p className="text-[10px] sm:text-xs text-brand-text-muted mt-1">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        disabled={savingProfile}
                        className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <motion.button
                        type="submit"
                        whileTap={{ scale: 0.97 }}
                        disabled={savingProfile}
                        className="bg-brand-green hover:bg-black text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-md transition-colors text-xs sm:text-sm inline-flex items-center gap-2 disabled:opacity-60"
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </motion.button>
                      {profileSaved && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs sm:text-sm text-brand-green font-medium inline-flex items-center gap-1"
                        >
                          <CheckCircle2 size={14} />
                          Profile updated!
                        </motion.span>
                      )}
                    </div>
                  </form>
                </motion.div>

                {/* Shipping Address */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-gray-100">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-brand-green" />
                    </div>
                    <div>
                      <h2 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green">
                        Shipping Address
                      </h2>
                      <p className="text-[10px] sm:text-xs text-brand-text-muted">
                        This address will be auto-filled at checkout
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleAddressSubmit}
                    className="space-y-3 sm:space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={addrFullName}
                          onChange={(e) => setAddrFullName(e.target.value)}
                          placeholder="Receiver's name"
                          disabled={savingAddress}
                          className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          placeholder="+92 300 1234567"
                          disabled={savingAddress}
                          className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                        Street Address
                      </label>
                      <textarea
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="House no, street, area..."
                        rows={2}
                        disabled={savingAddress}
                        className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none disabled:opacity-60"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Karachi"
                          disabled={savingAddress}
                          className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                          State
                        </label>
                        <div className="relative">
                          <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            disabled={savingAddress}
                            className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green appearance-none pr-10 cursor-pointer disabled:opacity-60"
                          >
                            <option value="">Select state</option>
                            {PROVINCES.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M2 4L6 8L10 4"
                                stroke="#1F4A2C"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="75500"
                          disabled={savingAddress}
                          className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={savingAddress}
                        className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <motion.button
                        type="submit"
                        whileTap={{ scale: 0.97 }}
                        disabled={savingAddress}
                        className="bg-brand-green hover:bg-black text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-md transition-colors text-xs sm:text-sm inline-flex items-center gap-2 disabled:opacity-60"
                      >
                        {savingAddress ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Address'
                        )}
                      </motion.button>
                      {addressSaved && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs sm:text-sm text-brand-green font-medium inline-flex items-center gap-1"
                        >
                          <CheckCircle2 size={14} />
                          Address saved!
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
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-gray-100">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                      <Lock size={16} className="text-brand-green" />
                    </div>
                    <div>
                      <h2 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green">
                        Change Password
                      </h2>
                      <p className="text-[10px] sm:text-xs text-brand-text-muted">
                        Keep your account secure
                      </p>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2 mb-4">
                      <AlertCircle
                        size={14}
                        className="text-red-500 shrink-0 mt-0.5"
                      />
                      <p className="text-xs sm:text-sm text-red-600">
                        {passwordError}
                      </p>
                    </div>
                  )}

                  <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-3 sm:space-y-5"
                  >
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrent ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          disabled={savingPassword}
                          className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green transition-colors"
                        >
                          {showCurrent ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min. 8 characters)"
                          disabled={savingPassword}
                          className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green transition-colors"
                        >
                          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          disabled={savingPassword}
                          className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green transition-colors"
                        >
                          {showConfirm ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <motion.button
                        type="submit"
                        whileTap={{ scale: 0.97 }}
                        disabled={savingPassword}
                        className="bg-brand-green hover:bg-black text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-md transition-colors text-xs sm:text-sm inline-flex items-center gap-2 disabled:opacity-60"
                      >
                        {savingPassword ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </motion.button>
                      {passwordSaved && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs sm:text-sm text-brand-green font-medium inline-flex items-center gap-1"
                        >
                          <CheckCircle2 size={14} />
                          Password updated successfully!
                        </motion.span>
                      )}
                    </div>
                  </form>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}