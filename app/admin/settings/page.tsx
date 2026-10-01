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
} from 'lucide-react';
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

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getSiteSettings();
      setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

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

    // Sign in with current password to verify
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email || '',
      password: currentPassword,
    });

    if (signInError) {
      setPasswordError('Current password is incorrect.');
      setChangingPassword(false);
      return;
    }

    // Update password
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
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2">
          Settings
        </h1>
        <p className="text-sm text-brand-text-muted">
          Configure your store's information, shipping rules, social links, and
          admin account.
        </p>
      </div>

      {/* ============================================ */}
      {/* SECTION 1: Store Information */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
            <Store size={20} className="text-brand-green" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-xl text-brand-green">
              Store Information
            </h2>
            <p className="text-xs text-brand-text-muted">
              Basic business details displayed across the store.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) =>
                  setSettings({ ...settings, store_name: e.target.value })
                }
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settings.store_email}
                onChange={(e) =>
                  setSettings({ ...settings, store_email: e.target.value })
                }
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.store_phone}
                onChange={(e) =>
                  setSettings({ ...settings, store_phone: e.target.value })
                }
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Physical Address
              </label>
              <input
                type="text"
                value={settings.store_address}
                onChange={(e) =>
                  setSettings({ ...settings, store_address: e.target.value })
                }
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() =>
                handleSave('store', {
                  store_name: settings.store_name,
                  store_email: settings.store_email,
                  store_phone: settings.store_phone,
                  store_address: settings.store_address,
                })
              }
              className="btn-primary inline-flex items-center gap-2"
            >
              <Save size={14} />
              Save Store Info
            </button>
            {savedSection === 'store' && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <Check size={16} />
                Saved!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECTION 2: Shipping Settings */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
            <Truck size={20} className="text-brand-green" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-xl text-brand-green">
              Shipping Settings
            </h2>
            <p className="text-xs text-brand-text-muted">
              Configure delivery fees and free shipping thresholds.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Free Shipping Threshold (Rs)
              </label>
              <input
                type="number"
                value={settings.free_shipping_threshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    free_shipping_threshold: Number(e.target.value),
                  })
                }
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              <p className="text-xs text-brand-text-muted mt-1">
                Orders above this amount get FREE delivery.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Standard Shipping Fee (Rs)
              </label>
              <input
                type="number"
                value={settings.shipping_fee}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping_fee: Number(e.target.value),
                  })
                }
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              <p className="text-xs text-brand-text-muted mt-1">
                Applied to orders below the free threshold.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() =>
                handleSave('shipping', {
                  shipping_fee: settings.shipping_fee,
                  free_shipping_threshold: settings.free_shipping_threshold,
                })
              }
              className="btn-primary inline-flex items-center gap-2"
            >
              <Save size={14} />
              Save Shipping Settings
            </button>
            {savedSection === 'shipping' && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <Check size={16} />
                Saved!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECTION 3: Social Media & Contact */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
            <Share2 size={20} className="text-brand-green" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-xl text-brand-green">
              Social Media & Contact
            </h2>
            <p className="text-xs text-brand-text-muted">
              Link your social media profiles and WhatsApp number.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebook_url}
                onChange={(e) =>
                  setSettings({ ...settings, facebook_url: e.target.value })
                }
                placeholder="https://facebook.com/yourpage"
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) =>
                  setSettings({ ...settings, instagram_url: e.target.value })
                }
                placeholder="https://instagram.com/yourpage"
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={settings.whatsapp_number}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_number: e.target.value })
              }
              placeholder="923422544495"
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <p className="text-xs text-brand-text-muted mt-1">
              Format: Country code without "+" (e.g., 923422544495)
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() =>
                handleSave('social', {
                  facebook_url: settings.facebook_url,
                  instagram_url: settings.instagram_url,
                  whatsapp_number: settings.whatsapp_number,
                })
              }
              className="btn-primary inline-flex items-center gap-2"
            >
              <Save size={14} />
              Save Social Links
            </button>
            {savedSection === 'social' && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <Check size={16} />
                Saved!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECTION 4: Support Hours */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
            <Clock size={20} className="text-brand-green" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-xl text-brand-green">
              Support Hours
            </h2>
            <p className="text-xs text-brand-text-muted">
              When your customers can reach you.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Weekday Hours
              </label>
              <input
                type="text"
                value={settings.support_hours_weekday}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    support_hours_weekday: e.target.value,
                  })
                }
                placeholder="Mon–Sat, 9:00 AM – 8:00 PM"
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Weekend Hours
              </label>
              <input
                type="text"
                value={settings.support_hours_weekend}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    support_hours_weekend: e.target.value,
                  })
                }
                placeholder="Sunday, Closed"
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">
              Response Time Message
            </label>
            <input
              type="text"
              value={settings.response_time}
              onChange={(e) =>
                setSettings({ ...settings, response_time: e.target.value })
              }
              placeholder="We reply to all messages within 24 hours."
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() =>
                handleSave('support', {
                  support_hours_weekday: settings.support_hours_weekday,
                  support_hours_weekend: settings.support_hours_weekend,
                  response_time: settings.response_time,
                })
              }
              className="btn-primary inline-flex items-center gap-2"
            >
              <Save size={14} />
              Save Support Hours
            </button>
            {savedSection === 'support' && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <Check size={16} />
                Saved!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECTION 5: Admin Profile */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
            <Lock size={20} className="text-brand-green" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-xl text-brand-green">
              Admin Account
            </h2>
            <p className="text-xs text-brand-text-muted">
              Change your admin password.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          {passwordError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{passwordError}</p>
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center gap-2">
              <Check size={16} className="text-green-600" />
              <p className="text-sm text-green-700">
                Password changed successfully!
              </p>
            </div>
          )}

          {/* Current Password */}
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

          {/* New Password */}
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
            <p className="text-xs text-brand-text-muted mt-1">
              Minimum 6 characters
            </p>
          </div>

          {/* Confirm Password */}
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
            className="btn-primary py-3 inline-flex items-center gap-2 disabled:opacity-60"
          >
            {changingPassword ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Changing...
              </>
            ) : (
              <>
                <Lock size={16} />
                Change Password
              </>
            )}
          </button>
        </form>
      </div>

      {/* ============================================ */}
      {/* SECTION 6: Danger Zone */}
      {/* ============================================ */}
      <div className="bg-white rounded-xl border-2 border-red-200 p-6 md:p-8">
        <h2 className="font-heading font-semibold text-xl text-red-600 mb-2">
          Danger Zone
        </h2>
        <p className="text-sm text-brand-text-muted mb-5">
          Log out from the admin console. You will need to sign in again to
          access admin features.
        </p>
        <button
          type="button"
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = '/';
          }}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm"
        >
          <LogOut size={14} />
          Log Out from Admin
        </button>
      </div>
    </div>
  );
}