'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  MapPin,
  Phone,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useAuth } from '@/hooks/useAuth';
import {
  getAllAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
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

interface AddressFormData {
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

const EMPTY_FORM: AddressFormData = {
  full_name: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'Pakistan',
  is_default: false,
};

export default function AddressesPage() {
  const { user, loading: authLoading } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  const userInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'U';
  const displayName = user?.email?.split('@')[0] || 'User';

  // ✅ Load addresses
  const loadAddresses = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getAllAddresses(user.id);
    setAddresses(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadAddresses();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // ✅ Open form for add
  const handleAddNew = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError('');
    setShowForm(true);
  };

  // ✅ Open form for edit
  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      full_name: address.full_name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code || '',
      country: address.country || 'Pakistan',
      is_default: address.is_default,
    });
    setError('');
    setShowForm(true);
  };

  // ✅ Close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setError('');
  };

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');

    // Validation
    if (!formData.full_name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required.');
      return;
    }
    if (formData.phone.replace(/\D/g, '').length < 11) {
      setError('Please enter a valid phone number (11 digits).');
      return;
    }
    if (!formData.street.trim()) {
      setError('Street address is required.');
      return;
    }
    if (!formData.city.trim()) {
      setError('City is required.');
      return;
    }
    if (!formData.state.trim()) {
      setError('State is required.');
      return;
    }

    setSaving(true);

    const payload = {
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim(),
      street: formData.street.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      postal_code: formData.postal_code.trim(),
      country: formData.country.trim() || 'Pakistan',
      is_default: formData.is_default,
    };

    let result;
    if (editingId) {
      result = await updateAddress(editingId, user.id, payload);
    } else {
      result = await createAddress(user.id, payload);
    }

    setSaving(false);

    if (!result.success) {
      setError(result.error || 'Failed to save address.');
      return;
    }

    await loadAddresses();
    handleCloseForm();
  };

  // ✅ Delete address
  const handleDelete = async (addressId: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this address?')) return;

    setDeleting(addressId);
    const result = await deleteAddress(addressId, user.id);
    setDeleting(null);

    if (!result.success) {
      setError(result.error || 'Failed to delete address.');
      return;
    }

    await loadAddresses();
  };

  // ✅ Set default
  const handleSetDefault = async (addressId: string) => {
    if (!user) return;
    const result = await setDefaultAddress(addressId, user.id);
    if (result.success) {
      await loadAddresses();
    }
  };

  // 🔐 Not logged in
  if (!authLoading && !user) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="container-custom py-12 sm:py-20 text-center">
          <MapPin size={40} className="text-brand-text-muted mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-green mb-3">
            Please Log In
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted mb-6">
            You need to be logged in to view your addresses.
          </p>
          <a
            href="/login"
            className="inline-block bg-brand-green hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

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
              className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4"
            >
              <div>
                <p className="text-brand-gold font-semibold text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3">
                  Shipping
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-brand-green mb-2 sm:mb-3">
                  Saved Addresses
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-brand-text-muted leading-relaxed">
                  Manage your shipping addresses for faster checkout.
                </p>
              </div>
              {!showForm && (
                <motion.button
                  type="button"
                  onClick={handleAddNew}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-brand-green hover:bg-black text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-md transition-colors whitespace-nowrap self-start sm:self-end text-xs sm:text-sm"
                >
                  <Plus size={14} />
                  Add New Address
                </motion.button>
              )}
            </motion.div>

            {/* Error */}
            {error && !showForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2"
              >
                <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {/* Add/Edit Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl border-2 border-brand-green p-4 sm:p-6"
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <h2 className="font-heading font-semibold text-lg sm:text-xl text-brand-green">
                      {editingId ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="w-8 h-8 rounded-full hover:bg-brand-cream flex items-center justify-center transition-colors"
                      aria-label="Close form"
                    >
                      <X size={18} className="text-brand-text-muted" />
                    </button>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2 mb-4">
                      <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) =>
                            setFormData({ ...formData, full_name: e.target.value })
                          }
                          placeholder="Receiver's name"
                          required
                          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+92 300 1234567"
                          required
                          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.street}
                        onChange={(e) =>
                          setFormData({ ...formData, street: e.target.value })
                        }
                        placeholder="House no, street, area..."
                        rows={2}
                        required
                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          placeholder="Karachi"
                          required
                          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                          }
                          required
                          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer"
                        >
                          <option value="">Select state</option>
                          {PROVINCES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={formData.postal_code}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              postal_code: e.target.value,
                            })
                          }
                          placeholder="75500"
                          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="is_default"
                        checked={formData.is_default}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_default: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-brand-green cursor-pointer"
                      />
                      <label
                        htmlFor="is_default"
                        className="text-xs sm:text-sm text-brand-text-dark cursor-pointer"
                      >
                        Set as default address
                      </label>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <motion.button
                        type="submit"
                        disabled={saving}
                        whileTap={{ scale: 0.97 }}
                        className="bg-brand-green hover:bg-black text-white font-medium px-6 py-2.5 rounded-md transition-colors text-xs sm:text-sm inline-flex items-center gap-2 disabled:opacity-60"
                      >
                        {saving ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Saving...
                          </>
                        ) : editingId ? (
                          'Update Address'
                        ) : (
                          'Save Address'
                        )}
                      </motion.button>

                      <button
                        type="button"
                        onClick={handleCloseForm}
                        className="text-xs sm:text-sm font-medium text-brand-text-muted hover:text-brand-green transition-colors px-4 py-2.5"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Addresses Grid */}
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
                <Loader2
                  size={28}
                  className="animate-spin text-brand-green mx-auto mb-3"
                />
                <p className="text-xs sm:text-sm text-brand-text-muted">
                  Loading addresses...
                </p>
              </div>
            ) : addresses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center"
              >
                <MapPin size={40} className="text-brand-text-muted mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg sm:text-xl text-brand-green mb-2">
                  No addresses saved yet
                </h3>
                <p className="text-xs sm:text-sm text-brand-text-muted mb-6">
                  Add your first shipping address to speed up checkout.
                </p>
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 bg-brand-green hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm"
                >
                  <Plus size={14} />
                  Add Your First Address
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                {addresses.map((address, index) => (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`relative bg-white rounded-xl border p-4 sm:p-5 md:p-6 transition-all duration-300 ${
                      address.is_default
                        ? 'border-brand-green shadow-md'
                        : 'border-gray-200 hover:border-brand-green/40 hover:shadow-md'
                    }`}
                  >
                    {address.is_default && (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1 bg-brand-green text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                        <Check size={10} strokeWidth={3} />
                        Default
                      </div>
                    )}

                    <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5 pr-16 sm:pr-20">
                      <h3 className="font-heading font-semibold text-sm sm:text-base md:text-lg text-brand-green">
                        {address.full_name}
                      </h3>

                      <div className="flex items-center gap-2 text-xs sm:text-sm text-brand-text-muted">
                        <Phone size={12} className="text-brand-green shrink-0" />
                        <span>{address.phone}</span>
                      </div>

                      <div className="flex items-start gap-2 text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                        <MapPin size={12} className="text-brand-green shrink-0 mt-0.5" />
                        <div>
                          <p>{address.street}</p>
                          <p>
                            {address.city}, {address.state}{' '}
                            {address.postal_code || ''}
                          </p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-3 sm:pt-4 border-t border-gray-100">
                      <motion.button
                        type="button"
                        onClick={() => handleEdit(address)}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-brand-green border border-brand-green rounded-md px-2.5 sm:px-3 py-1.5 hover:bg-brand-green hover:text-white transition-colors"
                      >
                        <Pencil size={11} />
                        Edit
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => handleDelete(address.id)}
                        disabled={deleting === address.id}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-red-600 border border-red-600 rounded-md px-2.5 sm:px-3 py-1.5 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-60"
                      >
                        {deleting === address.id ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          <Trash2 size={11} />
                        )}
                        Delete
                      </motion.button>

                      {!address.is_default && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(address.id)}
                          className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-brand-text-muted hover:text-brand-green transition-colors ml-auto"
                        >
                          Set Default
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}