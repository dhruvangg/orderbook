import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { decompressPayload, generateWhatsAppUrl, generateShareUrl } from '@/lib/sharing';
import type { PricedItem } from '@/types';

export function ShopkeeperPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const data = searchParams.get('data');
  const mode = searchParams.get('mode');
  const isInvoiceMode = mode === 'invoice';

  const payload = useMemo(() => {
    if (!data) return null;
    return decompressPayload(data);
  }, [data]);

  const [pricedItems, setPricedItems] = useState<PricedItem[]>(() => {
    if (!payload) return [];
    return payload.items.map((item, idx) => ({
      id: String(idx),
      name: item.name,
      qty: item.qty,
      unit: item.unit as PricedItem['unit'],
      price: item.price || 0,
    }));
  });

  const total = useMemo(
    () => pricedItems.reduce((sum, item) => sum + (item.price || 0), 0),
    [pricedItems]
  );

  const updatePrice = (id: string, price: number) => {
    setPricedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price } : item))
    );
  };

  const validatePrice = (id: string, val: string) => {
    let parsed = parseFloat(val);
    if (isNaN(parsed) || parsed < 0) {
      parsed = 0;
    } else if (parsed > 1000000) {
      parsed = 1000000;
    }
    updatePrice(id, parsed);
  };

  const handleSendInvoice = () => {
    if (!payload) return;

    const newPayload = {
      customerPhone: payload.customerPhone,
      items: pricedItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        unit: item.unit,
        price: item.price,
      })),
    };

    const shareUrl = generateShareUrl(newPayload);
    const invoiceUrl = `${shareUrl}&mode=invoice`;
    const message = `📋 *OrderBook Invoice*\n\nYour invoice is ready. Please view and download it here:\n${invoiceUrl}`;

    const url = generateWhatsAppUrl(payload.customerPhone, message);
    toast(t('shop.invoiceSent'));
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!payload) {
    const isBroken = data !== null;
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        <Header title={t('shop.title')} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: isBroken ? '#fef2f2' : '#f4f4f5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            {isBroken ? (
              <AlertTriangle style={{ width: '28px', height: '28px', color: '#ef4444' }} />
            ) : (
              <Send style={{ width: '28px', height: '28px', color: '#a1a1aa' }} />
            )}
          </div>
          <p style={{ color: '#71717a', fontSize: '14px', maxWidth: '280px', lineHeight: '1.5' }}>
            {isBroken ? t('shop.brokenLink') : t('shop.noData')}
          </p>
        </div>
      </div>
    );
  }

  if (isInvoiceMode) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Header title={t('shop.invoiceTitle')} />
        <main
          style={{
            maxWidth: '512px',
            margin: '0 auto',
            padding: '24px 16px 120px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Invoice Card */}
          <div
            id="invoice-print-area"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              border: '1px solid #f3f4f6',
              padding: '24px',
            }}
          >
            {/* Invoice Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
                borderBottom: '2px dashed #f3f4f6',
                paddingBottom: '20px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: '#dcfce7',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                    }}
                  >
                    📋
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '18px', color: '#16a34a' }}>
                    {t('app.name')}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>
                  {t('app.tagline')}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#15803d',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {t('shop.invoiceTitle')}
                </span>
                <p style={{ fontSize: '11px', color: '#71717a', marginTop: '6px', marginBottom: 0 }}>
                  {new Date().toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Client Details */}
            <div style={{ marginBottom: '24px', fontSize: '13px', color: '#52525b' }}>
              <span style={{ color: '#71717a', display: 'block', marginBottom: '2px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
                Customer WhatsApp
              </span>
              <span style={{ fontWeight: 600, color: '#18181b', fontSize: '14px' }}>
                {payload.customerPhone}
              </span>
            </div>

            {/* Items Table */}
            <div style={{ marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e4e4e7', paddingBottom: '8px' }}>
                    <th style={{ textAlign: 'left', padding: '8px 0', color: '#71717a', fontWeight: 500, fontSize: '12px' }}>
                      {t('shop.item')}
                    </th>
                    <th style={{ textAlign: 'center', padding: '8px 0', color: '#71717a', fontWeight: 500, fontSize: '12px', width: '20%' }}>
                      {t('shop.qty')}
                    </th>
                    <th style={{ textAlign: 'right', padding: '8px 0', color: '#71717a', fontWeight: 500, fontSize: '12px', width: '25%' }}>
                      {t('shop.price')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pricedItems.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                      <td style={{ padding: '12px 0', fontWeight: 500, color: '#18181b' }}>
                        {item.name}
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'center', color: '#52525b' }}>
                        {item.qty} {t(`units.${item.unit}`)}
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600, color: '#18181b' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grand Total */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #e2e8f0',
              }}
            >
              <span style={{ fontWeight: 600, color: '#475569', fontSize: '14px' }}>
                {t('shop.total')}
              </span>
              <span style={{ fontWeight: 800, color: '#15803d', fontSize: '20px' }}>
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Thank You Note */}
            <div style={{ textAlign: 'center', marginTop: '32px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                Thank you for using OrderBook!
              </p>
            </div>
          </div>

          {/* Action Buttons - Fixed Bottom */}
          <div
            className="fixed-bottom-bar"
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e4e4e7',
              padding: '12px 16px',
              paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
              boxShadow: '0 -2px 10px rgba(0,0,0,0.06)',
              zIndex: 30,
            }}
          >
            <div style={{ maxWidth: '512px', margin: '0 auto', display: 'flex', gap: '10px' }}>
              <Button
                onClick={handlePrint}
                style={{ flex: 1, height: '48px', fontSize: '15px', fontWeight: 600, gap: '8px' }}
              >
                🖨️ {t('shop.printInvoice')}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                style={{ flex: 1, height: '48px', fontSize: '15px', fontWeight: 600 }}
              >
                ➕ Create New Order
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header title={t('shop.title')} />

      <main style={{ maxWidth: '512px', margin: '0 auto', paddingBottom: '120px' }}>
        {/* Pricing Table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              fontSize: '14px',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid #e4e4e7',
                  backgroundColor: '#fafafa',
                }}
              >
                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#71717a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    width: '34%',
                  }}
                >
                  {t('shop.item')}
                </th>
                <th
                  style={{
                    textAlign: 'center',
                    padding: '12px 8px',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#71717a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    width: '14%',
                  }}
                >
                  {t('shop.qty')}
                </th>
                <th
                  style={{
                    textAlign: 'center',
                    padding: '12px 8px',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#71717a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    width: '18%',
                  }}
                >
                  {t('shop.unit')}
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '12px 16px',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#71717a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    width: '34%',
                  }}
                >
                  {t('shop.price')}
                </th>
              </tr>
            </thead>
            <tbody>
              {pricedItems.map((item, index) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: '1px solid #f4f4f5' }}
                >
                  <td
                    style={{
                      padding: '14px 16px',
                      fontWeight: 500,
                      color: '#27272a',
                      fontSize: '15px',
                    }}
                  >
                    {item.name}
                  </td>
                  <td
                    style={{
                      padding: '14px 8px',
                      textAlign: 'center',
                      color: '#52525b',
                    }}
                  >
                    {item.qty}
                  </td>
                  <td
                    style={{
                      padding: '14px 8px',
                      textAlign: 'center',
                      color: '#71717a',
                      fontSize: '13px',
                    }}
                  >
                    {t(`units.${item.unit}`)}
                  </td>
                  <td style={{ padding: '8px 12px 8px 8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <span style={{ color: '#a1a1aa', fontSize: '14px', fontWeight: 500 }}>₹</span>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        min={0}
                        step={1}
                        value={item.price || ''}
                        onChange={(e) =>
                          updatePrice(
                            item.id,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        onBlur={(e) => validatePrice(item.id, e.target.value)}
                        placeholder={t('shop.enterPrice')}
                        style={{
                          height: '40px',
                          width: '90px',
                          textAlign: 'right',
                          fontSize: '16px',
                          fontWeight: 600,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div
          style={{
            padding: '16px 16px',
            borderTop: '2px solid #e4e4e7',
            backgroundColor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#3f3f46' }}>
            {t('shop.total')}
          </span>
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a' }}>
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Send Invoice - Fixed Bottom */}
        <div
          className="fixed-bottom-bar"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e4e4e7',
            padding: '12px 16px',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.06)',
            zIndex: 30,
          }}
        >
          <div style={{ maxWidth: '512px', margin: '0 auto' }}>
            <Button
              id="send-invoice-btn"
              onClick={handleSendInvoice}
              style={{ width: '100%', height: '48px', fontSize: '15px', fontWeight: 600, gap: '8px' }}
              disabled={total === 0}
            >
              <Send style={{ width: '18px', height: '18px' }} />
              {t('shop.sendInvoice')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
