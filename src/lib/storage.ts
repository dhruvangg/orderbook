const STORAGE_KEYS = {
  ITEMS: 'orderbook-items',
  PHONE: 'orderbook-phone',
  LANG: 'orderbook-lang',
  VERSION: 'orderbook-version',
} as const;

const CURRENT_VERSION = '1';

const memoryStorage: Record<string, string> = {};

let storageType: 'localStorage' | 'sessionStorage' | 'memory' = 'localStorage';

function getStorage(): Storage {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    storageType = 'localStorage';
    return localStorage;
  } catch (e) {
    try {
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      storageType = 'sessionStorage';
      return sessionStorage;
    } catch (e2) {
      storageType = 'memory';
      return {
        getItem: (key: string) => memoryStorage[key] || null,
        setItem: (key: string, value: string) => { memoryStorage[key] = value; },
        removeItem: (key: string) => { delete memoryStorage[key]; },
        clear: () => { for (const k in memoryStorage) { delete memoryStorage[k]; } },
        key: (_index: number) => null,
        length: 0
      } as Storage;
    }
  }
}

const activeStorage = getStorage();

function migrateStorage() {
  try {
    const version = activeStorage.getItem(STORAGE_KEYS.VERSION);
    if (version !== CURRENT_VERSION) {
      if (!version) {
        activeStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
      } else {
        // Clear old stale data if version mismatch
        activeStorage.removeItem(STORAGE_KEYS.ITEMS);
        activeStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
      }
    }
  } catch (e) {
    console.error('Storage migration failed', e);
  }
}

migrateStorage();

export function getStorageType() {
  return storageType;
}

export function saveItems(items: unknown[]): void {
  try {
    activeStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items', e);
  }
}

export function loadItems<T>(): T[] {
  try {
    const data = activeStorage.getItem(STORAGE_KEYS.ITEMS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePhone(phone: string): void {
  try {
    activeStorage.setItem(STORAGE_KEYS.PHONE, phone);
  } catch (e) {
    console.error('Failed to save phone', e);
  }
}

export function loadPhone(): string {
  try {
    return activeStorage.getItem(STORAGE_KEYS.PHONE) || '';
  } catch {
    return '';
  }
}

export function saveLanguage(lang: string): void {
  try {
    activeStorage.setItem(STORAGE_KEYS.LANG, lang);
  } catch (e) {
    console.error('Failed to save language', e);
  }
}

export function loadLanguage(): string {
  try {
    return activeStorage.getItem(STORAGE_KEYS.LANG) || 'en';
  } catch {
    return 'en';
  }
}

export function clearItems(): void {
  try {
    activeStorage.removeItem(STORAGE_KEYS.ITEMS);
  } catch (e) {
    console.error('Failed to clear items', e);
  }
}
