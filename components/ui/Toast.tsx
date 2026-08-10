"use client";

import { useEffect, useRef } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onDismiss: () => void;
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setTimeout(onDismiss, 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onDismiss]);

  const styles = {
    success: "bg-pink text-white border-pink",
    error: "bg-accent text-ink border-accent",
    info: "bg-accent text-ink border-accent",
  };

  return (
    <div
      className={`w-full py-3 px-4 rounded-lg font-mono text-sm uppercase tracking-wider border transition-colors`}
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
      onClick={onDismiss}
    >
      <div className={`h-full w-full rounded ${styles[type]}`}>
        <div className="flex items-center justify-between">
          <span className="px-1">{message}</span>
        </div>
      </div>
    </div>
  );
}
