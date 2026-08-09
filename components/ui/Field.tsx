"use client";

import type { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Field({ label, className, ...props }: FieldProps) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ""}`}>
      {label && (
        <span className="font-mono text-xs text-ink/70">{label}</span>
      )}
      <input
        className="w-full rounded-lg border border-sand bg-background px-3 py-3 text-sm text-ink focus:outline-none focus:border-coral"
        {...props}
      />
    </label>
  );
}
