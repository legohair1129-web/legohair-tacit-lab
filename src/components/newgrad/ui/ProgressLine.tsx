interface ProgressLineProps {
  total: number;
  current: number; // 0-indexed
  /** "ink" (default, unchanged) or "pink" - Phase 1 sections (01-04) only. */
  accent?: "ink" | "pink";
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** A single thin line plus a numeric "01 / 06" label - no dot stepper. */
export function ProgressLine({ total, current, accent = "ink" }: ProgressLineProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
    >
      <div className="h-px w-full bg-[var(--ng-line)]">
        <div
          className="h-px transition-[width] duration-300"
          style={{
            width: `${((current + 1) / total) * 100}%`,
            background: accent === "pink" ? "var(--ng-hotpink)" : "var(--ng-ink)",
          }}
        />
      </div>
      <div className="ng-sans-en mt-2 text-xs tracking-[0.2em] opacity-50">
        {pad(current + 1)} / {pad(total)}
      </div>
    </div>
  );
}
