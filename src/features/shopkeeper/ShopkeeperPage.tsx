import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { decompressPayload, generateWhatsAppUrl, generateInvoiceText } from '@/lib/sharing';
import type { PricedItem } from '@/types';

export function ShopkeeperPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const data = searchParams.get('data');

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
      price: 0,
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

  const handleSendInvoice = () => {
    if (!payload) return;

    const invoiceItems = pricedItems.map((item) => ({
      name: item.name,
      qty: item.qty,
      unit: item.unit,
      price: item.price,
    }));

    const invoiceText = generateInvoiceText(invoiceItems);
    const url = generateWhatsAppUrl(payload.customerPhone, invoiceText);
    toast(t('shop.invoiceSent'));
    window.open(url, '_blank');
  };

  if (!payload) {
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
              backgroundColor: '#f4f4f5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Send style={{ width: '28px', height: '28px', color: '#a1a1aa' }} />
          </div>
          <p style={{ color: '#71717a', fontSize: '14px', maxWidth: '280px' }}>
            {t('shop.noData')}
          </p>
        </div>
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
