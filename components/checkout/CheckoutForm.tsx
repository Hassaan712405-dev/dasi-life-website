'use client';

import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

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

export default function CheckoutForm({
  data,
  onChange,
  disabled,
}: CheckoutFormProps) {
  const update = (field: keyof ShippingInfo, value: string) => {
    onChange({ ...data, [field]: value });
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
          {/* Full Name (English) */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
              Full Name (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.customerName}
              onChange={(e) => update('customerName', e.target.value)}
              placeholder="M. Sadiq"
              required
              disabled={disabled}
              className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
            />
          </div>

          {/* Full Name (Urdu) */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2 urdu-text">
              پورا نام (اردو میں)
            </label>
            <input
              type="text"
              value={data.customerNameUrdu}
              onChange={(e) => update('customerNameUrdu', e.target.value)}
              placeholder="ایم صادق"
              dir="rtl"
              disabled={disabled}
              className="urdu-text w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
            />
            <p className="text-[10px] sm:text-xs text-brand-text-muted mt-1">
              Print label par Urdu mein naam aayega.
            </p>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={data.customerPhone}
                onChange={(e) => update('customerPhone', e.target.value)}
                placeholder="0344-5063248"
                required
                disabled={disabled}
                className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={data.customerEmail}
                onChange={(e) => update('customerEmail', e.target.value)}
                placeholder="zainab@example.com"
                required
                disabled={disabled}
                className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>
          </div>

          {/* Street Address (English) */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
              Street Address (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.shippingAddress}
              onChange={(e) => update('shippingAddress', e.target.value)}
              placeholder="Post Office Saidu Sharif GPO, Saidu Sharif"
              required
              disabled={disabled}
              className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
            />
          </div>

          {/* Street Address (Urdu) */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2 urdu-text">
              مکمل پتہ (اردو میں)
            </label>
            <input
              type="text"
              value={data.shippingAddressUrdu}
              onChange={(e) => update('shippingAddressUrdu', e.target.value)}
              placeholder="پوسٹ آفس سیدو شریف جی پی او، سیدو شریف"
              dir="rtl"
              disabled={disabled}
              className="urdu-text w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
            />
          </div>

          {/* City (English) + City (Urdu) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                City (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.shippingCity}
                onChange={(e) => update('shippingCity', e.target.value)}
                placeholder="Saidu Sharif"
                required
                disabled={disabled}
                className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2 urdu-text">
                شہر (اردو میں)
              </label>
              <input
                type="text"
                value={data.shippingCityUrdu}
                onChange={(e) => update('shippingCityUrdu', e.target.value)}
                placeholder="سیدو شریف"
                dir="rtl"
                disabled={disabled}
                className="urdu-text w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>
          </div>

          {/* State (English) + State (Urdu) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                State / Province (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.shippingState}
                onChange={(e) => update('shippingState', e.target.value)}
                placeholder="Khyber Pakhtunkhwa"
                required
                disabled={disabled}
                className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2 urdu-text">
                صوبہ (اردو میں)
              </label>
              <input
                type="text"
                value={data.shippingStateUrdu}
                onChange={(e) => update('shippingStateUrdu', e.target.value)}
                placeholder="خیبر پختونخوا"
                dir="rtl"
                disabled={disabled}
                className="urdu-text w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>
          </div>

          {/* Postal + Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.shippingPostalCode}
                onChange={(e) => update('shippingPostalCode', e.target.value)}
                placeholder="19200"
                required
                disabled={disabled}
                className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.shippingCountry}
                onChange={(e) => update('shippingCountry', e.target.value)}
                required
                disabled={disabled}
                className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
              Order Notes (Optional)
            </label>
            <textarea
              value={data.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Any special instructions for your order..."
              rows={3}
              disabled={disabled}
              className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-60 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
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