interface ProgressLineProps {
  total: number;
  current: number; // 0-indexed
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** A single thin line plus a numeric "01 / 06" label - no dot stepper. */
export function ProgressLine({ total, current }: ProgressLineProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
    >
      <div className="h-px w-full bg-[var(--ng-line)]">
        <div
          className="h-px bg-[var(--ng-ink)] transition-[width] duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>
      <div className="ng-sans-en mt-2 text-xs tracking-[0.2em] opacity-50">
        {pad(current + 1)} / {pad(total)}
      </div>
    </div>
  );
}
