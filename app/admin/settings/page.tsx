'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Store,
  Truck,
  LogOut,
  Loader2,
  Check,
  Share2,
  Clock,
  Lock,
  Eye,
  EyeOff,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getSiteSettings,
  updateSiteSettings,
  SiteSettings,
} from '@/services/settings/settingsService';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedSection, setSavedSection] = useState<string>('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getSiteSettings();
      setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (user?.email) setNewEmail(user.email);
  }, [user?.email]);

  const handleSave = async (section: string, updates: Partial<SiteSettings>) => {
    const result = await updateSiteSettings(updates);
    if (result.success) {
      setSavedSection(section);
      setTimeout(() => setSavedSection(''), 3000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email || '',
      password: currentPassword,
    });

    if (signInError) {
      setPasswordError('Current password is incorrect.');
      setChangingPassword(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setPasswordError(updateError.message);
      setChangingPassword(false);
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangingPassword(false);
    setTimeout(() => setPasswordSuccess(false), 5000);
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess(false);

    if (!newEmail.trim()) {
      setEmailError('New email is required.');
      return;
    }
    if (!emailPassword) {
      setEmailError('Please enter your current password.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (newEmail.trim().toLowerCase() === user?.email?.toLowerCase()) {
      setEmailError('This is your current email.');
      return;
    }

    setChangingEmail(true);
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email || '',
      password: emailPassword,
    });

    if (signInError) {
      setEmailError('Current password is incorrect.');
      setChangingEmail(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail.trim().toLowerCase(),
    });

    if (updateError) {
      setEmailError(updateError.message);
      setChangingEmail(false);
      return;
    }

    setEmailSuccess(true);
    setEmailPassword('');
    setChangingEmail(false);
    setTimeout(() => setEmailSuccess(false), 8000);
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-brand-text-muted">
          Configure your store, shipping, social links, and admin account.
        </p>
      </motion.div>

      {/* Store Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
            <Store size={18} className="text-brand-green" />
          </div>
          <h2 className="font-heading font-semibold text-base sm:text-xl text-brand-green">
            Store Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">Store Name</label>
            <input
              type="text"
              value={settings.store_name}
              onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">Support Email</label>
            <input
              type="email"
              value={settings.store_email}
              onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">Phone Number</label>
            <input
              type="tel"
              value={settings.store_phone}
              onChange={(e) => setSettings({ ...settings, store_phone: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">Physical Address</label>
            <input
              type="text"
              value={settings.store_address}
              onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-5">
          <button
            onClick={() =>
              handleSave('store', {
                store_name: settings.store_name,
                store_email: settings.store_email,
                store_phone: settings.store_phone,
                store_address: settings.store_address,
              })
            }
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <Save size={14} /> Save Store Info
          </button>
          {savedSection === 'store' && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <Check size={16} /> Saved!
            </span>
          )}
        </div>
      </motion.div>

      {/* Shipping Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
            <Truck size={18} className="text-brand-green" />
          </div>
          <h2 className="font-heading font-semibold text-base sm:text-xl text-brand-green">
            Shipping Settings
          </h2>
        </div>

        <div className="bg-brand-cream rounded-lg p-4 border border-gray-200 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-text-dark">Shipping Charges</p>
              <p className="text-xs text-brand-text-muted mt-0.5">
                {settings.shipping_enabled ? 'Shipping fee applied below threshold.' : 'FREE shipping on all orders.'}
              </p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, shipping_enabled: !settings.shipping_enabled })}
              className={`relative w-14 h-7 rounded-full transition-colors ${settings.shipping_enabled ? 'bg-brand-green' : 'bg-gray-300'}`}
            >
              <motion.span
                animate={{ x: settings.shipping_enabled ? 30 : 2 }}
                className="absolute top-1 left-0 w-5 h-5 bg-white rounded-full shadow"
              />
            </button>
          </div>
        </div>

        {settings.shipping_enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">Free Shipping Threshold (Rs)</label>
              <input
                type="number"
                value={settings.free_shipping_threshold}
                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">Shipping Fee (Rs)</label>
              <input
                type="number"
                value={settings.shipping_fee}
                onChange={(e) => setSettings({ ...settings, shipping_fee: Number(e.target.value) })}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              handleSave('shipping', {
                shipping_enabled: settings.shipping_enabled,
                shipping_fee: settings.shipping_fee,
                free_shipping_threshold: settings.free_shipping_threshold,
              })
            }
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <Save size={14} /> Save Shipping
          </button>
          {savedSection === 'shipping' && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <Check size={16} /> Saved!
            </span>
          )}
        </div>
      </motion.div>

      {/* Social Media */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
            <Share2 size={18} className="text-brand-green" />
          </div>
          <h2 className="font-heading font-semibold text-base sm:text-xl text-brand-green">
            Social Media & Contact
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">Facebook URL</label>
            <input
              type="url"
              value={(settings as any).facebook_url || ''}
              onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value } as any)}
              placeholder="https://web.facebook.com/desilifestore"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">TikTok URL</label>
            <input
              type="url"
              value={(settings as any).tiktok_url || ''}
              onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value } as any)}
              placeholder="https://www.tiktok.com/@desilifestore"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-brand-text-dark mb-2">WhatsApp Number</label>
          <input
            type="tel"
            value={(settings as any).whatsapp_number || ''}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value } as any)}
            placeholder="923422544495"
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
          <p className="text-xs text-brand-text-muted mt-1">
            Format: Country code without "+" (e.g., 923422544495)
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              handleSave('social', {
                facebook_url: (settings as any).facebook_url,
                tiktok_url: (settings as any).tiktok_url,
                whatsapp_number: (settings as any).whatsapp_number,
              } as any)
            }
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <Save size={14} /> Save Social Links
          </button>
          {savedSection === 'social' && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <Check size={16} /> Saved!
            </span>
          )}
        </div>
      </motion.div>

      {/* Support Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
            <Clock size={18} className="text-brand-green" />
          </div>
          <h2 className="font-heading font-semibold text-base sm:text-xl text-brand-green">
            Support Hours
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">Weekday Hours</label>
            <input
              type="text"
              value={settings.support_hours_weekday}
              onChange={(e) => setSettings({ ...settings, support_hours_weekday: e.target.value })}
              placeholder="Mon–Sat, 9:00 AM – 8:00 PM"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">Weekend Hours</label>
            <input
              type="text"
              value={settings.support_hours_weekend}
              onChange={(e) => setSettings({ ...settings, support_hours_weekend: e.target.value })}
              placeholder="Sunday, Closed"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-brand-text-dark mb-2">Response Time</label>
          <input
            type="text"
            value={settings.response_time}
            onChange={(e) => setSettings({ ...settings, response_time: e.target.value })}
            placeholder="We reply within 24 hours."
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              handleSave('support', {
                support_hours_weekday: settings.support_hours_weekday,
                support_hours_weekend: settings.support_hours_weekend,
                response_time: settings.response_time,
              })
            }
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <Save size={14} /> Save Support Hours
          </button>
          {savedSection === 'support' && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <Check size={16} /> Saved!
            </span>
          )}
        </div>
      </motion.div>

      {/* Admin Account — Email + Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
            <Lock size={18} className="text-brand-green" />
          </div>
          <h2 className="font-heading font-semibold text-base sm:text-xl text-brand-green">
            Admin Account
          </h2>
        </div>

        <div className="bg-brand-cream rounded-lg p-4 mb-5 border border-[#EBE4D6]">
          <p className="text-xs text-brand-text-muted mb-1">Currently signed in as</p>
          <p className="text-sm font-semibold text-brand-green break-all">
            {user?.email || 'Loading...'}
          </p>
        </div>

        {/* Change Email */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 font-heading font-semibold text-base text-brand-text-dark mb-3">
            <Mail size={16} className="text-brand-green" /> Change Email
          </h3>

          {emailError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3 flex items-start gap-2">
              <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{emailError}</p>
            </div>
          )}

          {emailSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
              <p className="text-sm text-green-700 font-medium mb-1">
                ✅ Verification email sent!
              </p>
              <p className="text-xs text-green-600">
                Check <strong>{newEmail}</strong> to confirm the change.
              </p>
            </div>
          )}

          <form onSubmit={handleEmailChange} className="space-y-3 max-w-md">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                New Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="newemail@example.com"
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Confirm with Current Password
              </label>
              <div className="relative">
                <input
                  type={showEmailPassword ? 'text' : 'password'}
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <button
                  type="button"
                  onClick={() => setShowEmailPassword(!showEmailPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green"
                >
                  {showEmailPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={changingEmail}
              className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-60"
            >
              {changingEmail ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Mail size={16} /> Update Email
                </>
              )}
            </button>
          </form>
        </div>

        <div className="border-t border-[#EBE4D6] my-6" />

        {/* Change Password */}
        <div>
          <h3 className="flex items-center gap-2 font-heading font-semibold text-base text-brand-text-dark mb-3">
            <Lock size={16} className="text-brand-green" /> Change Password
          </h3>

          {passwordError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
              <p className="text-sm text-red-600">{passwordError}</p>
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3 flex items-center gap-2">
              <Check size={16} className="text-green-600" />
              <p className="text-sm text-green-700">Password changed successfully!</p>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-brand-text-muted mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-60"
            >
              {changingPassword ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Changing...
                </>
              ) : (
                <>
                  <Lock size={16} /> Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl border-2 border-red-200 p-4 sm:p-6 md:p-8"
      >
        <h2 className="font-heading font-semibold text-base sm:text-xl text-red-600 mb-2">
          Danger Zone
        </h2>
        <p className="text-sm text-brand-text-muted mb-4">
          Log out from the admin console.
        </p>
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = '/';
          }}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm"
        >
          <LogOut size={14} /> Log Out from Admin
        </button>
      </motion.div>
    </div>
  );
}