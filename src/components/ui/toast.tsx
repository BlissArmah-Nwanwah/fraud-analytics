import React, { createContext, useContext, useState, useCallback } from "react";

type Toast = { id: string; title: string; description?: string };

const ToastCtx = createContext<{
  toasts: Toast[];
  show: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
} | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
  }, []);
  const dismiss = useCallback((id: string) => setToasts((prev) => prev.filter((x) => x.id !== id)), []);
  return (
    <ToastCtx.Provider value={{ toasts, show, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className="bg-white dark:bg-[#111119] text-sm rounded-md shadow-lg border border-gray-200 dark:border-white/10 px-4 py-3">
            <div className="font-semibold">{t.title}</div>
            {t.description ? <div className="text-gray-600 dark:text-gray-300">{t.description}</div> : null}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

