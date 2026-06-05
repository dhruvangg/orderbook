import { useState, useEffect, useCallback } from 'react';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

let toastId = 0;
const listeners: Set<(toast: Toast) => void> = new Set();

export function toast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  const id = String(++toastId);
  const t: Toast = { id, message, type };
  listeners.forEach((fn) => fn(t));
}

const BG_COLORS = {
  success: '#16a34a',
  error: '#ef4444',
  info: '#3f3f46',
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== t.id));
    }, 3000);
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => {
      listeners.delete(addToast);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '90vw',
        maxWidth: '360px',
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            fontSize: '14px',
            fontWeight: 500,
            color: '#ffffff',
            backgroundColor: BG_COLORS[t.type || 'success'],
            animation: 'slide-in-from-bottom-2 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
