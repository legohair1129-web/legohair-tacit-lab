import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "text" | "pink" | "pink-outline";
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  solid:
    "bg-[var(--ng-ink)] text-[var(--ng-ivory)] border border-[var(--ng-ink)] hover:opacity-85",
  outline:
    "border border-[var(--ng-ink)] text-[var(--ng-ink)] hover:bg-[var(--ng-ink)] hover:text-[var(--ng-ivory)]",
  text: "border-b border-[var(--ng-ink)] text-[var(--ng-ink)] px-0 hover:opacity-60",
  // Phase 5 (world-view rebalance): the main pink CTA is no longer a large
  // solid-pink fill - white background, thin pink border, charcoal text.
  // The vivid fill now only shows on hover/tap, per brief.
  pink: "bg-[var(--ng-white)] text-[var(--ng-ink)] border border-[var(--ng-hotpink)] hover:bg-[var(--ng-hotpink)] hover:text-white",
  "pink-outline":
    "border border-[var(--ng-hotpink)] text-[var(--ng-ink)] hover:bg-[var(--ng-hotpink)] hover:text-white",
};

/**
 * Slim, rectangular editorial CTA - text + arrow, not a chunky rounded
 * pill. `text` variant is a bare underline label for secondary actions.
 */
export function Button({
  variant = "solid",
  fullWidth = true,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`ng-sans-en group inline-flex items-center justify-between gap-4 px-6 py-4 text-xs font-semibold tracking-[0.18em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
        fullWidth ? "w-full" : ""
      } ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      <span aria-hidden className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}
