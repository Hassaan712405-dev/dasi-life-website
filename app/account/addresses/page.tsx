'use client';

import Link from 'next/link';
import { Plus, MapPin, Phone, Pencil, Trash2, Check } from 'lucide-react';
import AccountSidebar from '@/components/account/AccountSidebar';

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
            {/* Header with Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-brand-gold font-semibold text-xs tracking-widest uppercase mb-3">
                  Shipping
                </p>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-green mb-3">
                  Saved Addresses
                </h1>
                <p className="text-sm md:text-base text-brand-text-muted leading-relaxed">
                  Manage your shipping addresses for faster checkout.
                </p>
              </div>
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2 self-start sm:self-end whitespace-nowrap"
              >
                <Plus size={16} />
                Add New Address
              </button>
            </div>

            {/* Addresses Grid */}
            {addresses.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <MapPin size={48} className="text-brand-text-muted mx-auto mb-4" />
                <p className="text-brand-text-muted mb-4">
                  You haven't saved any addresses yet.
                </p>
                <button className="btn-primary inline-flex">
                  <Plus size={16} className="mr-2" />
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`relative bg-white rounded-xl border p-5 md:p-6 transition-all duration-300 ${
                      address.isDefault
                        ? 'border-brand-green shadow-md'
                        : 'border-gray-200 hover:border-brand-green/40 hover:shadow-md'
                    }`}
                  >
                    {/* Default Badge */}
                    {address.isDefault && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-brand-green text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        <Check size={12} strokeWidth={3} />
                        Default
                      </div>
                    )}

                    {/* Address Content */}
                    <div className="space-y-3 mb-5 pr-20">
                      {/* Name */}
                      <h3 className="font-heading font-semibold text-base md:text-lg text-brand-green">
                        {address.fullName}
                      </h3>

                      {/* Phone */}
                      <div className="flex items-center gap-2 text-sm text-brand-text-muted">
                        <Phone size={14} className="text-brand-green shrink-0" />
                        <span>{address.phone}</span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2 text-sm text-brand-text-muted leading-relaxed">
                        <MapPin size={14} className="text-brand-green shrink-0 mt-0.5" />
                        <div>
                          <p>{address.street}</p>
                          <p>
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-green border border-brand-green rounded-md px-3 py-1.5 hover:bg-brand-green hover:text-white transition-colors"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 border border-red-600 rounded-md px-3 py-1.5 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                      {!address.isDefault && (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-text-muted hover:text-brand-green transition-colors ml-auto"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}