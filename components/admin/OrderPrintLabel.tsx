'use client';

import { useEffect } from 'react';
import type { OrderWithItems } from '@/types/order';

interface OrderPrintLabelProps {
  order: OrderWithItems;
  storeInfo?: {
    store_name?: string;
    store_address?: string;
    store_phone?: string;
    store_email?: string;
  };
}

export default function OrderPrintLabel({
  order,
  storeInfo,
}: OrderPrintLabelProps) {
  // Live date (print ke din ki)
  const orderDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Auto PDF filename
  useEffect(() => {
    const originalTitle = document.title;

    const handleBeforePrint = () => {
      const safeName = order.customer_name
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_');
      document.title = `${safeName}_${order.order_number}`;
    };

    const handleAfterPrint = () => {
      document.title = originalTitle;
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [order.customer_name, order.order_number]);

  // Store info
  const storeName = storeInfo?.store_name || 'Desi Life';
  const storePhone = storeInfo?.store_phone || '0342-2544495';

  // Real Product Names (Live data from order items)
  const productNames = order.order_items
    ?.map((item) => item.product_name)
    .join(', ') || 'Product Name';

  // Real Phone Numbers (Live data)
  const phoneNumbers = `${order.customer_phone}${
    order.customer_phone_alt ? ` / ${order.customer_phone_alt}` : ''
  }`;

  // Urdu values with fallback
  const customerNameUrdu = order.customer_name_urdu || order.customer_name;
  const cityUrdu = order.shipping_city_urdu || order.shipping_city;
  const stateUrdu = order.shipping_state_urdu || order.shipping_state;

  return (
    <div
      id="print-label"
      className="hidden print:block bg-white text-black w-full"
      style={{
        fontFamily: 'Arial, sans-serif',
        direction: 'ltr',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '2px solid #000',
        }}
      >
        <tbody>
          {/* ================= ROW 1 ================= */}
          <tr>
            {/* Left: Pakistan Post */}
            <td
              style={{
                width: '22%',
                borderRight: '1.5px solid #000',
                borderBottom: '1.5px solid #000',
                padding: '8px',
                verticalAlign: 'top',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ color: '#C8102E', fontSize: '18px', fontWeight: 'bold' }}>
                  ➤
                </div>
                <div style={{ lineHeight: 1.1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#C8102E' }}>
                    PAKISTAN POST
                  </div>
                  <div style={{ fontSize: '11px', color: '#C8102E', fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                    پاکستان پوسٹ
                  </div>
                </div>
              </div>
              
              <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '15px' }}>
                Date: {orderDate}
              </div>
              
              <div style={{ fontSize: '12px', marginTop: '10px', lineHeight: '1.4' }}>
                {productNames}
              </div>
            </td>

            {/* Middle: Customer Details (English) */}
            <td
              style={{
                width: '52%',
                borderRight: '1.5px solid #000',
                borderBottom: '1.5px solid #000',
                padding: '8px 12px',
                verticalAlign: 'top',
              }}
            >
              <div style={{ fontSize: '13px', marginBottom: '4px' }}>To</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                Name: {order.customer_name}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', lineHeight: '1.3', marginBottom: '6px' }}>
                Address: {order.shipping_address}, {order.shipping_city},{' '}
                {order.shipping_state}, {order.shipping_postal_code},{' '}
                {order.shipping_country}
              </div>
            </td>

            {/* Right: Sender Details (PHONE REMOVED) */}
            <td
              style={{
                width: '26%',
                borderBottom: '1.5px solid #000',
                padding: '8px 12px',
                verticalAlign: 'top',
              }}
            >
              <div style={{ fontSize: '13px', marginBottom: '4px' }}>Form</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                {storeName}
              </div>
              <div style={{ fontSize: '14px', lineHeight: '1.3', marginBottom: '6px' }}>
                Rehman Town College Road
                <br />
                Mailsi, Vehari Pakistan
              </div>
              {/* ✅ Phone number removed from here */}
            </td>
          </tr>

          {/* ================= ROW 2 (COD Strip) ================= */}
          <tr>
            <td
              style={{
                borderRight: '1.5px solid #000',
                borderBottom: '1.5px solid #000',
                padding: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
              }}
            >
              COD PKR = {order.total.toLocaleString()}
            </td>
            <td
              style={{
                borderRight: '1.5px solid #000',
                borderBottom: '1.5px solid #000',
                padding: '8px 12px',
                fontSize: '15px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
              }}
            >
              {phoneNumbers}
            </td>
            <td
              style={{
                borderBottom: '1.5px solid #000',
                padding: '8px 12px',
                fontSize: '13px',
                verticalAlign: 'middle',
              }}
            >
              Phone: {storePhone}
            </td>
          </tr>

          {/* ================= ROW 3 ================= */}
          <tr>
            {/* Left: Urdu Instruction */}
            <td
              style={{
                width: '22%',
                borderRight: '1.5px solid #000',
                padding: '10px 8px',
                verticalAlign: 'top',
              }}
            >
              <div
                className="urdu-text"
                style={{
                  fontSize: '14px',
                  lineHeight: '1.8',
                  textAlign: 'right',
                  fontWeight: '500',
                  fontFamily: 'Noto Nastaliq Urdu, serif',
                }}
              >
               جناب پوسٹ مین صاحب آپ سے
                <br />
               گزارش ہے کہ کسٹمر سے رابطہ کر کے
                <br />
               پارسل ڈیلیور کریں۔
                <br />
               بندے سے رابطہ کیے بغیر پار سل واپس نہ بھیجا جائے۔
                <br />
                شکریہ۔ پوسٹ ماسٹر ، میلسی
              </div>
            </td>

            {/* Middle: Urdu Name + Address */}
            <td
              style={{
                borderRight: '1.5px solid #000',
                padding: '10px 12px',
                verticalAlign: 'middle',
                textAlign: 'right',
                fontFamily: 'Noto Nastaliq Urdu, serif',
              }}
            >
              <div
                className="urdu-text"
                style={{
                  fontSize: '18px',
                  lineHeight: '2',
                  fontWeight: 'bold',
                }}
              >
                نام: {customerNameUrdu}
                <br />
                پتہ: {order.shipping_address_urdu || order.shipping_address}, {cityUrdu}, {stateUrdu}، پاکستان
              </div>
            </td>

            {/* Right: Logo + Brand */}
            <td
              style={{
                width: '26%',
                padding: '10px',
                verticalAlign: 'middle',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #1F4A2C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F4A2C', fontWeight: 'bold', fontSize: '20px', backgroundColor: '#F0F7F0' }}>
                  🌿
                </div>
                <div className="urdu-text" style={{ fontSize: '26px', fontWeight: 'bold', color: '#000', fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                  دیسی لائف
                </div>
              </div>
              
              <div style={{ fontSize: '12px', color: '#1F4A2C', fontWeight: 'bold', textDecoration: 'underline' }}>
                www.desilife.store
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}