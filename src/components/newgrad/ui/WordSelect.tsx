interface WordSelectProps {
  word: string; // big EN word, e.g. "CREATE"
  caption: string; // small JP caption underneath
  selected?: boolean;
  onClick?: () => void;
  /** Unselected font-size class - lets a list of rows "float" at varied
   * sizes instead of all starting identical (Phase 4 only; default keeps
   * every existing caller's look unchanged). */
  baseSize?: string;
}

/**
 * One big word per row. Selecting doesn't add a box or border - the word
 * itself grows, gains an underline, and shifts slightly.
 */
export function WordSelect({
  word,
  caption,
  selected = false,
  onClick,
  baseSize = "text-2xl",
}: WordSelectProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-baseline justify-between border-b border-[var(--ng-line)] py-5 text-left transition-[transform,opacity] duration-300 first:border-t ${
        selected ? "translate-x-2" : "translate-x-0"
      }`}
    >
      <span>
        <span
          className={`ng-sans-en block font-semibold tracking-tight transition-[font-size] duration-300 ${
            selected ? "text-4xl" : `${baseSize} opacity-55`
          }`}
        >
          {word}
        </span>
        <span
          className={`mt-1 block text-xs ${selected ? "opacity-70" : "opacity-40"}`}
        >
          {caption}
        </span>
      </span>
      <span
        aria-hidden
        className={`h-px shrink-0 bg-[var(--ng-ink)] transition-all duration-300 ${
          selected ? "w-8 opacity-100" : "w-0 opacity-0"
        }`}
      />
    </button>
  );
}
