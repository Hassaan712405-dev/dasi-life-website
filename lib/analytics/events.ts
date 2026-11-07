// ============================================
// GA4 EVENTS
// ============================================
export function trackGA4Event(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// ============================================
// META PIXEL EVENTS
// ============================================
export function trackMetaEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
}

// ============================================
// E-COMMERCE EVENTS
// ============================================

// ViewContent / view_item
export function trackViewContent(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) {
  trackGA4Event('view_item', {
    currency: 'PKR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1,
        item_category: product.category,
      },
    ],
  });

  trackMetaEvent('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'PKR',
  });
}

// AddToCart
export function trackAddToCart(item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variantName?: string;
}) {
  trackGA4Event('add_to_cart', {
    currency: 'PKR',
    value: item.price * item.quantity,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
        item_variant: item.variantName,
      },
    ],
  });

  trackMetaEvent('AddToCart', {
    content_ids: [item.id],
    content_name: item.name,
    content_type: 'product',
    value: item.price * item.quantity,
    currency: 'PKR',
  });
}

// BeginCheckout
export function trackBeginCheckout(
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>,
  total: number
) {
  trackGA4Event('begin_checkout', {
    currency: 'PKR',
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });

  trackMetaEvent('InitiateCheckout', {
    content_ids: items.map((i) => i.id),
    contents: items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      item_price: i.price,
    })),
    value: total,
    currency: 'PKR',
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
  });
}

// Purchase
export function trackPurchase(order: {
  orderNumber: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) {
  trackGA4Event('purchase', {
    transaction_id: order.orderNumber,
    currency: 'PKR',
    value: order.total,
    items: order.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });

  trackMetaEvent('Purchase', {
    content_ids: order.items.map((i) => i.id),
    contents: order.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      item_price: i.price,
    })),
    value: order.total,
    currency: 'PKR',
    num_items: order.items.reduce((sum, i) => sum + i.quantity, 0),
  });
}

// Search
export function trackSearch(searchTerm: string) {
  trackGA4Event('search', { search_term: searchTerm });
  trackMetaEvent('Search', { search_string: searchTerm });
}