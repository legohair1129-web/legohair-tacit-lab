"use client";

type CardOption = { value: string; label: string; description?: string };

export function RadioCards({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: CardOption[];
  value: string | null;
  onChange: (next: string) => void;
  columns?: 1 | 2;
}) {
  return (
    <div className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${
              active ? "border-foreground bg-foreground text-background" : "border-border bg-surface"
            }`}
          >
            <div className="text-sm font-semibold">{opt.label}</div>
            {opt.description && (
              <div className={`mt-0.5 text-xs ${active ? "text-background/70" : "text-muted"}`}>
                {opt.description}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
