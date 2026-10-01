'use client';

import { Plus, MapPin, Phone, Pencil, Trash2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useAuth } from '@/hooks/useAuth';

const addresses = [
  {
    id: 1,
    fullName: 'Muhammad Ibrahim',
    phone: '+92 300 1234567',
    street: 'House 42, Block C, Gulberg III',
    city: 'Lahore',
    state: 'Punjab',
    postalCode: '54660',
    country: 'Pakistan',
    isDefault: true,
  },
  {
    id: 2,
    fullName: 'Muhammad Ibrahim',
    phone: '+92 321 9876543',
    street: 'Apartment 12-B, Askari Tower, DHA Phase 5',
    city: 'Karachi',
    state: 'Sindh',
    postalCode: '75500',
    country: 'Pakistan',
    isDefault: false,
  },
];

export default function AddressesPage() {
  const { user } = useAuth();
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
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-brand-green hover:bg-black text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-md transition-colors whitespace-nowrap self-start sm:self-end text-xs sm:text-sm"
              >
                <Plus size={14} />
                Add New Address
              </motion.button>
            </motion.div>

            {/* Addresses Grid */}
            {addresses.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
                <MapPin size={40} className="text-brand-text-muted mx-auto mb-4" />
                <p className="text-xs sm:text-sm text-brand-text-muted mb-4">
                  You haven't saved any addresses yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                {addresses.map((address, index) => (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`relative bg-white rounded-xl border p-4 sm:p-5 md:p-6 transition-all duration-300 ${
                      address.isDefault
                        ? 'border-brand-green shadow-md'
                        : 'border-gray-200 hover:border-brand-green/40 hover:shadow-md'
                    }`}
                  >
                    {address.isDefault && (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1 bg-brand-green text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                        <Check size={10} strokeWidth={3} />
                        Default
                      </div>
                    )}

                    <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5 pr-16 sm:pr-20">
                      <h3 className="font-heading font-semibold text-sm sm:text-base md:text-lg text-brand-green">
                        {address.fullName}
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
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-3 sm:pt-4 border-t border-gray-100">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-brand-green border border-brand-green rounded-md px-2.5 sm:px-3 py-1.5 hover:bg-brand-green hover:text-white transition-colors"
                      >
                        <Pencil size={11} />
                        Edit
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-red-600 border border-red-600 rounded-md px-2.5 sm:px-3 py-1.5 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <Trash2 size={11} />
                        Delete
                      </motion.button>
                      {!address.isDefault && (
                        <button
                          type="button"
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