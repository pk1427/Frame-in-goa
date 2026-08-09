"use client";

import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-mono text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3";

  const variants = {
    primary: "bg-coral text-cream hover:bg-ink",
    secondary: "border border-ink text-ink hover:bg-sand",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}
