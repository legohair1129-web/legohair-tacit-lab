interface LegonProps {
  text: string;
  className?: string;
}

/**
 * レゴン as a minimal mark, not a chat avatar with a speech bubble - a
 * future guide, not an AI chatbot. One short line, no card.
 */
export function Legon({ text, className = "" }: LegonProps) {
  return (
    <p className={`flex items-baseline gap-3 text-sm leading-relaxed ${className}`}>
      <span className="ng-sans-en shrink-0 text-[11px] font-bold tracking-[0.15em] opacity-50">
        N
      </span>
      <span className="opacity-75">{text}</span>
    </p>
  );
}
