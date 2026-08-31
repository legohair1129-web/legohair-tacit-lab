interface IndexRowProps {
  index: string; // "01"
  label: string; // "FACE"
  detail?: React.ReactNode;
  onClick?: () => void; // pass to make this an accordion row
  open?: boolean;
}

/**
 * A single numbered editorial index row (e.g. "01 FACE"), with an optional
 * expandable detail. Reused for static indexes (FACE/COLOR/... , growth
 * elements, salon-tour spots) and as the RECRUIT INFO accordion row.
 */
export function IndexRow({ index, label, detail, onClick, open }: IndexRowProps) {
  const interactive = typeof onClick === "function";
  const expanded = interactive ? Boolean(open) : Boolean(detail);

  const content = (
    <>
      <span className="flex w-full items-center justify-between gap-4">
        <span className="flex items-baseline gap-4">
          <span className="ng-sans-en text-xs font-semibold tracking-widest opacity-45">
            {index}
          </span>
          <span className="ng-sans-en text-base font-semibold tracking-wide">
            {label}
          </span>
        </span>
        {interactive && (
          <span aria-hidden className="text-sm opacity-50">
            {open ? "−" : "+"}
          </span>
        )}
      </span>
      {expanded && detail && (
        <span className="ng-reveal mt-2 block max-w-[36ch] text-sm leading-relaxed opacity-65">
          {detail}
        </span>
      )}
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-expanded={open}
        className="block w-full border-b border-[var(--ng-line)] py-4 text-left first:border-t"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="border-b border-[var(--ng-line)] py-4 first:border-t">
      {content}
    </div>
  );
}
