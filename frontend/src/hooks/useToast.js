import { useState, useCallback } from 'react';

let toastId = 0;
const listeners = new Set();

export function toast({ title, message, type = 'info', duration = 4000 }) {
  const id = ++toastId;
  const item = { id, title, message, type, duration };
  listeners.forEach((fn) => fn((prev) => [...prev, item]));
  setTimeout(() => {
    listeners.forEach((fn) => fn((prev) => prev.filter((t) => t.id !== id)));
  }, duration + 300);
  return id;
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((opts) => {
    const id = ++toastId;
    const item = { id, ...opts, type: opts.type || 'info', duration: opts.duration || 4000 };
    setToasts((prev) => [...prev, item]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, item.duration + 300);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

