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
    "inline-flex items-center justify-center gap-2 rounded-lg font-mono font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 border-2";

  const variants = {
    primary:
      "bg-accent text-ink border-accent hover:bg-primary hover:text-white btn-torn",
    secondary:
      "border-accent text-white bg-transparent hover:bg-offwhite hover:text-ink",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}
