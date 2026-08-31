import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--ng-pop)] text-white hover:opacity-90 disabled:opacity-40",
  secondary:
    "border border-[var(--ng-ink)] text-[var(--ng-ink)] hover:bg-[var(--ng-ink)] hover:text-white disabled:opacity-40",
  ghost:
    "text-[var(--ng-ink)] underline underline-offset-4 hover:opacity-70 disabled:opacity-40",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`w-full rounded-full px-6 py-4 text-sm font-bold tracking-wide transition-opacity ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
