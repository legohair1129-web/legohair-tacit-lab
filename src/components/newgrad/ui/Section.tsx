interface SectionProps {
  id: string;
  index?: string; // big chapter numeral, e.g. "03"
  kicker?: string; // small EN uppercase line above the headline
  title?: React.ReactNode; // headline content - sections compose their own EN/JP mix
  lead?: React.ReactNode; // optional supporting paragraph under the headline
  tone?: "ivory" | "ivory-2" | "ink" | "pink-tint" | "beige-tint";
  pad?: "s" | "m" | "l";
  align?: "left" | "center";
  /** Small HOT PINK dot beside the chapter numeral - opt-in (Phase 1 only). */
  accentIndex?: boolean;
  /** Short HOT PINK tick mark at the very top of the content column -
   * opt-in (Phase 1 only), an unmistakable "new chapter" mark. */
  topLine?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const TONE_CLASSES: Record<NonNullable<SectionProps["tone"]>, string> = {
  ivory: "bg-[var(--ng-ivory)] text-[var(--ng-ink)]",
  "ivory-2": "bg-[var(--ng-ivory-2)] text-[var(--ng-ink)]",
  ink: "bg-[var(--ng-ink)] text-[var(--ng-ivory)]",
  "pink-tint": "bg-[var(--ng-pink-tint)] text-[var(--ng-ink)]",
  "beige-tint": "bg-[var(--ng-beige-tint)] text-[var(--ng-ink)]",
};

const PAD_CLASSES: Record<NonNullable<SectionProps["pad"]>, string> = {
  s: "py-[var(--ng-pad-s)]",
  m: "py-[var(--ng-pad-m)]",
  l: "py-[var(--ng-pad-l)]",
};

/**
 * Editorial section frame: generous, uneven whitespace and a large faint
 * chapter numeral stand in for the card grids the previous version used.
 * Each section composes its own headline (mixing the serif EN face and the
 * Japanese sans) inside `title`; this shell only sets rhythm and tone.
 */
export function Section({
  id,
  index,
  kicker,
  title,
  lead,
  tone = "ivory",
  pad = "m",
  align = "left",
  accentIndex = false,
  topLine = false,
  className = "",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      data-section={id}
      className={`px-6 ${PAD_CLASSES[pad]} ${TONE_CLASSES[tone]} ${className}`}
    >
      <div
        className={`mx-auto max-w-md ${align === "center" ? "text-center" : ""}`}
      >
        {topLine && (
          <div
            aria-hidden
            className={`mb-10 h-[2px] w-10 bg-[var(--ng-hotpink)] ${
              align === "center" ? "mx-auto" : ""
            }`}
          />
        )}
        {index && (
          <div aria-hidden className="mb-6 flex items-center gap-2">
            {accentIndex && (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ng-hotpink)]" />
            )}
            <span className="ng-sans-en text-[13px] font-medium tracking-[0.3em] opacity-45">
              {index}
            </span>
          </div>
        )}
        {kicker && (
          <div className="ng-sans-en mb-3 text-xs font-semibold tracking-[0.22em] uppercase opacity-60">
            {kicker}
          </div>
        )}
        {title && (
          <h2 className="ng-reveal mb-6 text-[2rem] leading-[1.15] font-medium tracking-tight">
            {title}
          </h2>
        )}
        {lead && (
          <p className="mb-10 max-w-[32ch] text-sm leading-relaxed opacity-70">
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
