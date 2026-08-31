interface ChoiceRowProps {
  index?: string; // "A", "01" etc.
  label: string;
  sub?: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "lg";
  /** "ink" (default, unchanged) or "pink" - Phase 1 sections (01-04) only. */
  accent?: "ink" | "pink";
}

/**
 * Full-bleed tappable row: a hairline divider and a quiet background swap
 * on selection stand in for the rounded "choice card" grid the previous
 * version used everywhere.
 */
export function ChoiceRow({
  index,
  label,
  sub,
  selected = false,
  onClick,
  disabled = false,
  size = "sm",
  accent = "ink",
}: ChoiceRowProps) {
  const selectedClass =
    accent === "pink"
      ? "bg-[var(--ng-hotpink-soft)] text-[var(--ng-ink)]"
      : "bg-[var(--ng-ink)] text-[var(--ng-ivory)]";
  const hoverClass =
    accent === "pink" ? "hover:bg-[var(--ng-hotpink-soft)]" : "hover:bg-[var(--ng-line-soft)]";
  const indexClass = accent === "pink" ? "text-[var(--ng-hotpink)] opacity-100" : "opacity-50";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`flex w-full items-baseline gap-4 border-b border-[var(--ng-line)] px-1 text-left transition-colors first:border-t disabled:cursor-not-allowed disabled:opacity-35 ${
        size === "lg" ? "py-7" : "py-5"
      } ${selected ? selectedClass : `bg-transparent text-[var(--ng-ink)] ${hoverClass}`}`}
    >
      {index && (
        <span
          className={`ng-sans-en w-6 shrink-0 text-xs font-semibold tracking-widest ${indexClass}`}
        >
          {index}
        </span>
      )}
      <span className="flex-1">
        <span
          className={`block leading-snug ${size === "lg" ? "text-lg" : "text-[15px]"}`}
        >
          {label}
        </span>
        {sub && (
          <span
            className={`mt-1 block text-xs leading-relaxed ${
              selected ? "opacity-70" : "opacity-55"
            }`}
          >
            {sub}
          </span>
        )}
      </span>
    </button>
  );
}
