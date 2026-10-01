'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CheckoutForm, { ShippingInfo } from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/contexts/SettingsContext';
import { calculateShippingFee } from '@/services/settings/settingsService';
import { createOrder } from '@/services/orders/orderService';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();

  const [formData, setFormData] = useState<ShippingInfo>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingPostalCode: '',
    shippingCountry: 'Pakistan',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill email if logged in
  useEffect(() => {
    if (user?.email && !formData.customerEmail) {
      setFormData((prev) => ({ ...prev, customerEmail: user.email || '' }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !loading) {
      router.push('/cart');
    }
  }, [items.length, loading, router]);

  // Calculate totals — Shipping from settings
  const subtotal = getSubtotal();
  const shippingFee = settings
    ? calculateShippingFee(subtotal, settings)
    : 0;
  const total = subtotal + shippingFee;

  const orderItems = items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    imageUrl: item.imageUrl,
  }));

  const handlePlaceOrder = async () => {
    setError('');

    if (
      !formData.customerName.trim() ||
      !formData.customerPhone.trim() ||
      !formData.customerEmail.trim() ||
      !formData.shippingAddress.trim() ||
      !formData.shippingCity.trim() ||
      !formData.shippingState.trim() ||
      !formData.shippingPostalCode.trim()
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    const result = await createOrder({
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim(),
      customerEmail: formData.customerEmail.trim(),
      shippingAddress: formData.shippingAddress.trim(),
      shippingCity: formData.shippingCity.trim(),
      shippingState: formData.shippingState.trim(),
      shippingPostalCode: formData.shippingPostalCode.trim(),
      shippingCountry: formData.shippingCountry.trim(),
      subtotal,
      shippingFee,
      discount: 0,
      total,
      notes: formData.notes.trim() || undefined,
      items: items.map((item) => ({
        productId: item.productId,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });

    if (!result.success) {
      setError(result.error || 'Failed to place order. Please try again.');
      setLoading(false);
      return;
    }

    // Clear cart
    clearCart();

    router.push(`/order-success?order=${result.orderNumber}`);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="container-custom pt-6 md:pt-8 pb-12 md:pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-brand-text-muted mb-4">
          <Link href="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/cart" className="hover:text-brand-green transition-colors">
            Cart
          </Link>
          <ChevronRight size={14} />
          <span className="text-brand-green font-medium">Checkout</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-brand-green mb-8">
          Checkout
        </h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-3 md:gap-6 mb-10 md:mb-12">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-green text-white flex items-center justify-center text-sm font-semibold shrink-0">
              1
            </div>
            <span className="text-sm md:text-base font-medium text-brand-green">
              Shipping
            </span>
          </div>

          <div className="flex-1 h-px bg-gray-300" />

          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center text-sm font-semibold shrink-0">
              2
            </div>
            <span className="text-sm md:text-base text-brand-text-muted">
              Payment
            </span>
          </div>

          <div className="flex-1 h-px bg-gray-300" />

          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-semibold shrink-0">
              3
            </div>
            <span className="text-sm md:text-base text-brand-text-muted">
              Review
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3 max-w-3xl">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <CheckoutForm
            data={formData}
            onChange={setFormData}
            disabled={loading}
          />

          <OrderSummary
            items={orderItems}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={total}
            onPlaceOrder={handlePlaceOrder}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}