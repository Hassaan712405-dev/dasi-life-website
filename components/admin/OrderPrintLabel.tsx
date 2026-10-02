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
  // ✅ LIVE DATE — Aaj ki date (print ke din ki)
  const orderDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // ✅ AUTO PDF FILENAME — Print ke waqt page title change hoga
  useEffect(() => {
    const originalTitle = document.title;

    const handleBeforePrint = () => {
      // Customer name + order number se safe filename banao
      const safeName = order.customer_name
        .replace(/[^a-zA-Z0-9\s]/g, '') // Special characters hatao
        .replace(/\s+/g, '_'); // Spaces ko underscore karo
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

  const storeName = storeInfo?.store_name || 'Desi Life';
  const storeAddress =
    storeInfo?.store_address ||
    'Rehman Town College Road, Mailsi, Vehari Pakistan, 61200';
  const storePhone = storeInfo?.store_phone || '0342-2544495';

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
          {/* Col 1 (Left)  = Pakistan Post (English + Urdu)                */}
          {/* Col 2 (Middle)= To (Customer — English)                       */}
          {/* Col 3 (Right) = From (Store — English)                        */}
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
                  {/* Red Arrow Logo */}
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

                {/* Date — LIVE */}
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
                    marginTop: '12px',
                  }}
                >
                  P
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
                Address: {order.shipping_address}, {order.shipping_city},
                <br />
                {order.shipping_state}, {order.shipping_postal_code},
                <br />
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
                {order.customer_email ? `, ${order.customer_email}` : ''}
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
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  marginTop: '6px',
                }}
              >
                Phone: {storePhone}
              </div>
            </td>
          </tr>

          {/* ============================================================ */}
          {/* ROW 2: COD + Alternate Phones                                 */}
          {/* ============================================================ */}
          <tr>
            <td
              style={{
                borderRight: '1px solid #000',
                borderBottom: '1px solid #000',
                padding: '6px 8px',
                fontSize: '15px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
              }}
            >
              COD PKR ={order.total.toLocaleString()}
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: '1px solid #000',
                padding: '6px 8px',
                fontSize: '14px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
              }}
            >
              Phone: 0344-5063248, 0340-2119230
            </td>
          </tr>

          {/* ============================================================ */}
          {/* ROW 3: BOTTOM SECTION (3 Columns)                             */}
          {/* Col 1 (Left)  = Urdu Instruction (Postman ke liye)            */}
          {/* Col 2 (Middle)= Urdu Name + Address (Center, Bold)            */}
          {/* Col 3 (Right) = Brand Logo + Urdu Name + Website              */}
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

            {/* ---------- MIDDLE: Urdu Name + Address (BIG & BOLD) ---------- */}
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
                نام: {order.customer_name}
                <br />
                پتہ: ڈاکخانہ {order.shipping_city} جی پی او، {order.shipping_city}،
                تحصیل و ضلع {order.shipping_state}، {order.shipping_country}۔
              </div>
            </td>

            {/* ---------- RIGHT: Brand Logo + Urdu Name + Website ---------- */}
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
                {/* Green Circle Logo */}
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
                }}
              >
                www.desilife.store
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}