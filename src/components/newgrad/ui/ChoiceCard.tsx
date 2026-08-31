interface ChoiceCardProps {
  label: string;
  sub?: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function ChoiceCard({
  label,
  sub,
  selected = false,
  onClick,
  disabled = false,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`w-full rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        selected
          ? "border-[var(--ng-pop)] bg-[var(--ng-pop-soft)] text-[var(--ng-ink)]"
          : "border-[var(--ng-border)] bg-white text-[var(--ng-ink)] hover:border-[var(--ng-accent)]"
      }`}
    >
      {label}
      {sub && (
        <span className="mt-1 block text-xs font-normal text-[var(--ng-muted)]">
          {sub}
        </span>
      )}
    </button>
  );
}
