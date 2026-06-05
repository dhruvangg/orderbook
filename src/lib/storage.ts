const STORAGE_KEYS = {
  ITEMS: 'orderbook-items',
  PHONE: 'orderbook-phone',
  LANG: 'orderbook-lang',
} as const;

export function saveItems(items: unknown[]): void {
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
}

export function loadItems<T>(): T[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePhone(phone: string): void {
  localStorage.setItem(STORAGE_KEYS.PHONE, phone);
}

export function loadPhone(): string {
  return localStorage.getItem(STORAGE_KEYS.PHONE) || '';
}

export function saveLanguage(lang: string): void {
  localStorage.setItem(STORAGE_KEYS.LANG, lang);
}

export function loadLanguage(): string {
  return localStorage.getItem(STORAGE_KEYS.LANG) || 'en';
}

export function clearItems(): void {
  localStorage.removeItem(STORAGE_KEYS.ITEMS);
}
