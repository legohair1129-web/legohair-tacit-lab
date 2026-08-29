"use client";

import { Button } from "@/components/ui/Button";

export function StepShell({
  eyebrow,
  title,
  subtitle,
  stepIndex,
  totalSteps,
  onBack,
  onNext,
  nextLabel = "次へ",
  nextDisabled = false,
  nextLoading = false,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  children: React.ReactNode;
}) {
  return (
    // The action bar below is fixed at `--footer-h` tall, sitting just above
    // BottomNav (--bottom-nav-total) rather than at the true viewport bottom
    // — content padding must clear both stacked bars, not just one.
    <div
      className="flex min-h-dvh flex-col px-6 pt-6"
      style={{ paddingBottom: "calc(var(--footer-h) + var(--bottom-nav-total))" }}
    >
      <div className="mb-6 flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= stepIndex ? "bg-foreground" : "bg-border"}`}
          />
        ))}
      </div>

      <p className="text-xs tracking-[0.2em] text-muted">{eyebrow}</p>
      <h1 className="mt-2 text-xl font-medium leading-snug">{title}</h1>
      {subtitle && <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>}

      <div className="mt-6 flex-1">{children}</div>

      <div
        className="fixed inset-x-0 z-30 border-t border-border bg-surface/95 px-6 py-4 backdrop-blur"
        style={{ height: "var(--footer-h)", bottom: "var(--bottom-nav-total)" }}
      >
        <div className="mx-auto flex max-w-lg items-center gap-3">
          {onBack && (
            <Button variant="secondary" type="button" onClick={onBack} className="w-auto px-6">
              戻る
            </Button>
          )}
          <Button type="button" onClick={onNext} disabled={nextDisabled || nextLoading}>
            {nextLoading ? "保存中…" : nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
