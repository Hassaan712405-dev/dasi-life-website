'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useAuth } from '@/hooks/useAuth';
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

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [error, setError] = useState('');

  // Password
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // ✅ LOAD DATA ON MOUNT
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

  // ✅ SAVE PROFILE
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

  // ✅ SAVE ADDRESS
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
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
                Apni details save karein. Checkout par yeh automatically fill
                hongi.
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
                  <h2 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-1">
                    Shipping Address
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-text-muted mb-4 sm:mb-6">
                    Checkout par yeh address automatically fill hoga.
                  </p>

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
                          placeholder="Receiver ka naam"
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
                  <h2 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl text-brand-green mb-4 sm:mb-6">
                    Change Password
                  </h2>

                  <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-3 sm:space-y-5"
                  >
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
                            className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}