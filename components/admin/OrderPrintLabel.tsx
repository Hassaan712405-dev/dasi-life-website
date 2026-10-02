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
  const storeAddress =
    storeInfo?.store_address ||
    'Rehman Town College Road, Mailsi, Vehari Pakistan, 61200';
  const storePhone = storeInfo?.store_phone || '0342-2544495';

  // Urdu values with fallback (agar Urdu field khali ho to English use karo)
  const customerNameUrdu = order.customer_name_urdu || order.customer_name;
  const cityUrdu = order.shipping_city_urdu || order.shipping_city;
  const stateUrdu = order.shipping_state_urdu || order.shipping_state;

  return (
    <div
      id="print-label"
      className="hidden print:block bg-white text-black"
      style={{
        width: '100%',
        fontFamily: 'Arial, sans-serif',
        direction: 'ltr',
      }}
    >
      {/* ============ MAIN TABLE ============ */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '2px solid #000',
        }}
      >
        <tbody>
          {/* ============================================================ */}
          {/* ROW 1: TOP SECTION (3 Columns)                                */}
          {/* ============================================================ */}
          <tr>
            {/* ---------- LEFT: Pakistan Post ---------- */}
            <td
              style={{
                width: '25%',
                borderRight: '1px solid #000',
                borderBottom: '1px solid #000',
                padding: '6px 8px',
                verticalAlign: 'top',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                {/* Pakistan Post Logo Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    marginBottom: '4px',
                  }}
                >
                  <div
                    style={{
                      color: '#C8102E',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      lineHeight: 1,
                    }}
                  >
                    ➤
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#C8102E',
                        letterSpacing: '0.3px',
                        lineHeight: 1.1,
                      }}
                    >
                      PAKISTAN POST
                    </div>
                    <div
                      className="urdu-text"
                      style={{
                        fontSize: '11px',
                        color: '#C8102E',
                        lineHeight: 1.4,
                        fontWeight: 'bold',
                      }}
                    >
                      پاکستان پوسٹ
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    marginTop: '12px',
                  }}
                >
                  Date: {orderDate}
                </div>

                {/* P */}
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    marginTop: '10px',
                  }}
                >
                  P
                </div>

                {/* Track ID — Order Number */}
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    marginTop: '8px',
                  }}
                >
                  Track ID: {order.order_number}
                </div>
              </div>
            </td>

            {/* ---------- MIDDLE: To (Customer — English) ---------- */}
            <td
              style={{
                width: '50%',
                borderRight: '1px solid #000',
                borderBottom: '1px solid #000',
                padding: '6px 8px',
                verticalAlign: 'top',
              }}
            >
              <div style={{ fontSize: '12px', marginBottom: '3px' }}>To</div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}
              >
                Name: {order.customer_name}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  lineHeight: '1.45',
                  marginBottom: '4px',
                  textDecoration: 'underline',
                }}
              >
                Address: {order.shipping_address}, {order.shipping_city},{' '}
                {order.shipping_state}, {order.shipping_postal_code},{' '}
                {order.shipping_country}.
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginTop: '6px',
                }}
              >
                Phone: {order.customer_phone}
              </div>
            </td>

            {/* ---------- RIGHT: From (Store — English) ---------- */}
            <td
              style={{
                width: '25%',
                borderBottom: '1px solid #000',
                padding: '6px 8px',
                verticalAlign: 'top',
              }}
            >
              <div style={{ fontSize: '12px', marginBottom: '3px' }}>Form</div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}
              >
                {storeName}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: '1.45',
                  marginBottom: '4px',
                  textDecoration: 'underline',
                }}
              >
                Rehman Town College Road
                <br />
                Mailsi, Vehari Pakistan
                <br />
                61200
              </div>
            </td>
          </tr>

          {/* ============================================================ */}
          {/* ROW 2: COD ONLY                                               */}
          {/* ============================================================ */}
          <tr>
            <td
              colSpan={3}
              style={{
                borderBottom: '1px solid #000',
                padding: '6px 8px',
                fontSize: '15px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
              }}
            >
              COD PKR ={order.total.toLocaleString()}
            </td>
          </tr>

          {/* ============================================================ */}
          {/* ROW 3: BOTTOM SECTION (3 Columns)                             */}
          {/* ============================================================ */}
          <tr>
            {/* ---------- LEFT: Urdu Instruction ---------- */}
            <td
              style={{
                width: '25%',
                borderRight: '1px solid #000',
                padding: '8px 10px',
                verticalAlign: 'top',
              }}
            >
              <div
                className="urdu-text"
                style={{
                  fontSize: '13px',
                  lineHeight: '1.9',
                  textAlign: 'right',
                  fontWeight: '500',
                }}
              >
                جناب پوسٹ مین صاحب آپ سے
                <br />
                گزارش ہے کہ کسٹمر سے رابطہ کر کے
                <br />
                پارسل ڈیلیور کریں۔ بندے سے
                <br />
                رابطہ کیے بغیر پارسل واپس نہ بھیجا
                <br />
                جائے۔ شکریہ۔ پوسٹ ماسٹر، میلسی
              </div>
            </td>

            {/* ---------- MIDDLE: Urdu Name + Address ---------- */}
            <td
              style={{
                borderRight: '1px solid #000',
                padding: '10px 12px',
                verticalAlign: 'middle',
                textAlign: 'center',
              }}
            >
              <div
                className="urdu-text"
                style={{
                  fontSize: '20px',
                  lineHeight: '2.2',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                نام: {customerNameUrdu}
                <br />
                پتہ: ڈاکخانہ {cityUrdu} جی پی او، {cityUrdu}،
                <br />
                تحصیل و ضلع {stateUrdu}، پاکستان۔
              </div>
            </td>

            {/* ---------- RIGHT: Logo + Brand + Website + Phone ---------- */}
            <td
              style={{
                width: '25%',
                padding: '8px',
                verticalAlign: 'middle',
                textAlign: 'center',
              }}
            >
              {/* Logo + Brand Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '6px',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '2px solid #1F4A2C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1F4A2C',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    backgroundColor: '#F0F7F0',
                    flexShrink: 0,
                  }}
                >
                  🌿
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div
                    className="urdu-text"
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#1F4A2C',
                      lineHeight: 1.3,
                    }}
                  >
                    دیسی
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#1F4A2C',
                      letterSpacing: '0.5px',
                      lineHeight: 1.1,
                    }}
                  >
                    DESI LIFE
                  </div>
                </div>
              </div>

              {/* Urdu Brand Name — Big */}
              <div
                className="urdu-text"
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#000',
                  marginBottom: '4px',
                  lineHeight: 1.4,
                }}
              >
                دیسی لائف
              </div>

              {/* Website */}
              <div
                style={{
                  fontSize: '12px',
                  color: '#1F4A2C',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  marginBottom: '6px',
                }}
              >
                www.desilife.store
              </div>

              {/* Store Phone — Website ke NEECHE */}
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#000',
                }}
              >
                Phone: {storePhone}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}