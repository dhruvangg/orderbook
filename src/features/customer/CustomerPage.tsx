import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Trash2, Share2, QrCode, Copy } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { saveItems, loadItems, savePhone, loadPhone } from '@/lib/storage';
import { generateShareUrl } from '@/lib/sharing';
import type { OrderItem, Unit } from '@/types';

const UNITS: Unit[] = ['kg', 'g', 'ltr', 'ml', 'pcs', 'pack', 'dozen'];

function createEmptyItem(): OrderItem {
  return {
    id: crypto.randomUUID(),
    name: '',
    qty: 1,
    unit: 'kg',
  };
}

export function CustomerPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<OrderItem[]>(() => {
    const saved = loadItems<OrderItem>();
    return saved.length > 0 ? saved : [createEmptyItem()];
  });
  const [phone, setPhone] = useState(() => loadPhone());
  const [qrOpen, setQrOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Persist items on change
  useEffect(() => {
    saveItems(items);
  }, [items]);

  // Persist phone on change
  useEffect(() => {
    if (phone) {
      savePhone(phone);
    }
  }, [phone]);

  const updateItem = useCallback(
    (id: string, field: keyof OrderItem, value: string | number) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const addItem = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      return filtered.length === 0 ? [createEmptyItem()] : filtered;
    });
  };

  const getValidItems = () =>
    items.filter((item) => item.name.trim() !== '');

  const buildShareUrl = () => {
    const validItems = getValidItems();
    if (validItems.length === 0 || !phone.trim()) {
      toast(t('customer.shareError'), 'error');
      return null;
    }

    const payload = {
      customerPhone: phone.trim(),
      items: validItems.map(({ name, qty, unit }) => ({ name, qty, unit })),
    };

    return generateShareUrl(payload);
  };

  const handleShare = async () => {
    const url = buildShareUrl();
    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t('app.name'),
          text: t('app.tagline'),
          url,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast(t('customer.linkCopied'));
    }
  };

  const handleShowQR = () => {
    const url = buildShareUrl();
    if (!url) return;
    setShareUrl(url);
    setQrOpen(true);
  };

  const handleCopyLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      toast(t('customer.linkCopied'));
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header title={t('customer.title')} />

      <main style={{ maxWidth: '512px', margin: '0 auto', paddingBottom: '120px' }}>
        {/* Order Table */}
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
                    width: '42%',
                  }}
                >
                  {t('customer.item')}
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
                    width: '16%',
                  }}
                >
                  {t('customer.qty')}
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
                    width: '28%',
                  }}
                >
                  {t('customer.unit')}
                </th>
                <th style={{ width: '14%' }} />
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #f4f4f5',
                  }}
                >
                  <td style={{ padding: '6px 8px 6px 12px' }}>
                    <Input
                      id={`item-name-${index}`}
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, 'name', e.target.value)
                      }
                      placeholder={t('customer.enterItemName')}
                      style={{
                        height: '40px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        padding: '0 8px',
                        fontSize: '15px',
                      }}
                    />
                  </td>
                  <td style={{ padding: '6px 4px' }}>
                    <Input
                      id={`item-qty-${index}`}
                      type="number"
                      min={0.1}
                      step={0.5}
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          'qty',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      style={{
                        height: '40px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        textAlign: 'center',
                        padding: '0 4px',
                        fontSize: '15px',
                      }}
                    />
                  </td>
                  <td style={{ padding: '6px 4px' }}>
                    <Select
                      value={item.unit}
                      onValueChange={(val) =>
                        updateItem(item.id, 'unit', val)
                      }
                    >
                      <SelectTrigger
                        id={`item-unit-${index}`}
                        className="h-10 border-0 bg-transparent shadow-none text-center text-sm"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UNITS.map((u) => (
                          <SelectItem key={u} value={u}>
                            {t(`units.${u}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td style={{ padding: '6px 8px 6px 4px', textAlign: 'center' }}>
                    <button
                      id={`remove-item-${index}`}
                      onClick={() => removeItem(item.id)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'transparent',
                        color: '#d4d4d8',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#ef4444';
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#d4d4d8';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      aria-label={t('customer.removeItem')}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Item Button */}
        <div style={{ padding: '8px 16px' }}>
          <button
            id="add-item-btn"
            onClick={addItem}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: '#16a34a',
              fontWeight: 600,
              padding: '8px 0',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            {t('customer.addItem')}
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#e4e4e7', margin: '4px 16px 0' }} />

        {/* WhatsApp Number */}
        <div style={{ padding: '20px 16px 16px' }}>
          <label
            htmlFor="shopkeeper-phone"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#52525b',
              marginBottom: '8px',
            }}
          >
            {t('customer.whatsappNumber')}
          </label>
          <Input
            id="shopkeeper-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('customer.whatsappPlaceholder')}
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* Action Buttons - Fixed Bottom */}
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
          <div style={{ maxWidth: '512px', margin: '0 auto', display: 'flex', gap: '10px' }}>
            <Button
              id="share-btn"
              onClick={handleShare}
              style={{ flex: 1, height: '48px', fontSize: '15px', fontWeight: 600 }}
            >
              <Share2 style={{ width: '18px', height: '18px', marginRight: '8px' }} />
              {t('customer.shareWithShop')}
            </Button>
            <Button
              id="qr-btn"
              variant="outline"
              onClick={handleShowQR}
              style={{ height: '48px', width: '48px', padding: 0 }}
            >
              <QrCode style={{ width: '22px', height: '22px' }} />
            </Button>
          </div>
        </div>
      </main>

      {/* QR Code Dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-xs mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t('customer.qrTitle')}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t('customer.qrDescription')}
            </DialogDescription>
          </DialogHeader>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 0',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e4e4e7',
              }}
            >
              <QRCodeSVG
                value={shareUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#18181b"
                level="M"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="gap-2"
            >
              <Copy style={{ width: '14px', height: '14px' }} />
              {t('customer.copyLink')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
