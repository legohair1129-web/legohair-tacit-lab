interface ProgressDotsProps {
  total: number;
  current: number; // 0-indexed
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i <= current ? "bg-[var(--ng-pop)]" : "bg-[var(--ng-border)]"
          }`}
        />
      ))}
    </div>
  );
}
