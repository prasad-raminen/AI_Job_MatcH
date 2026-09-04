'use client';
import { useState, useEffect, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

function ToastItem({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const cls = `toast toast-${toast.type || 'info'} ${exiting ? 'toast-exit' : ''}`;

  return (
    <div className={cls}>
      <span className="toast-icon">{icons[toast.type] || icons.info}</span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={() => { setExiting(true); setTimeout(() => onRemove(toast.id), 300); }}>✕</button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
