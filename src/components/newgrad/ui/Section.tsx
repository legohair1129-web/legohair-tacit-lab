interface SectionProps {
  id: string;
  index?: string; // big chapter numeral, e.g. "03"
  kicker?: string; // small EN uppercase line above the headline
  title?: React.ReactNode; // headline content - sections compose their own EN/JP mix
  lead?: React.ReactNode; // optional supporting paragraph under the headline
  tone?: "ivory" | "ivory-2" | "ink";
  pad?: "s" | "m" | "l";
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}

const TONE_CLASSES: Record<NonNullable<SectionProps["tone"]>, string> = {
  ivory: "bg-[var(--ng-ivory)] text-[var(--ng-ink)]",
  "ivory-2": "bg-[var(--ng-ivory-2)] text-[var(--ng-ink)]",
  ink: "bg-[var(--ng-ink)] text-[var(--ng-ivory)]",
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
        {index && (
          <div
            aria-hidden
            className="ng-sans-en mb-6 text-[13px] font-medium tracking-[0.3em] opacity-45"
          >
            {index}
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
