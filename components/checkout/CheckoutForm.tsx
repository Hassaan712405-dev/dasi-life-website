'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, AlertCircle } from 'lucide-react';

export interface ShippingInfo {
  customerName: string;
  customerNameUrdu: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  shippingAddressUrdu: string;
  shippingCity: string;
  shippingCityUrdu: string;
  shippingState: string;
  shippingStateUrdu: string;
  shippingPostalCode: string;
  shippingCountry: string;
  notes: string;
}

interface CheckoutFormProps {
  data: ShippingInfo;
  onChange: (data: ShippingInfo) => void;
  disabled?: boolean;
}

// Pakistani Provinces List
const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu & Kashmir',
];

export default function CheckoutForm({
  data,
  onChange,
  disabled,
}: CheckoutFormProps) {
  // Track which fields have been touched (validation ke liye)
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const update = (field: keyof ShippingInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation helper — returns true if field has error
  const hasError = (field: keyof ShippingInfo, required: boolean = true) => {
    if (!required) return false;
    if (!touched[field]) return false;
    return !data[field]?.trim();
  };

  // Input classes with red border if error
  const inputClass = (field: keyof ShippingInfo, required: boolean = true) => {
    const baseClass =
      'w-full bg-white border rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 disabled:opacity-60 transition-colors';
    const errorClass = hasError(field, required)
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-brand-green focus:border-brand-green';
    return `${baseClass} ${errorClass}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Shipping Information */}
      <div className="bg-brand-cream rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8">
        <h2 className="font-heading font-semibold text-xl sm:text-2xl text-brand-green mb-4 sm:mb-6">
          Shipping Information
        </h2>

        <div className="space-y-3 sm:space-y-5">
          {/* ============ Full Name ============ */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.customerName}
              onChange={(e) => update('customerName', e.target.value)}
              onBlur={() => handleBlur('customerName')}
              placeholder="Enter your name"
              required
              disabled={disabled}
              className={inputClass('customerName')}
            />
            {hasError('customerName') && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />
                Name is required
              </p>
            )}
          </div>

          {/* ============ Phone + Email ============ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
            {/* Phone */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={data.customerPhone}
                onChange={(e) => update('customerPhone', e.target.value)}
                onBlur={() => handleBlur('customerPhone')}
                placeholder="Enter your phone number"
                required
                disabled={disabled}
                className={inputClass('customerPhone')}
              />
              {hasError('customerPhone') && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} />
                  Phone is required
                </p>
              )}
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Email Address{' '}
                <span className="text-brand-text-muted text-[10px] sm:text-xs">
                  (Optional)
                </span>
              </label>
              <input
                type="email"
                value={data.customerEmail}
                onChange={(e) => update('customerEmail', e.target.value)}
                placeholder="Enter your email"
                disabled={disabled}
                className={inputClass('customerEmail', false)}
              />
            </div>
          </div>

          {/* ============ Full Address ============ */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
              Full Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.shippingAddress}
              onChange={(e) => update('shippingAddress', e.target.value)}
              onBlur={() => handleBlur('shippingAddress')}
              placeholder="Enter your address"
              required
              rows={3}
              disabled={disabled}
              className={`${inputClass('shippingAddress')} resize-none`}
            />
            {hasError('shippingAddress') && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />
                Address is required
              </p>
            )}
          </div>

          {/* ============ City ============ */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.shippingCity}
              onChange={(e) => update('shippingCity', e.target.value)}
              onBlur={() => handleBlur('shippingCity')}
              placeholder="Enter your city"
              required
              disabled={disabled}
              className={inputClass('shippingCity')}
            />
            {hasError('shippingCity') && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />
                City is required
              </p>
            )}
          </div>

          {/* ============ State (Dropdown) + Postal Code ============ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
            {/* State — Beautiful Dropdown */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                State / Province <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={data.shippingState}
                  onChange={(e) => update('shippingState', e.target.value)}
                  onBlur={() => handleBlur('shippingState')}
                  required
                  disabled={disabled}
                  className={`${inputClass('shippingState')} appearance-none pr-10 cursor-pointer`}
                >
                  <option value="">Select your state</option>
                  {PROVINCES.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {/* Custom Dropdown Arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
              {hasError('shippingState') && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} />
                  Please select a state
                </p>
              )}
            </div>

            {/* Postal Code (Optional) */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Postal Code{' '}
                <span className="text-brand-text-muted text-[10px] sm:text-xs">
                  (Optional)
                </span>
              </label>
              <input
                type="text"
                value={data.shippingPostalCode}
                onChange={(e) => update('shippingPostalCode', e.target.value)}
                placeholder="Enter your postal code"
                disabled={disabled}
                className={inputClass('shippingPostalCode', false)}
              />
            </div>
          </div>

          {/* Hidden Country Field — Always Pakistan */}
          <input type="hidden" value="Pakistan" readOnly />

          {/* ============ Notes (Optional) ============ */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
              Order Notes{' '}
              <span className="text-brand-text-muted text-[10px] sm:text-xs">
                (Optional)
              </span>
            </label>
            <textarea
              value={data.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Any special instructions for your order..."
              rows={3}
              disabled={disabled}
              className={`${inputClass('notes', false)} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* ============ Payment Method ============ */}
      <div className="bg-brand-cream rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8">
        <h2 className="font-heading font-semibold text-xl sm:text-2xl text-brand-green mb-4 sm:mb-6">
          Select Payment Method
        </h2>

        <motion.label
          whileHover={{ scale: 1.01 }}
          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-brand-green bg-white rounded-lg cursor-pointer"
        >
          <input
            type="radio"
            name="payment"
            defaultChecked
            className="w-4 h-4 sm:w-5 sm:h-5 accent-brand-green cursor-pointer"
          />
          <div className="flex-1">
            <p className="font-semibold text-xs sm:text-sm md:text-base text-brand-text-dark mb-0.5 sm:mb-1">
              Cash on Delivery (COD)
            </p>
            <p className="text-[10px] sm:text-xs md:text-sm text-brand-text-muted">
              Pay with cash when your order is delivered to your doorstep.
            </p>
          </div>
          <CreditCard size={22} className="text-brand-green shrink-0" />
        </motion.label>
      </div>
    </motion.div>
  );
}