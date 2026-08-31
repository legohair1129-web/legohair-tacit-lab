import type { ImageSlot } from "@/lib/newgrad/data/images";
import { Photo } from "./Photo";

interface PhotoCardProps {
  slot: ImageSlot;
  index: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  aspect?: string;
  className?: string;
}

/**
 * A photo + short label, selectable with a quiet HOT PINK ring instead of
 * an inverted background - keeps the warm/real photography visible even
 * once picked.
 */
export function PhotoCard({
  slot,
  index,
  label,
  selected = false,
  onClick,
  aspect = "aspect-[3/4]",
  className = "",
}: PhotoCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group block w-full text-left ${className}`}
    >
      <div
        className={`relative rounded-[22px] transition-[box-shadow] duration-200 ${
          selected ? "shadow-[0_0_0_3px_var(--ng-hotpink)]" : "shadow-[0_0_0_1px_var(--ng-line)]"
        }`}
      >
        <Photo slot={slot} aspect={aspect} rounded="rounded-[20px]" />
      </div>
      <p
        className={`mt-3 flex items-baseline gap-2 text-sm leading-snug font-medium transition-colors ${
          selected ? "text-[var(--ng-hotpink)]" : "text-[var(--ng-ink)]"
        }`}
      >
        <span className="ng-sans-en text-[11px] font-semibold tracking-widest opacity-45">
          {index}
        </span>
        {label}
      </p>
    </button>
  );
}
