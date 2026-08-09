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
    success: "bg-lagoon text-ink border-lagoon",
    error: "bg-coral text-cream border-coral",
    info: "bg-gold text-ink border-gold",
  };

  return (
    <div
      className={`w-full py-3 px-4 rounded-lg font-mono text-sm border ${styles[type]} shadow-sm cursor-pointer`}
      role="status"
      aria-live="polite"
      onClick={onDismiss}
    >
      {message}
    </div>
  );
}
