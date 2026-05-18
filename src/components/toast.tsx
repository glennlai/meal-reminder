import { useEffect } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({
  message,
  visible,
  onDismiss,
  durationMs = 3500,
}: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const id = window.setTimeout(onDismiss, durationMs);
    return () => clearTimeout(id);
  }, [visible, durationMs, onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-[max(1rem,env(safe-area-inset-top))] z-50 w-[min(calc(100%-2rem),24rem)] -translate-x-1/2 rounded-xl bg-brand-900 px-4 py-3 text-center text-sm font-medium text-white shadow-lg"
    >
      {message}
    </div>
  );
}
