interface SectionProps {
  id: string;
  index?: string; // "01" etc.
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "surface" | "ink";
}

const TONE_CLASSES: Record<NonNullable<SectionProps["tone"]>, string> = {
  light: "bg-[var(--ng-bg)] text-[var(--ng-ink)]",
  surface: "bg-[var(--ng-surface)] text-[var(--ng-ink)]",
  ink: "bg-[var(--ng-ink)] text-white",
};

export function Section({
  id,
  index,
  eyebrow,
  title,
  children,
  className = "",
  tone = "light",
}: SectionProps) {
  return (
    <section
      id={id}
      data-section={id}
      className={`px-6 py-16 sm:py-20 ${TONE_CLASSES[tone]} ${className}`}
    >
      <div className="mx-auto max-w-md">
        {(index || eyebrow) && (
          <div className="mb-4 flex items-baseline gap-2 text-xs tracking-widest opacity-60">
            {index && <span>{index}</span>}
            {eyebrow && <span>{eyebrow}</span>}
          </div>
        )}
        {title && (
          <h2 className="mb-8 whitespace-pre-line text-2xl font-bold leading-snug">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
