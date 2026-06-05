import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { OrderPayload } from '@/types';

export function compressPayload(payload: OrderPayload): string {
  const json = JSON.stringify(payload);
  return compressToEncodedURIComponent(json);
}

export function decompressPayload(compressed: string): OrderPayload | null {
  try {
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    return JSON.parse(json) as OrderPayload;
  } catch {
    return null;
  }
}

export function generateShareUrl(payload: OrderPayload): string {
  const compressed = compressPayload(payload);
  const base = window.location.origin;
  return `${base}/shop?data=${compressed}`;
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

export function generateInvoiceText(
  items: { name: string; qty: number; unit: string; price: number }[]
): string {
  const lines = items
    .filter((item) => item.price > 0)
    .map((item) => `${item.name} (${item.qty} ${item.unit}) - ₹${item.price}`);

  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

  return `📋 *OrderBook Invoice*\n\n${lines.join('\n')}\n\n*Total: ₹${total}*`;
}
