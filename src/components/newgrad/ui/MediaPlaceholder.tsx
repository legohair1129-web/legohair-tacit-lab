interface MediaPlaceholderProps {
  label: string;
  aspect?: "portrait" | "square" | "wide";
  className?: string;
}

const ASPECT_CLASSES: Record<
  NonNullable<MediaPlaceholderProps["aspect"]>,
  string
> = {
  portrait: "aspect-[9/16]",
  square: "aspect-square",
  wide: "aspect-video",
};

/**
 * Stand-in for photo/video assets that aren't produced yet. Always reserves
 * its final aspect ratio up front so nothing shifts (CLS) once real media
 * is dropped in later - swap the contents of this component only.
 */
export function MediaPlaceholder({
  label,
  aspect = "portrait",
  className = "",
}: MediaPlaceholderProps) {
  return (
    <div
      className={`flex ${ASPECT_CLASSES[aspect]} w-full items-center justify-center rounded-2xl border border-dashed border-[var(--ng-border)] bg-[var(--ng-surface)] ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="px-4 text-center text-xs tracking-widest text-[var(--ng-muted)]">
        [ {label} ]
      </span>
    </div>
  );
}
