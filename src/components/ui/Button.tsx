"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "w-full rounded-lg py-3.5 text-base font-medium transition-opacity disabled:opacity-40 active:opacity-70";
  const variants: Record<Variant, string> = {
    primary: "bg-foreground text-background",
    secondary: "border border-border bg-surface text-foreground",
    ghost: "text-muted",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
