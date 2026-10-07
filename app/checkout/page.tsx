'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Truck,
  CreditCard,
  User,
  MapPin,
  Lock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/types/cart';
import { useAuth } from '@/hooks/useAuth';
import { getSiteSettings } from '@/services/settings/settingsService';
import { createOrder } from '@/services/orders/orderService';
import { trackBeginCheckout } from '@/lib/analytics/events';

interface CheckoutFormData {
  customer_name: string;
  customer_name_urdu: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  shipping_address_urdu: string;
  shipping_city: string;
  shipping_city_urdu: string;
  shipping_state: string;
  shipping_state_urdu: string;
  shipping_postal_code: string;
  shipping_country: string;
  payment_method: 'cod' | 'bank_transfer';
  notes: string;
}

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu & Kashmir',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getSubtotal, clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [shippingFee, setShippingFee] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
  const [bankTransferEnabled, setBankTransferEnabled] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_name: '',
    customer_name_urdu: '',
    customer_phone: '',
    customer_email: '',
    shipping_address: '',
    shipping_address_urdu: '',
    shipping_city: '',
    shipping_city_urdu: '',
    shipping_state: '',
    shipping_state_urdu: '',
    shipping_postal_code: '',
    shipping_country: 'Pakistan',
    payment_method: 'cod',
    notes: '',
  });

  // Load settings
  useEffect(() => {
    async function load() {
      const settings = await getSiteSettings();
      if (settings) {
        setShippingFee(settings.shipping_fee || 0);
        setFreeShippingThreshold(settings.free_shipping_threshold || 0);
      }
      setLoading(false);
    }
    load();
  }, []);

  // ✅ AUTO-FILL FROM PROFILE (if logged in)
  useEffect(() => {
    async function loadProfileAndAddress() {
      if (!user) return;

      const { getProfile, getDefaultAddress } = await import(
        '@/services/profile/profileService'
      );

      const [profile, address] = await Promise.all([
        getProfile(user.id),
        getDefaultAddress(user.id),
      ]);

      setFormData((prev) => ({
        ...prev,
        customer_email: prev.customer_email || user.email || '',
        customer_name:
          prev.customer_name || profile?.full_name || address?.full_name || '',
        customer_phone:
          prev.customer_phone || profile?.phone || address?.phone || '',
        shipping_address: prev.shipping_address || address?.street || '',
        shipping_city: prev.shipping_city || address?.city || '',
        shipping_state: prev.shipping_state || address?.state || '',
        shipping_postal_code:
          prev.shipping_postal_code || address?.postal_code || '',
        shipping_country:
          prev.shipping_country || address?.country || 'Pakistan',
      }));
    }

    loadProfileAndAddress();
  }, [user]);

  // ✅ BeginCheckout tracking
  useEffect(() => {
    if (!loading && items.length > 0 && !success) {
      trackBeginCheckout(
        items.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        getSubtotal()
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Redirect if cart empty
  useEffect(() => {
    if (!loading && items.length === 0 && !success) {
      router.push('/cart');
    }
  }, [loading, items.length, success, router]);

  const subtotal = getSubtotal();
  // ✅ FREE delivery — sab ke liye (threshold 0 hai toh hamesha 0)
  const shipping = freeShippingThreshold === 0 ? 0 : (subtotal >= freeShippingThreshold ? 0 : shippingFee);
  const total = subtotal + shipping;

  const update = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const hasError = (field: keyof CheckoutFormData, required: boolean = true) => {
    if (!required) return false;
    if (!touched[field]) return false;
    return !formData[field]?.trim();
  };

  const inputClass = (field: keyof CheckoutFormData, required: boolean = true) => {
    const baseClass =
      'w-full bg-white border rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-brand-text-dark focus:outline-none focus:ring-2 disabled:opacity-60 transition-colors';
    const errorClass = hasError(field, required)
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-brand-green focus:border-brand-green';
    return `${baseClass} ${errorClass}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setTouched({
      customer_name: true,
      customer_phone: true,
      shipping_address: true,
      shipping_city: true,
      shipping_state: true,
    });

    if (!formData.customer_name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.customer_phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    if (formData.customer_phone.replace(/\D/g, '').length < 11) {
      setError('Please enter a valid phone number (11 digits).');
      return;
    }
    if (!formData.shipping_address.trim()) {
      setError('Please enter your shipping address.');
      return;
    }
    if (!formData.shipping_city.trim()) {
      setError('Please enter your city.');
      return;
    }
    if (!formData.shipping_state.trim()) {
      setError('Please select your state.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await createOrder({
        customerName: formData.customer_name.trim(),
        customerPhone: formData.customer_phone.trim(),
        customerEmail: formData.customer_email.trim(),
        shippingAddress: formData.shipping_address.trim(),
        shippingCity: formData.shipping_city.trim(),
        shippingState: formData.shipping_state.trim(),
        shippingPostalCode: formData.shipping_postal_code.trim(),
        shippingCountry: formData.shipping_country.trim() || 'Pakistan',
        subtotal,
        shippingFee: shipping,
        discount: 0,
        total,
        notes: formData.notes.trim() || undefined,
        items: items.map((item: CartItem) => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.name,
          variantName: item.variantName,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
      });

      if (!result.success || !result.orderNumber) {
        setError(result.error || 'Failed to place order. Please try again.');
        setSubmitting(false);
        return;
      }

      setOrderNumber(result.orderNumber);
      setSuccess(true);
      clearCart();

      setTimeout(() => {
        router.push(`/order-success?order=${result.orderNumber}`);
      }, 2000);
    } catch (err: any) {
      console.error('Order error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-brand-green mx-auto mb-3"
          />
          <p className="text-sm text-brand-text-muted">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // SUCCESS
  if (success) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-5"
          >
            <CheckCircle2 size={40} className="text-green-600" />
          </motion.div>
          <h1 className="font-heading font-bold text-2xl text-brand-green mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-brand-text-muted mb-2">
            Your order number is:
          </p>
          <p className="font-heading font-bold text-xl text-brand-green mb-5">
            #{orderNumber}
          </p>
          <p className="text-xs text-brand-text-muted mb-6">
            We'll contact you shortly to confirm your order.
          </p>
          <Loader2
            size={20}
            className="animate-spin text-brand-green mx-auto"
          />
          <p className="text-xs text-brand-text-muted mt-2">Redirecting...</p>
        </motion.div>
      </div>
    );
  }

  // EMPTY CART
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag
            size={48}
            className="text-brand-text-muted mx-auto mb-4"
          />
          <p className="text-sm text-brand-text-muted mb-4">
            Your cart is empty.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-green hover:bg-black text-white font-medium px-6 py-3 rounded-md transition-colors text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // MAIN CHECKOUT FORM
  return (
    <div className="min-h-screen bg-brand-cream py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-brand-text-muted hover:text-brand-green transition-colors mb-5 sm:mb-6"
        >
          <ArrowLeft size={14} />
          Back to Cart
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-brand-green mb-2">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted">
            Complete your order details below.
          </p>
        </motion.div>

        {/* ✅ Guest Notice */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center gap-2 mb-5"
          >
            <User size={14} className="text-blue-600 shrink-0" />
            <p className="text-xs sm:text-sm text-blue-700">
              You are checking out as a guest.{' '}
              <Link
                href="/login?redirect=/checkout"
                className="font-semibold underline"
              >
                Login
              </Link>{' '}
              or{' '}
              <Link
                href="/register?redirect=/checkout"
                className="font-semibold underline"
              >
                Register
              </Link>{' '}
              for faster checkout.
            </p>
          </motion.div>
        )}

        {/* ✅ Logged in Notice */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center gap-2 mb-5"
          >
            <Lock size={14} className="text-green-600 shrink-0" />
            <p className="text-xs sm:text-sm text-green-700">
              You are logged in as <strong>{user.email}</strong>
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4 flex items-start gap-2.5 mb-5"
          >
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-600">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
            <div className="lg:col-span-2 space-y-5 sm:space-y-6">
              {/* Section 1: Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 pb-4 border-b border-gray-100">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                    <User size={16} className="text-brand-green" />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-base sm:text-lg text-brand-text-dark">
                      Contact Information
                    </h2>
                    <p className="text-[10px] sm:text-xs text-brand-text-muted">
                      How can we reach you?
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => update('customer_name', e.target.value)}
                      onBlur={() => handleBlur('customer_name')}
                      placeholder="Enter your name"
                      required
                      className={inputClass('customer_name')}
                    />
                    {hasError('customer_name') && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={11} />
                        Name is required
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.customer_phone}
                        onChange={(e) =>
                          update('customer_phone', e.target.value)
                        }
                        onBlur={() => handleBlur('customer_phone')}
                        placeholder="Enter your phone number"
                        required
                        className={inputClass('customer_phone')}
                      />
                      {hasError('customer_phone') && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={11} />
                          Phone is required
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                        Email Address{' '}
                        <span className="text-brand-text-muted text-[10px] sm:text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) =>
                          update('customer_email', e.target.value)
                        }
                        placeholder="Enter your email"
                        className={inputClass('customer_email', false)}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Section 2: Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 pb-4 border-b border-gray-100">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-brand-green" />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-base sm:text-lg text-brand-text-dark">
                      Shipping Address
                    </h2>
                    <p className="text-[10px] sm:text-xs text-brand-text-muted">
                      Where should we deliver?
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.shipping_address}
                      onChange={(e) =>
                        update('shipping_address', e.target.value)
                      }
                      onBlur={() => handleBlur('shipping_address')}
                      placeholder="Enter your address"
                      required
                      rows={3}
                      className={`${inputClass(
                        'shipping_address'
                      )} resize-none`}
                    />
                    {hasError('shipping_address') && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={11} />
                        Address is required
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_city}
                      onChange={(e) => update('shipping_city', e.target.value)}
                      onBlur={() => handleBlur('shipping_city')}
                      placeholder="Enter your city"
                      required
                      className={inputClass('shipping_city')}
                    />
                    {hasError('shipping_city') && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={11} />
                        City is required
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                        State / Province <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.shipping_state}
                          onChange={(e) =>
                            update('shipping_state', e.target.value)
                          }
                          onBlur={() => handleBlur('shipping_state')}
                          required
                          className={`${inputClass(
                            'shipping_state'
                          )} appearance-none pr-10 cursor-pointer`}
                        >
                          <option value="">Select your state</option>
                          {PROVINCES.map((province) => (
                            <option key={province} value={province}>
                              {province}
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
                      {hasError('shipping_state') && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={11} />
                          Please select a state
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-brand-text-dark mb-1.5 sm:mb-2">
                        Postal Code{' '}
                        <span className="text-brand-text-muted text-[10px] sm:text-xs">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.shipping_postal_code}
                        onChange={(e) =>
                          update('shipping_postal_code', e.target.value)
                        }
                        placeholder="Enter your postal code"
                        className={inputClass('shipping_postal_code', false)}
                      />
                    </div>
                  </div>

                  <input
                    type="hidden"
                    value={formData.shipping_country}
                    readOnly
                  />
                </div>
              </motion.div>

              {/* Section 3: Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 pb-4 border-b border-gray-100">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                    <CreditCard size={16} className="text-brand-green" />
                  </div>
                  <div>
                    <h2 className="font-heading font-semibold text-base sm:text-lg text-brand-text-dark">
                      Payment Method
                    </h2>
                    <p className="text-[10px] sm:text-xs text-brand-text-muted">
                      How would you like to pay?
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.payment_method === 'cod'
                        ? 'border-brand-green bg-brand-green/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={formData.payment_method === 'cod'}
                      onChange={(e) =>
                        update('payment_method', e.target.value)
                      }
                      className="mt-0.5 accent-brand-green"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-brand-text-dark">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-[10px] sm:text-xs text-brand-text-muted mt-0.5">
                        Pay when you receive your order.
                      </p>
                    </div>
                  </label>

                  {bankTransferEnabled && (
                    <label
                      className={`flex items-start gap-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        formData.payment_method === 'bank_transfer'
                          ? 'border-brand-green bg-brand-green/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value="bank_transfer"
                        checked={formData.payment_method === 'bank_transfer'}
                        onChange={(e) =>
                          update('payment_method', e.target.value)
                        }
                        className="mt-0.5 accent-brand-green"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-brand-text-dark">
                          Bank Transfer
                        </p>
                        <p className="text-[10px] sm:text-xs text-brand-text-muted mt-0.5">
                          Pay via direct bank transfer.
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </motion.div>

              {/* Section 4: Order Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6"
              >
                <h2 className="font-heading font-semibold text-base sm:text-lg text-brand-text-dark mb-3">
                  Order Notes{' '}
                  <span className="text-brand-text-muted text-[10px] sm:text-xs">
                    (Optional)
                  </span>
                </h2>
                <textarea
                  value={formData.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  placeholder="Any special instructions for your order..."
                  rows={3}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                />
              </motion.div>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="lg:sticky lg:top-6 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <h2 className="font-heading font-semibold text-base sm:text-lg text-brand-text-dark mb-4 sm:mb-5 pb-4 border-b border-gray-100">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item: CartItem) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-brand-cream rounded-md overflow-hidden shrink-0">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-brand-text-dark line-clamp-2">
                          {item.name}
                        </p>

                        {item.variantName && (
                          <p className="text-[10px] sm:text-xs text-brand-text-muted">
                            Option: {item.variantName}
                          </p>
                        )}

                        <p className="text-[10px] sm:text-xs text-brand-text-muted">
                          Qty: {item.quantity} × Rs{' '}
                          {item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-brand-text-dark shrink-0">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-brand-text-muted">Subtotal</span>
                    <span className="font-medium text-brand-text-dark">
                      Rs {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-brand-text-muted">Shipping</span>
                    <span className="font-medium text-brand-green">
                      {shipping === 0 ? 'FREE' : `Rs ${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-[10px] sm:text-xs text-green-600 flex items-center gap-1">
                      <Truck size={11} />
                      Free delivery applied!
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="font-heading font-semibold text-sm sm:text-base text-brand-green">
                      Total
                    </span>
                    <span className="font-heading font-bold text-base sm:text-lg text-brand-green">
                      Rs {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-5 bg-brand-green hover:bg-black text-white font-medium py-3 sm:py-3.5 rounded-md transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      Place Order
                    </>
                  )}
                </button>

                <p className="text-[10px] sm:text-xs text-brand-text-muted text-center mt-3">
                  By placing this order, you agree to our terms.
                </p>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}