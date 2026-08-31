interface LegonProps {
  text: string;
  className?: string;
}

/**
 * レゴン - a guide, not an AI recruiter. Renders a fixed comment (see
 * src/lib/newgrad/legon.ts). Keeping this component dumb (text in, bubble
 * out) is what lets a future version swap the text source for a live
 * generated comment without touching this file.
 */
export function Legon({ text, className = "" }: LegonProps) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ng-accent)] text-xs font-bold text-white"
      >
        レゴン
      </div>
      <div className="flex-1 rounded-2xl rounded-tl-sm border border-[var(--ng-border)] bg-white px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-[var(--ng-ink)]">
        {text}
      </div>
    </div>
  );
}
